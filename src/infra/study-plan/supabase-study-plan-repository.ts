import { createClient } from "@/lib/supabase/server";
import type {
  StudyPlanWithThemes,
  CreateStudyPlanInput,
} from "@/domain/study-plan/types";

export function createStudyPlanRepository() {
  return {
    async getPlanWithThemes(userId: string): Promise<StudyPlanWithThemes | null> {
      const supabase = await createClient();

      const { data: planRow, error: planError } = await supabase
        .from("user_study_plans")
        .select("id, user_id, target_date, created_at, updated_at")
        .eq("user_id", userId)
        .single();

      if (planError || !planRow) return null;

      const { data: themeRows, error: themesError } = await supabase
        .from("user_study_plan_themes")
        .select(
          `
          id,
          study_plan_id,
          theme_id,
          position,
          created_at,
          theme:themes (
            name,
            subject:subjects (
              name
            )
          )
        `,
        )
        .eq("study_plan_id", planRow.id)
        .order("position", { ascending: true });

      const rawThemeRows = themesError ? [] : themeRows ?? [];
      const themes = rawThemeRows.map((row) => {
        const theme = Array.isArray(row.theme) ? row.theme[0] : row.theme;
        const subject = Array.isArray(theme?.subject)
          ? theme.subject[0]
          : theme?.subject;
        return {
          id: row.id,
          studyPlanId: row.study_plan_id,
          themeId: row.theme_id,
          position: row.position,
          createdAt: row.created_at,
          themeName: theme?.name ?? "",
          subjectName: subject?.name ?? "",
        };
      });

      return {
        id: planRow.id,
        userId: planRow.user_id,
        targetDate: planRow.target_date,
        createdAt: planRow.created_at,
        updatedAt: planRow.updated_at,
        themes,
      };
    },

    async savePlan(
      userId: string,
      input: CreateStudyPlanInput,
    ): Promise<{ id: string }> {
      const supabase = await createClient();

      const targetDate = input.targetDate?.trim() || null;
      const now = new Date().toISOString();

      const { data: existing } = await supabase
        .from("user_study_plans")
        .select("id")
        .eq("user_id", userId)
        .single();

      let planId: string;

      if (existing) {
        await supabase
          .from("user_study_plans")
          .update({ target_date: targetDate, updated_at: now })
          .eq("id", existing.id);
        planId = existing.id;
        await supabase
          .from("user_study_plan_themes")
          .delete()
          .eq("study_plan_id", planId);
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("user_study_plans")
          .insert({
            user_id: userId,
            target_date: targetDate,
            updated_at: now,
          })
          .select("id")
          .single();
        if (insertError || !inserted) {
          throw new Error(
            `Failed to create study plan: ${insertError?.message ?? "unknown"}`,
          );
        }
        planId = inserted.id;
      }

      if (input.themeIds.length > 0) {
        const rows = input.themeIds.map((themeId, index) => ({
          study_plan_id: planId,
          theme_id: themeId,
          position: index,
        }));
        const { error: themesError } = await supabase
          .from("user_study_plan_themes")
          .insert(rows);
        if (themesError) {
          throw new Error(
            `Failed to save plan themes: ${themesError.message}`,
          );
        }
      }

      return { id: planId };
    },
  };
}
