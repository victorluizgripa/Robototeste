"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LatexText } from "@/components/latex-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  recordAnswer,
  updateReviewDuration,
  getRandomQuestionId,
} from "./actions";

type OptionItem = { key: string; text: string };

type QuestionAnswerFormProps = {
  questionId: string;
  userId: string;
  options: OptionItem[];
  correctAnswer: string;
  explanation: string | null;
  justifications: Record<string, string> | null;
  robotoTip: string | null;
  fullAnalysis: string | null;
  theoreticalSupport: string | null;
  referenceLinks: string[];
};

export function QuestionAnswerForm({
  questionId,
  options,
  correctAnswer,
  explanation,
  justifications,
  robotoTip,
  fullAnalysis,
  theoreticalSupport,
  referenceLinks,
}: QuestionAnswerFormProps) {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(
    new Set()
  );
  const [showTheory, setShowTheory] = useState(false);
  const [navigating, startNavigating] = useTransition();

  const startedAtRef = useRef<number>(Date.now());
  const answeredAtRef = useRef<number | null>(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const toggleOption = (key: string) => {
    setExpandedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSelect = (key: string) => {
    if (revealed) return;
    setSelected(key);
  };

  const handleConfirm = async () => {
    if (!selected) return;

    const now = Date.now();
    answeredAtRef.current = now;
    const solveDurationMs = now - startedAtRef.current;
    const isCorrect = selected === correctAnswer;

    setRevealed(true);

    const defaultExpanded = new Set<string>();
    defaultExpanded.add(selected);
    if (!isCorrect) defaultExpanded.add(correctAnswer);
    setExpandedOptions(defaultExpanded);

    const result = await recordAnswer({
      questionId,
      selectedAnswer: selected,
      isCorrect,
      solveDurationMs,
    });

    if (result) {
      setAnswerId(result.id);
    }
  };

  const handleNext = () => {
    startNavigating(async () => {
      if (answerId && answeredAtRef.current) {
        const now = Date.now();
        const reviewDurationMs = now - answeredAtRef.current;
        const totalDurationMs = now - startedAtRef.current;
        await updateReviewDuration({
          answerId,
          reviewDurationMs,
          totalDurationMs,
        });
      }

      const nextId = await getRandomQuestionId(questionId);
      if (nextId) {
        router.push(`/questoes/${nextId}`);
      } else {
        router.push("/questoes");
      }
    });
  };

  const isCorrect = selected === correctAnswer;

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-txt-3 uppercase tracking-wide">
        Alternativas
      </p>

      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selected === option.key;
          const isAnswer = option.key === correctAnswer;
          const isExpanded = expandedOptions.has(option.key);
          const hasJustification = !!justifications?.[option.key];

          let borderClass = "border-border";
          let bgClass = "bg-surface";
          let circleClass = "border-border text-txt-3";

          if (revealed && isAnswer) {
            borderClass = "border-success-border";
            bgClass = "bg-success-bg/30";
            circleClass =
              "border-success-border bg-success-bg text-success-text";
          } else if (revealed && isSelected && !isAnswer) {
            borderClass = "border-error-border";
            bgClass = "bg-error-bg/30";
            circleClass = "border-error-border bg-error-bg text-error-text";
          } else if (isSelected) {
            borderClass = "border-accent-400";
            bgClass = "bg-accent-50";
            circleClass = "border-accent-500 bg-accent-600 text-white";
          }

          return (
            <div key={`option-${index}-${option.key}`}>
              <button
                type="button"
                onClick={() =>
                  revealed ? toggleOption(option.key) : handleSelect(option.key)
                }
                className={`w-full rounded-xl border-2 ${borderClass} ${bgClass} px-4 py-3 text-left text-sm transition-all ${
                  !revealed
                    ? "hover:border-accent-300 hover:bg-accent-50/50"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${circleClass}`}
                  >
                    {option.key}
                  </span>
                  <span className="text-txt-2 flex-1">
                    <LatexText text={option.text} />
                  </span>
                  {revealed && isSelected && !isAnswer && (
                    <ErrorCircleIcon />
                  )}
                  {revealed && isAnswer && <CheckIcon />}
                </div>
              </button>

              {revealed && hasJustification && (
                <div className="ml-4 border-l-2 border-border pl-4 mt-1">
                  <button
                    type="button"
                    onClick={() => toggleOption(option.key)}
                    className="flex items-center gap-1.5 text-xs py-1"
                  >
                    <span
                      className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    >
                      &rsaquo;
                    </span>
                    {isAnswer ? (
                      <span className="font-semibold text-success-text">
                        Gabarito
                      </span>
                    ) : isSelected ? (
                      <span className="font-semibold text-error-text">
                        Sua resposta
                      </span>
                    ) : (
                      <span className="text-txt-3">
                        {isExpanded ? "Ocultar" : "Incorreta"}
                      </span>
                    )}
                  </button>
                  {isExpanded && (
                    <p className="text-xs text-txt-3 leading-relaxed pb-2">
                      <LatexText text={justifications![option.key]} />
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!revealed && (
        <Button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full"
        >
          Confirmar
        </Button>
      )}

      {revealed && (
        <div className="space-y-4 pt-2">
          <Alert variant={isCorrect ? "success" : "error"}>
            <strong>{isCorrect ? "Parabéns!" : "Não foi dessa vez."}</strong>{" "}
            {isCorrect
              ? "Você acertou essa questão."
              : `A resposta correta é a alternativa ${correctAnswer}.`}
          </Alert>

          {fullAnalysis && (
            <Card className="p-5 border-accent-200 bg-accent-50/50">
              <div className="flex items-center gap-2 mb-2">
                <BookIcon />
                <p className="text-xs font-bold text-accent-700 uppercase tracking-wide">
                  Resolução Completa
                </p>
              </div>
              <div className="text-sm leading-relaxed text-txt-2">
                <LatexText text={fullAnalysis} />
              </div>
            </Card>
          )}

          {robotoTip && (
            <Card className="p-5 border-amber-200 bg-amber-50/60">
              <div className="flex items-center gap-2 mb-2">
                <LightbulbIcon />
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Dica do Roboto
                </p>
              </div>
              <div className="text-sm leading-relaxed text-amber-900">
                <LatexText text={robotoTip} />
              </div>
            </Card>
          )}

          {explanation && !fullAnalysis && (
            <Card className="p-5 bg-surface-2">
              <p className="text-xs font-semibold text-txt-3 uppercase tracking-wide mb-2">
                Explicação
              </p>
              <div className="text-sm leading-relaxed text-txt-2">
                <LatexText text={explanation} />
              </div>
            </Card>
          )}

          {theoreticalSupport && (
            <Card className="overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTheory((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-accent-700 hover:bg-accent-50/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GlassesIcon />
                  Saber Mais (Reforço Teórico)
                </div>
                <span
                  className={`transition-transform ${showTheory ? "rotate-180" : ""}`}
                >
                  <ChevronDownIcon />
                </span>
              </button>
              {showTheory && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-txt-2 border-t border-border pt-3">
                  <LatexText text={theoreticalSupport} />
                </div>
              )}
            </Card>
          )}

          {referenceLinks.length > 0 && (
            <Card className="p-5 bg-surface-2">
              <p className="text-xs font-semibold text-txt-3 uppercase tracking-wide mb-2">
                Referências
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {referenceLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 underline hover:text-accent-700"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <footer className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/questoes")}
            >
              &larr; Anterior
            </Button>
            <Button onClick={handleNext} disabled={navigating}>
              {navigating ? "Carregando..." : "Próxima"} &rarr;
            </Button>
          </footer>
        </div>
      )}
    </div>
  );
}

function ErrorCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 text-error-text shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 text-success-text shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-accent-600"
      aria-hidden="true"
    >
      <path d="M10.75 16.82A7.462 7.462 0 0 1 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06v-11a.75.75 0 0 0-.546-.721A9.006 9.006 0 0 0 15 3a8.963 8.963 0 0 0-4.25 1.065V16.82ZM9.25 4.065A8.963 8.963 0 0 0 5 3c-.85 0-1.673.118-2.454.339A.75.75 0 0 0 2 4.06v11a.75.75 0 0 0 .954.721A7.506 7.506 0 0 1 5 15.5c1.579 0 3.042.487 4.25 1.32V4.065Z" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-amber-500"
      aria-hidden="true"
    >
      <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.044a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-.044c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.5 18a1.5 1.5 0 0 0 3 0h-3Z" />
    </svg>
  );
}

function GlassesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-accent-500"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
