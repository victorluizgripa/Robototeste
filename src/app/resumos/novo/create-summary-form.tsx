"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ThemePicker } from "@/components/theme-picker";
import { createSummary } from "./actions";
import type { SummaryLevel } from "@/domain/summaries/types";

type Subject = { id: string; name: string };
type Theme = { id: string; name: string; subject_id: string };

type Props = {
  subjects: Subject[];
  themes: Theme[];
  onSuccess?: (userSummaryId: string) => void;
};

const LEVEL_OPTIONS: { value: SummaryLevel; label: string; description: string }[] = [
  {
    value: "medio",
    label: "Médio",
    description: "Conceitos fundamentais e linguagem acessível",
  },
  {
    value: "tecnico",
    label: "Técnico",
    description: "Fundamentos + terminologia profissional",
  },
  {
    value: "superior",
    label: "Superior",
    description: "Análise aprofundada com nuances e exceções",
  },
];

const ERROR_MESSAGES: Record<string, string> = {
  NOT_AUTHENTICATED: "Sua sessão expirou. Faça login novamente.",
  INVALID_INPUT: "Selecione um tema e nível válidos.",
  THEME_NOT_FOUND: "Tema não encontrado. Tente outro.",
  GENERATION_FAILED:
    "Não foi possível gerar o resumo agora. Tente novamente em alguns instantes.",
};

export function CreateSummaryForm({ subjects, themes, onSuccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [themeId, setThemeId] = useState("");
  const [level, setLevel] = useState<SummaryLevel>("medio");
  const [error, setError] = useState("");

  function handleThemeChange(id: string) {
    setThemeId(id);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!themeId || !level) return;

    setError("");

    startTransition(async () => {
      const result = await createSummary(themeId, level);
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.userSummaryId);
        } else {
          router.push(`/resumos/${result.userSummaryId}`);
        }
      } else {
        setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.GENERATION_FAILED);
      }
    });
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-bg/90 backdrop-blur-sm">
          <Spinner />
          <div role="status" aria-live="polite" className="text-center">
            <p className="text-lg font-semibold text-txt">
              Gerando seu resumo...
            </p>
            <p className="mt-1 text-sm text-txt-3">
              Isso pode levar alguns segundos
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-5">
          <div className="min-w-0 space-y-1.5">
            <span className="block text-xs font-medium text-txt-2">
              Tema *
            </span>
            <ThemePicker
              subjects={subjects}
              themes={themes}
              value={themeId}
              onChange={handleThemeChange}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-txt-2">
              Nível de profundidade *
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              {LEVEL_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex flex-col gap-1 rounded-xl border p-3 cursor-pointer transition-all ${
                    level === opt.value
                      ? "border-accent-500 bg-accent-50 ring-2 ring-accent-500/20"
                      : "border-border hover:border-border-hover"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="level"
                      value={opt.value}
                      checked={level === opt.value}
                      onChange={() => setLevel(opt.value)}
                      className="accent-accent-600"
                    />
                    <span className="text-sm font-medium text-txt">
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-xs text-txt-3 pl-5">
                    {opt.description}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {error && <Alert variant="error">{error}</Alert>}

        <Button type="submit" disabled={!themeId || isPending} className="w-full">
          {isPending ? "Gerando resumo..." : "Gerar resumo"}
        </Button>
      </form>
    </>
  );
}
