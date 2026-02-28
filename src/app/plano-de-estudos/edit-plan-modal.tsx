"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { saveStudyPlan } from "./actions";

type Subject = { id: string; name: string };
type Theme = { id: string; name: string; subject_id: string };

type Props = {
  subjects: Subject[];
  themes: Theme[];
  initialThemeIds: string[];
  initialTargetDate: string;
  open: boolean;
  onClose: () => void;
};

export function EditPlanModal({
  subjects,
  themes,
  initialThemeIds,
  initialTargetDate,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialThemeIds),
  );
  const [targetDate, setTargetDate] = useState(initialTargetDate);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themesBySubject = useMemo(() => {
    const map = new Map<string, Theme[]>();
    for (const theme of themes) {
      const list = map.get(theme.subject_id) ?? [];
      list.push(theme);
      map.set(theme.subject_id, list);
    }
    return map;
  }, [themes]);

  const toggleTheme = useCallback((themeId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await saveStudyPlan({
      themeIds: Array.from(selectedIds),
      targetDate: targetDate.trim() || null,
    });
    setPending(false);
    if (result.success) {
      onClose();
      router.refresh();
    } else {
      setError(result.error === "NOT_AUTHENTICATED" ? "Faça login novamente." : result.error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Criar ou reconfigurar plano">
      <form onSubmit={handleSubmit} className="min-w-0 overflow-hidden p-5 pt-4">
        <p className="mb-4 text-sm text-txt-2">
          Escolha os temas que deseja incluir no seu plano e, se quiser, defina
          uma data-alvo (ex.: prova).
        </p>

        <label className="mb-2 block text-xs font-medium text-txt-2">
          Data-alvo (opcional)
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="mb-5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-txt placeholder:text-txt-3 transition-colors focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
        />

        <label className="mb-2 block text-xs font-medium text-txt-2">
          Temas do plano
        </label>
        <div className="max-h-72 overflow-y-auto rounded-xl border border-border mb-5">
          <ul className="py-1">
            {subjects.map((subject) => {
              const subjectThemes = themesBySubject.get(subject.id) ?? [];
              if (subjectThemes.length === 0) return null;
              return (
                <li key={subject.id}>
                  <div className="sticky top-0 bg-surface-2 px-4 py-2 text-xs font-semibold text-txt-2">
                    {subject.name}
                  </div>
                  <ul>
                    {subjectThemes.map((theme) => {
                      const checked = selectedIds.has(theme.id);
                      return (
                        <li key={theme.id}>
                          <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-surface-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleTheme(theme.id)}
                              className="h-4 w-4 rounded border-border text-accent-600 focus:ring-accent-500/20"
                            />
                            <span className="text-sm text-txt-2">
                              {theme.name}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar plano"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
