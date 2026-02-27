"use server";

import { createClient } from "@/lib/supabase/server";

type RecordAnswerInput = {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  solveDurationMs: number;
};

export async function recordAnswer(
  input: RecordAnswerInput
): Promise<{ id: string } | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_answers")
    .insert({
      user_id: user.id,
      question_id: input.questionId,
      selected_answer: input.selectedAnswer,
      is_correct: input.isCorrect,
      solve_duration_ms: input.solveDurationMs,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Erro ao registrar resposta:", error.message);
    return null;
  }

  return data;
}

type UpdateReviewInput = {
  answerId: string;
  reviewDurationMs: number;
  totalDurationMs: number;
};

export async function updateReviewDuration(
  input: UpdateReviewInput
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("user_answers")
    .update({
      review_duration_ms: input.reviewDurationMs,
      total_duration_ms: input.totalDurationMs,
    })
    .eq("id", input.answerId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao atualizar tempo de revisão:", error.message);
  }
}

export async function getRandomQuestionId(
  excludeId: string
): Promise<string | null> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("question_bank")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("quality_state", "active")
    .neq("id", excludeId);

  if (!count || count === 0) return null;

  const randomOffset = Math.floor(Math.random() * count);

  const { data, error } = await supabase
    .from("question_bank")
    .select("id")
    .eq("is_active", true)
    .eq("quality_state", "active")
    .neq("id", excludeId)
    .range(randomOffset, randomOffset)
    .limit(1)
    .single();

  if (error || !data) return null;

  return data.id;
}
