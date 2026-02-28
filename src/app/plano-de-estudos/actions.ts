"use server";

import { createClient } from "@/lib/supabase/server";
import { createStudyPlanRepository } from "@/infra/study-plan/supabase-study-plan-repository";
import type {
  StudyPlanWithThemes,
  CreateStudyPlanInput,
} from "@/domain/study-plan/types";

export type SaveStudyPlanResult =
  | { success: true }
  | { success: false; error: string };

export async function getStudyPlan(): Promise<StudyPlanWithThemes | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const repo = createStudyPlanRepository();
  return repo.getPlanWithThemes(user.id);
}

export async function saveStudyPlan(
  input: CreateStudyPlanInput,
): Promise<SaveStudyPlanResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "NOT_AUTHENTICATED" };
  }

  if (!input.themeIds || !Array.isArray(input.themeIds)) {
    return { success: false, error: "INVALID_INPUT" };
  }

  const repo = createStudyPlanRepository();
  try {
    await repo.savePlan(user.id, {
      themeIds: input.themeIds,
      targetDate: input.targetDate ?? null,
    });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao salvar plano.";
    return { success: false, error: message };
  }
}
