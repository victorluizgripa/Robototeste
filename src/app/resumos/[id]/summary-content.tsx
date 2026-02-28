"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useMemo } from "react";
import { normalizeMathDelimiters } from "@/lib/math-delimiters";

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
