import { describe, it, expect } from "vitest";
import { normalizeMathDelimiters } from "./math-delimiters";

describe("normalizeMathDelimiters", () => {
  describe("idempotence", () => {
    it("returns the same result when applied twice", () => {
      const input =
        "A Lei de Faraday: $$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$";
      const once = normalizeMathDelimiters(input);
      const twice = normalizeMathDelimiters(once);
      expect(twice).toBe(once);
    });

    it("does not alter already-valid block formula", () => {
      const input = "$$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$";
      expect(normalizeMathDelimiters(input)).toBe(input);
    });

    it("does not alter already-valid inline formula", () => {
      const input = "A pressão é $P = \\frac{F}{A}$ em Pascal.";
      expect(normalizeMathDelimiters(input)).toBe(input);
    });
  });

  describe("Pass 1: parentheses → dollar signs", () => {
    it("converts ( \\frac{...}{...} ) to $...$", () => {
      const input = "A fórmula é ( \\frac{F}{A} ) simples.";
      const result = normalizeMathDelimiters(input);
      expect(result).toContain("$\\frac{F}{A}$");
      expect(result).not.toContain("( \\frac");
    });

    it("converts ( \\mathcal{E} = -\\frac{d\\Phi_B}{dt} )", () => {
      const input =
        "A lei é ( \\mathcal{E} = -\\frac{d\\Phi_B}{dt} ) importante.";
      const result = normalizeMathDelimiters(input);
      expect(result).toContain(
        "$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$",
      );
    });
  });

  describe("Pass 2: partial-$ wrapping fix", () => {
    it("merges prefix$inner$ suffix\\cmd into one $...$", () => {
      const input = "P$\\text{ás}$ = \\frac{4}{52}";
      const result = normalizeMathDelimiters(input);
      expect(result).toContain("$P\\text{ás} = \\frac{4}{52}$");
    });
  });

  describe("Pass 3: merge adjacent inline math", () => {
    it("merges $a$ = $b$ into $a = b$", () => {
      const input = "$\\frac{3}{6}$ = $\\frac{1}{2}$";
      const result = normalizeMathDelimiters(input);
      expect(result).toBe("$\\frac{3}{6} = \\frac{1}{2}$");
    });

    it("merges chained $a$ + $b$ = $c$", () => {
      const input = "$a$ + $b$ = $c$";
      const result = normalizeMathDelimiters(input);
      expect(result).toBe("$a + b = c$");
    });
  });

  describe("Pass 4: orphan LaTeX on standalone lines", () => {
    it("wraps a standalone orphan formula in $$...$$", () => {
      const input = "\\mathcal{E} = -\\frac{d\\Phi_B}{dt}";
      const result = normalizeMathDelimiters(input);
      expect(result).toBe(
        "$$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$",
      );
    });

    it("does NOT corrupt a line that already has valid $$...$$", () => {
      const input =
        "$$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$";
      const result = normalizeMathDelimiters(input);
      expect(result).toBe(input);
    });

    it("does not strip $ from lines with mixed text + valid $...$", () => {
      const input =
        "onde $\\mathcal{E}$ é a FEM induzida e $\\Phi_B$ é o fluxo.";
      const result = normalizeMathDelimiters(input);
      expect(result).toBe(input);
    });

    it("skips markdown heading lines", () => {
      const input = "## \\frac{F}{A} seção título";
      const result = normalizeMathDelimiters(input);
      expect(result).toBe(input);
    });

    it("skips list item lines", () => {
      const input = "- \\frac{F}{A} item";
      const result = normalizeMathDelimiters(input);
      expect(result).toBe(input);
    });
  });

  describe("real-world regression: Faraday formula", () => {
    it("preserves block formula on its own line", () => {
      const md = [
        "## Lei de Faraday",
        "",
        "$$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$",
        "",
        "onde $\\mathcal{E}$ é a FEM e $\\Phi_B$ é o fluxo.",
      ].join("\n");

      const result = normalizeMathDelimiters(md);
      expect(result).toBe(md);
    });
  });
});
