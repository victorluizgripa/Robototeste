"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EditPlanModal } from "./edit-plan-modal";
import type { StudyPlanWithThemes } from "@/domain/study-plan/types";

type Subject = { id: string; name: string };
type Theme = { id: string; name: string; subject_id: string };

type Props = {
  plan: StudyPlanWithThemes | null;
  subjects: Subject[];
  themes: Theme[];
};

function formatTargetDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function StudyPlanView({ plan, subjects, themes }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const themeIds = plan?.themes.map((t) => t.themeId) ?? [];
  const targetDateInput = plan?.targetDate
    ? new Date(plan.targetDate).toISOString().slice(0, 10)
    : "";

  return (
    <>
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        <div>
          <h1 className="text-2xl font-bold text-txt md:text-3xl">
            Plano de Estudos
          </h1>
          <p className="mt-1 text-sm text-txt-2">
            Defina os temas e acompanhe o que estudar. Acesse questões e
            resumos por tema.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          {plan ? "Reconfigurar plano" : "Criar plano"}
        </Button>
      </section>

      {plan?.targetDate && (
        <p className="mb-4 text-sm text-txt-2">
          Data-alvo: <strong className="text-txt">{formatTargetDate(plan.targetDate)}</strong>
        </p>
      )}

      {!plan || plan.themes.length === 0 ? (
        <Card className="px-6 py-12 text-center">
          <p className="text-sm text-txt-2">
            {plan
              ? "Seu plano não tem temas ainda. Adicione temas para começar."
              : "Você ainda não criou um plano. Escolha os temas e uma data-alvo (opcional)."}
          </p>
          <Button
            className="mt-4"
            onClick={() => setModalOpen(true)}
          >
            {plan ? "Adicionar temas" : "Criar plano"}
          </Button>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-txt">O que estudar</h2>
            <p className="mt-1 text-sm text-txt-2">
              Próximos temas do seu plano. Clique em Questões ou Resumo para
              começar.
            </p>
          </div>
          <ul className="space-y-3">
            {plan.themes.map((t, index) => (
              <li key={t.id}>
                <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-txt-3">
                      {index + 1}. {t.subjectName}
                    </span>
                    <p className="mt-0.5 text-sm font-medium text-txt">
                      {t.themeName}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/questoes?theme=${t.themeId}`}>
                      <Button variant="secondary" size="sm">
                        Questões
                      </Button>
                    </Link>
                    <Link href="/resumos?create=1">
                      <Button variant="ghost" size="sm">
                        Resumo
                      </Button>
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      <EditPlanModal
        subjects={subjects}
        themes={themes}
        initialThemeIds={themeIds}
        initialTargetDate={targetDateInput}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
