import type { QuestionCardData } from "@/app/questoes/page";
import { LatexText } from "@/components/latex-text";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type QuestionCardProps = {
  question: QuestionCardData;
  status?: "not_started" | "correct" | "incorrect";
};

const STATUS_CONFIG = {
  not_started: { label: "Não resolvida", variant: "default" as const },
  correct: { label: "Acertei", variant: "success" as const },
  incorrect: { label: "Errei", variant: "error" as const },
} as const;

export function QuestionCard({
  question,
  status = "not_started",
}: QuestionCardProps) {
  const themeData = Array.isArray(question.theme)
    ? question.theme[0]
    : question.theme;
  const themeName = themeData?.name;
  const subjectData = Array.isArray(themeData?.subject)
    ? themeData.subject[0]
    : themeData?.subject;
  const subjectName = subjectData?.name;
  const statusCfg = STATUS_CONFIG[status];

  return (
    <Card hover className="flex h-full flex-col p-5">
      <header className="flex items-start justify-between gap-2">
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        <BookmarkIcon />
      </header>

      <div className="mt-3 flex-1 text-sm leading-relaxed text-txt-2">
        <LatexText text={truncate(question.question_text, 200)} />
      </div>

      <footer className="mt-4 flex items-end justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {subjectName && <Badge>{truncate(subjectName, 28)}</Badge>}
          {themeName && <Badge>{truncate(themeName, 28)}</Badge>}
        </div>
        <span className="shrink-0 text-xs font-semibold text-accent-600 group-hover:underline">
          Resolver
        </span>
      </footer>
    </Card>
  );
}

function BookmarkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-4 w-4 shrink-0 text-txt-3 hover:text-accent-500 transition-colors"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
      />
    </svg>
  );
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
