import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSummaryRepository } from "@/infra/summaries/supabase-summary-repository";
import { openaiSummaryGenerator } from "@/infra/summaries/openai-summary-generator";
import { normalizeMathDelimiters } from "@/lib/math-delimiters";
import type { SummaryLevel, CreateSummaryResult } from "@/domain/summaries/types";

const VALID_LEVELS: SummaryLevel[] = ["medio", "tecnico", "superior"];

type CreateSummaryBody = {
  themeId?: unknown;
  level?: unknown;
};

function getErrorText(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (!err || typeof err !== "object") return "";

  const obj = err as Record<string, unknown>;
  const parts: string[] = [];

  const message = obj.message;
  if (typeof message === "string") parts.push(message);

  const code = obj.code;
  if (typeof code === "string") parts.push(code);

  const name = obj.name;
  if (typeof name === "string") parts.push(name);

  const description = obj.error_description;
  if (typeof description === "string") parts.push(description);

  const cause = obj.cause;
  if (cause && cause !== err) {
    const causeText = getErrorText(cause);
    if (causeText) parts.push(causeText);
  }

  return parts.join(" ").trim();
}

function getErrorStatus(err: unknown): number | null {
  if (!err || typeof err !== "object") return null;
  const status = (err as Record<string, unknown>).status;
  return typeof status === "number" ? status : null;
}

function isAuthError(err: unknown): boolean {
  const status = getErrorStatus(err);
  if (status === 401 || status === 403) return true;

  const msg = getErrorText(err).toLowerCase();
  return (
    msg.includes("401") ||
    msg.includes("403") ||
    msg.includes("unauthorized") ||
    msg.includes("jwt") ||
    msg.includes("session") ||
    msg.includes("invalid login") ||
    msg.includes("auth session missing") ||
    msg.includes("token") ||
    msg.includes("refresh_token")
  );
}

function jsonResult(
  result: CreateSummaryResult,
  status: number,
): NextResponse<CreateSummaryResult> {
  return NextResponse.json(result, { status });
}

export async function POST(request: Request) {
  const startMs = Date.now();

  const body = (await request.json().catch(() => null)) as CreateSummaryBody | null;
  const themeId = typeof body?.themeId === "string" ? body.themeId : "";
  const level = typeof body?.level === "string" ? body.level : "";

  if (!themeId || !VALID_LEVELS.includes(level as SummaryLevel)) {
    return jsonResult({ success: false, error: "INVALID_INPUT" }, 400);
  }

  const safeLevel = level as SummaryLevel;
  const supabase = await createClient();
  const repo = createSummaryRepository();

  let userId = "";
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResult({ success: false, error: "NOT_AUTHENTICATED" }, 401);
    }

    userId = user.id;

    let general = await repo.findGeneralSummary(themeId, safeLevel);

    if (!general) {
      const { data: themeRow } = await supabase
        .from("themes")
        .select("name, subject:subjects(name)")
        .eq("id", themeId)
        .single();

      if (!themeRow) {
        return jsonResult({ success: false, error: "THEME_NOT_FOUND" }, 404);
      }

      const subject = Array.isArray(themeRow.subject)
        ? themeRow.subject[0]
        : themeRow.subject;
      const themeName = themeRow.name as string;
      const subjectName = (subject?.name as string) ?? "Geral";

      console.info(
        JSON.stringify({
          event: "summary_generation_start",
          userId,
          themeId,
          level: safeLevel,
        }),
      );

      const { contentMd: rawMd } = await openaiSummaryGenerator.generate(
        themeName,
        subjectName,
        safeLevel,
      );
      const contentMd = normalizeMathDelimiters(rawMd);

      general = await repo.createGeneralSummary(themeId, safeLevel, contentMd);

      console.info(
        JSON.stringify({
          event: "summary_generation_complete",
          userId,
          themeId,
          level: safeLevel,
          durationMs: Date.now() - startMs,
        }),
      );
    }

    const { id: userSummaryId } = await repo.createUserSummary(userId, general.id);

    console.info(
      JSON.stringify({
        event: "summary_linked_to_user",
        userId,
        userSummaryId,
        generalSummaryId: general.id,
        durationMs: Date.now() - startMs,
      }),
    );

    return jsonResult({ success: true, userSummaryId }, 200);
  } catch (err) {
    if (isAuthError(err)) {
      return jsonResult({ success: false, error: "NOT_AUTHENTICATED" }, 401);
    }

    console.error(
      JSON.stringify({
        event: "summary_creation_error",
        userId,
        themeId,
        level: safeLevel,
        error: getErrorText(err) || "unknown",
        durationMs: Date.now() - startMs,
      }),
    );

    return jsonResult({ success: false, error: "GENERATION_FAILED" }, 500);
  }
}
