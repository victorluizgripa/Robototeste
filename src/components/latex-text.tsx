import katex from "katex";

type LatexTextProps = {
  text: string;
  className?: string;
};

const LATEX_REGEX = /(\$\$[\s\S]+?\$\$|\$(?!\s)[\s\S]+?(?<!\s)\$)/g;

export function LatexText({ text, className }: LatexTextProps) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const regex = new RegExp(LATEX_REGEX.source, "g");

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    const raw = match[0];
    const isBlock = raw.startsWith("$$");
    const formula = isBlock ? raw.slice(2, -2) : raw.slice(1, -1);

    try {
      const html = katex.renderToString(formula, {
        throwOnError: false,
        displayMode: isBlock,
      });

      parts.push(
        <span
          key={key++}
          className={isBlock ? "block my-1" : "inline"}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(<span key={key++}>{raw}</span>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return <span className={className}>{parts}</span>;
}
