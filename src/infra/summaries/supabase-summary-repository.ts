import { createClient } from "@/lib/supabase/server";
import type { SummaryRepositoryPort } from "@/domain/summaries/summary-repository-port";
import type {
  SummaryLevel,
  GeneralSummary,
  UserSummaryWithContent,
} from "@/domain/summaries/types";

export function createSummaryRepository(): SummaryRepositoryPort {
  return {
    async findGeneralSummary(
      themeId: string,
      level: SummaryLevel,
    ): Promise<GeneralSummary | null> {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("general_summaries")
        .select("id, theme_id, level, content_md, created_at")
        .eq("theme_id", themeId)
        .eq("level", level)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        themeId: data.theme_id,
        level: data.level as SummaryLevel,
        contentMd: data.content_md,
        createdAt: data.created_at,
      };
    },

    async createGeneralSummary(
      themeId: string,
      level: SummaryLevel,
      contentMd: string,
    ): Promise<GeneralSummary> {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("general_summaries")
        .upsert(
          { theme_id: themeId, level, content_md: contentMd },
          { onConflict: "theme_id,level" },
        )
        .select("id, theme_id, level, content_md, created_at")
        .single();

      if (error || !data) {
        throw new Error(
          `Failed to create general summary: ${error?.message ?? "unknown"}`,
        );
      }

      return {
        id: data.id,
        themeId: data.theme_id,
        level: data.level as SummaryLevel,
        contentMd: data.content_md,
        createdAt: data.created_at,
      };
    },

    async createUserSummary(
      userId: string,
      generalSummaryId: string,
    ): Promise<{ id: string }> {
      const supabase = await createClient();

      const { data: existing } = await supabase
        .from("user_summaries")
        .select("id")
        .eq("user_id", userId)
        .eq("general_summary_id", generalSummaryId)
        .single();

      if (existing) return { id: existing.id };

      const { data, error } = await supabase
        .from("user_summaries")
        .insert({ user_id: userId, general_summary_id: generalSummaryId })
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(
          `Failed to create user summary: ${error?.message ?? "unknown"}`,
        );
      }

      return { id: data.id };
    },

    async listUserSummaries(
      userId: string,
    ): Promise<UserSummaryWithContent[]> {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("user_summaries")
        .select(
          `
          id,
          user_id,
          general_summary_id,
          created_at,
          general_summary:general_summaries (
            content_md,
            level,
            theme:themes (
              name,
              subject:subjects (
                name
              )
            )
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((row) => {
        const gs = Array.isArray(row.general_summary)
          ? row.general_summary[0]
          : row.general_summary;
        const theme = Array.isArray(gs?.theme) ? gs.theme[0] : gs?.theme;
        const subject = Array.isArray(theme?.subject)
          ? theme.subject[0]
          : theme?.subject;

        return {
          id: row.id,
          userId: row.user_id,
          generalSummaryId: row.general_summary_id,
          createdAt: row.created_at,
          contentMd: gs?.content_md ?? "",
          level: (gs?.level ?? "medio") as SummaryLevel,
          themeName: theme?.name ?? "",
          subjectName: subject?.name ?? "",
        };
      });
    },

    async getUserSummary(
      userId: string,
      userSummaryId: string,
    ): Promise<UserSummaryWithContent | null> {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("user_summaries")
        .select(
          `
          id,
          user_id,
          general_summary_id,
          created_at,
          general_summary:general_summaries (
            content_md,
            level,
            theme:themes (
              name,
              subject:subjects (
                name
              )
            )
          )
        `,
        )
        .eq("id", userSummaryId)
        .eq("user_id", userId)
        .single();

      if (error || !data) return null;

      const gs = Array.isArray(data.general_summary)
        ? data.general_summary[0]
        : data.general_summary;
      const theme = Array.isArray(gs?.theme) ? gs.theme[0] : gs?.theme;
      const subject = Array.isArray(theme?.subject)
        ? theme.subject[0]
        : theme?.subject;

      return {
        id: data.id,
        userId: data.user_id,
        generalSummaryId: data.general_summary_id,
        createdAt: data.created_at,
        contentMd: gs?.content_md ?? "",
        level: (gs?.level ?? "medio") as SummaryLevel,
        themeName: theme?.name ?? "",
        subjectName: subject?.name ?? "",
      };
    },
  };
}
