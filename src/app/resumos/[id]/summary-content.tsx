"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useMemo } from "react";

/**
 * Checks if a line contains LaTeX commands (\word) outside of $...$ delimiters.
 */
function hasLatexOutsideDollars(line: string): boolean {
  let depth = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "$" && (i === 0 || line[i - 1] !== "\\")) {
      depth = depth === 0 ? 1 : 0;
      continue;
    }
    if (
      depth === 0 &&
      line[i] === "\\" &&
      i + 1 < line.length &&
      /[a-zA-Z]/.test(line[i + 1])
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Multi-pass normalizer that fixes common broken LaTeX patterns produced by LLMs:
 *  1. ( ... \cmd... ) → $...$
 *  2. Merge partial-$ formulas: prefix$inner$suffix\cmd → $prefix inner suffix\cmd$
 *  3. Merge adjacent $a$ op $b$ → $a op b$
 *  4. Standalone formula lines with \cmd outside $ → $$...$$
 */
function normalizeMathDelimiters(md: string): string {
  let result = md;

  // Pass 1: ( ... \cmd... ) → $...$
  result = result.replace(
    /\(\s*([^)]*\\[a-zA-Z][^)]*)\s*\)/g,
    (_, inner) => `$${inner.trim()}$`,
  );

  // Pass 2: Fix partial $ wrapping where \cmd leaks outside $...$
  // e.g. "P$\text{ás}$ = \frac{4}{52}" → "$P\text{ás} = \frac{4}{52}$"
  result = result.replace(
    /([A-Za-z0-9()]{0,10})\$([^$]+)\$((?:\s*[=<>+\-,.;:]+\s*|\s+)[^$\n]*\\[a-zA-Z][^$\n]*)/g,
    (_, pre, inner, suf) => `$${pre}${inner}${suf.trimEnd()}$`,
  );

  // Pass 3: Merge adjacent inline math separated by operators
  // e.g. "$\frac{3}{6}$ = $\frac{1}{2}$" → "$\frac{3}{6} = \frac{1}{2}$"
  for (let i = 0; i < 3; i++) {
    result = result.replace(
      /\$([^$]+)\$(\s*[=<>+\-±≤≥≈≠×÷]\s*)\$([^$]+)\$/g,
      (_, a, op, b) => `$${a.trim()} ${op.trim()} ${b.trim()}$`,
    );
  }

  // Pass 4: Standalone formula lines with \cmd outside $ → wrap in $$...$$
  result = result
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (
        !trimmed ||
        /^[#>\-*+|]|^\d+\.\s|^\$\$/.test(trimmed) ||
        trimmed.length > 120
      ) {
        return line;
      }
      if (!hasLatexOutsideDollars(trimmed)) return line;
      const stripped = trimmed.replace(/\$/g, "");
      const indent = line.match(/^(\s*)/)?.[1] ?? "";
      return `${indent}$$${stripped}$$`;
    })
    .join("\n");

  return result;
}

type Props = {
  markdown: string;
};

export function SummaryContent({ markdown }: Props) {
  const normalizedMarkdown = useMemo(
    () => normalizeMathDelimiters(markdown),
    [markdown],
  );

  return (
    <article
      className={
        "prose prose-sm max-w-none text-txt " +
        "prose-headings:text-txt prose-headings:font-bold " +
        "prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-l-4 prose-h2:border-accent-500 prose-h2:pl-3 " +
        "prose-h3:text-base prose-h3:mt-4 prose-h3:mb-1 prose-h3:border-l-[3px] prose-h3:border-accent-500 prose-h3:pl-3 " +
        "prose-p:text-txt-2 prose-p:leading-relaxed prose-strong:text-txt " +
        "[&_ul_li]:marker:text-accent-500 prose-li:text-txt-2 " +
        "prose-blockquote:border-l-4 prose-blockquote:border-accent-500 prose-blockquote:bg-accent-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-blockquote:not-italic prose-blockquote:border-t-0 prose-blockquote:border-r-0 prose-blockquote:border-b-0 " +
        "prose-table:text-xs prose-table:border prose-table:border-border prose-table:border-collapse " +
        "prose-th:bg-surface-2 prose-th:px-3 prose-th:py-2 prose-th:text-txt prose-th:border prose-th:border-border " +
        "prose-td:px-3 prose-td:py-2 prose-td:text-txt-2 prose-td:border prose-td:border-border " +
        "summary-content " +
        "prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline"
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalizedMarkdown}
      </ReactMarkdown>
    </article>
  );
}
