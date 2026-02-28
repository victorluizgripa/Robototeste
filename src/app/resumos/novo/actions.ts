"use server";

import { createClient } from "@/lib/supabase/server";
import { createSummaryRepository } from "@/infra/summaries/supabase-summary-repository";
import { openaiSummaryGenerator } from "@/infra/summaries/openai-summary-generator";
import type { SummaryLevel, CreateSummaryResult } from "@/domain/summaries/types";

const VALID_LEVELS: SummaryLevel[] = ["medio", "tecnico", "superior"];

export async function createSummary(
  themeId: string,
  level: string,
): Promise<CreateSummaryResult> {
  const startMs = Date.now();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "NOT_AUTHENTICATED" };
  }

  if (!themeId || !VALID_LEVELS.includes(level as SummaryLevel)) {
    return { success: false, error: "INVALID_INPUT" };
  }

  const safeLevel = level as SummaryLevel;
  const repo = createSummaryRepository();

  try {
    let general = await repo.findGeneralSummary(themeId, safeLevel);

    if (!general) {
      const { data: themeRow } = await supabase
        .from("themes")
        .select("name, subject:subjects(name)")
        .eq("id", themeId)
        .single();

      if (!themeRow) {
        return { success: false, error: "THEME_NOT_FOUND" };
      }

      const subject = Array.isArray(themeRow.subject)
        ? themeRow.subject[0]
        : themeRow.subject;

      const themeName = themeRow.name as string;
      const subjectName = (subject?.name as string) ?? "Geral";

      console.info(
        JSON.stringify({
          event: "summary_generation_start",
          userId: user.id,
          themeId,
          level: safeLevel,
        }),
      );

      const { contentMd } = await openaiSummaryGenerator.generate(
        themeName,
        subjectName,
        safeLevel,
      );

      general = await repo.createGeneralSummary(themeId, safeLevel, contentMd);

      console.info(
        JSON.stringify({
          event: "summary_generation_complete",
          userId: user.id,
          themeId,
          level: safeLevel,
          durationMs: Date.now() - startMs,
        }),
      );
    }

    const { id: userSummaryId } = await repo.createUserSummary(
      user.id,
      general.id,
    );

    console.info(
      JSON.stringify({
        event: "summary_linked_to_user",
        userId: user.id,
        userSummaryId,
        generalSummaryId: general.id,
        durationMs: Date.now() - startMs,
      }),
    );

    return { success: true, userSummaryId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error(
      JSON.stringify({
        event: "summary_creation_error",
        userId: user.id,
        themeId,
        level: safeLevel,
        error: message,
        durationMs: Date.now() - startMs,
      }),
    );
    return { success: false, error: "GENERATION_FAILED" };
  }
}
