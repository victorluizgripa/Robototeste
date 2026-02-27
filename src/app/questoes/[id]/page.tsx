import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LatexText } from "@/components/latex-text";
import { QuestionAnswerForm } from "./answer-form";

type Params = { id: string };

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: question, error } = await supabase
    .from("question_bank")
    .select(
      `
      id,
      question_text,
      options,
      correct_answer,
      banca,
      difficulty,
      explanation,
      option_justifications,
      full_analysis,
      roboto_tip,
      theoretical_support,
      reference_links,
      theme:themes (
        id,
        name,
        subject:subjects (
          id,
          name
        )
      )
    `
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !question) {
    notFound();
  }

  const themeData = Array.isArray(question.theme)
    ? question.theme[0]
    : question.theme;
  const themeName = themeData?.name;
  const subjectData = Array.isArray(themeData?.subject)
    ? themeData.subject[0]
    : themeData?.subject;
  const subjectName = subjectData?.name;
  const options = Array.isArray(question.options)
    ? (question.options as { key?: string; letter?: string; text?: string }[])
        .map((opt) => ({
          key: String(opt.key ?? opt.letter ?? "").trim(),
          text: String(opt.text ?? "").trim(),
        }))
        .filter((opt) => opt.key && opt.text)
    : [];
  const justifications = question.option_justifications as Record<
    string,
    string
  > | null;
  const referenceLinks = Array.isArray(question.reference_links)
    ? (question.reference_links as string[])
    : [];

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Breadcrumb
          segments={[
            { label: "Home", href: "/" },
            { label: "Banco de Questões", href: "/questoes" },
            { label: "Questão" },
          ]}
        />

        <Card className="p-6 md:p-8 space-y-6">
          <header className="flex flex-wrap items-center gap-2">
            {subjectName && <Badge variant="accent">{subjectName}</Badge>}
            {themeName && <Badge>{themeName}</Badge>}
            {question.banca && <Badge>{question.banca}</Badge>}
            {typeof question.difficulty === "number" && (
              <DifficultyIndicator value={question.difficulty} />
            )}
          </header>

          <div className="text-sm leading-relaxed text-txt-2">
            <LatexText text={question.question_text} />
          </div>

          <QuestionAnswerForm
            questionId={question.id}
            userId={user.id}
            options={options}
            correctAnswer={question.correct_answer}
            explanation={question.explanation}
            justifications={justifications}
            robotoTip={question.roboto_tip}
            fullAnalysis={question.full_analysis}
            theoreticalSupport={question.theoretical_support}
            referenceLinks={referenceLinks}
          />
        </Card>
      </div>
    </main>
  );
}

function DifficultyIndicator({ value }: { value: number }) {
  const max = 5;
  const normalized = Math.min(Math.max(Math.round(value), 1), max);

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-surface-2 border border-border px-2.5 py-1">
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 w-3 rounded-full transition-colors ${
            index < normalized ? "bg-accent-500" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}
