import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", url.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Erro ao trocar código por sessão:", error.message);
    return NextResponse.redirect(new URL("/auth/error", url.origin));
  }

  const redirectTo = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
