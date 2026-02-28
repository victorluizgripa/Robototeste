/**
 * Idempotent normalizer for LaTeX math delimiters in markdown.
 *
 * Fixes common broken patterns produced by LLMs:
 *  Pass 1: ( ... \cmd... ) → $...$
 *  Pass 2: Merge partial-$ wrapping where \cmd leaks outside
 *  Pass 3: Merge adjacent $a$ op $b$ → $a op b$
 *  Pass 4: Wrap orphan LaTeX commands on standalone lines in $$...$$ (safe)
 *
 * Designed to be called on both server (before persisting) and client
 * (for legacy data). Multiple calls produce the same result.
 */

const LATEX_CMD = /\\[a-zA-Z]/;

/**
 * Returns ranges [start, end) of well-formed $...$ or $$...$$ in a line.
 * Used by Pass 4 to avoid touching already-delimited content.
 */
function getMathRanges(line: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === "$" && (i === 0 || line[i - 1] !== "\\")) {
      const isBlock = line[i + 1] === "$";
      const delimiter = isBlock ? "$$" : "$";
      const start = i;
      i += delimiter.length;

      const closeIdx = line.indexOf(delimiter, i);
      if (closeIdx === -1) break;

      const end = closeIdx + delimiter.length;
      ranges.push([start, end]);
      i = end;
    } else {
      i++;
    }
  }
  return ranges;
}

/**
 * Checks if position `pos` falls inside any of the given ranges.
 */
function insideRanges(pos: number, ranges: Array<[number, number]>): boolean {
  return ranges.some(([s, e]) => pos >= s && pos < e);
}

/**
 * Finds spans of orphan LaTeX (commands outside any $) in a single line.
 * Returns array of [start, end) for each orphan span.
 *
 * A span starts at the first orphan `\cmd` and extends to the last
 * character that is part of the same logical formula (digits, braces,
 * operators, spaces between formula tokens, and further `\cmd`).
 */
function findOrphanSpans(
  line: string,
  mathRanges: Array<[number, number]>,
): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  let i = 0;

  while (i < line.length) {
    if (
      line[i] === "\\" &&
      i + 1 < line.length &&
      /[a-zA-Z]/.test(line[i + 1]) &&
      !insideRanges(i, mathRanges)
    ) {
      let spanStart = i;

      // Extend backwards to capture prefix (e.g. leading minus sign, digits)
      while (
        spanStart > 0 &&
        /[\s\d+\-=<>.,^_{}()|]/.test(line[spanStart - 1]) &&
        !insideRanges(spanStart - 1, mathRanges)
      ) {
        spanStart--;
      }

      // Extend forward to end of formula tokens
      let spanEnd = i;
      while (spanEnd < line.length && !insideRanges(spanEnd, mathRanges)) {
        const ch = line[spanEnd];
        if (
          /[a-zA-Z0-9\s+\-=<>.,^_{}()\\|/]/.test(ch) ||
          ch === "·" ||
          ch === "×" ||
          ch === "÷"
        ) {
          spanEnd++;
        } else {
          break;
        }
      }

      // Trim trailing whitespace from span
      while (spanEnd > spanStart && /\s/.test(line[spanEnd - 1])) {
        spanEnd--;
      }

      if (spanEnd > spanStart) {
        spans.push([spanStart, spanEnd]);
      }

      i = spanEnd;
    } else {
      i++;
    }
  }

  return spans;
}

export function normalizeMathDelimiters(md: string): string {
  let result = md;

  // Pass 1: ( ... \cmd... ) → $...$
  result = result.replace(
    /\(\s*([^)]*\\[a-zA-Z][^)]*)\s*\)/g,
    (_, inner) => `$${(inner as string).trim()}$`,
  );

  // Pass 2: Fix partial-$ wrapping where \cmd leaks outside $...$
  result = result.replace(
    /([A-Za-z0-9()]{0,10})\$([^$]+)\$((?:\s*[=<>+\-,.;:]+\s*|\s+)[^$\n]*\\[a-zA-Z][^$\n]*)/g,
    (_, pre, inner, suf) =>
      `$${pre as string}${inner as string}${(suf as string).trimEnd()}$`,
  );

  // Pass 3: Merge adjacent inline math separated by operators
  for (let i = 0; i < 3; i++) {
    result = result.replace(
      /\$([^$]+)\$(\s*[=<>+\-±≤≥≈≠×÷]\s*)\$([^$]+)\$/g,
      (_, a, op, b) =>
        `$${(a as string).trim()} ${(op as string).trim()} ${(b as string).trim()}$`,
    );
  }

  // Pass 4 (safe): Wrap only orphan LaTeX spans — never strip existing $
  result = result
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (
        !trimmed ||
        /^[#>\-*+|]|^\d+\.\s/.test(trimmed) ||
        trimmed.length > 200
      ) {
        return line;
      }

      const mathRanges = getMathRanges(trimmed);

      // Quick check: any \cmd outside math ranges?
      let hasOrphan = false;
      for (let j = 0; j < trimmed.length - 1; j++) {
        if (
          trimmed[j] === "\\" &&
          /[a-zA-Z]/.test(trimmed[j + 1]) &&
          !insideRanges(j, mathRanges)
        ) {
          hasOrphan = true;
          break;
        }
      }
      if (!hasOrphan) return line;

      // If the whole line is a formula (no significant non-formula text),
      // wrap the entire trimmed content in $$...$$ (block mode).
      const nonMathText = extractNonMathText(trimmed, mathRanges);
      if (!nonMathText || !LATEX_CMD.test(nonMathText)) {
        // Line is purely math or already well-delimited; skip
        return line;
      }

      // Check if the line is essentially only a formula
      const stripped = nonMathText.replace(/[\s=<>+\-.,;:^_{}()|/·×÷0-9]/g, "");
      const isStandalone = stripped.length === 0 || LATEX_CMD.test(stripped);

      if (isStandalone && mathRanges.length === 0) {
        // Entire line is an unwrapped formula → block $$...$$
        const indent = line.match(/^(\s*)/)?.[1] ?? "";
        return `${indent}$$${trimmed}$$`;
      }

      // Otherwise, wrap only orphan spans inline with $...$
      const spans = findOrphanSpans(trimmed, mathRanges);
      if (spans.length === 0) return line;

      let built = "";
      let cursor = 0;
      for (const [s, e] of spans) {
        built += trimmed.slice(cursor, s);
        built += `$${trimmed.slice(s, e)}$`;
        cursor = e;
      }
      built += trimmed.slice(cursor);

      const indent = line.match(/^(\s*)/)?.[1] ?? "";
      return `${indent}${built}`;
    })
    .join("\n");

  return result;
}

function extractNonMathText(
  line: string,
  mathRanges: Array<[number, number]>,
): string {
  let text = "";
  let cursor = 0;
  for (const [s, e] of mathRanges) {
    text += line.slice(cursor, s);
    cursor = e;
  }
  text += line.slice(cursor);
  return text.trim();
}
