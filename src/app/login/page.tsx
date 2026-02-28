"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RobotoLogo } from "@/components/roboto-logo";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

function sanitizeNextPath(nextPath: string | null): string {
  if (!nextPath || !nextPath.startsWith("/")) return "/";
  return nextPath;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState("/");
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(sanitizeNextPath(params.get("next")));
  }, []);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace(nextPath);
      } else {
        setCheckingSession(false);
      }
    }

    void checkSession();
  }, [nextPath, router, supabase]);

  async function handleLogin() {
    setErrorMessage(null);
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) {
        console.error(error);
        setErrorMessage(
          "Não foi possível iniciar o login com Google. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="flex items-center gap-2 text-sm text-txt-3">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-300 border-t-accent-600" />
          Verificando sessão...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="mb-8">
        <RobotoLogo size={48} showText />
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-surface shadow-card border border-border p-6 md:p-8">
        <h1 className="text-2xl font-bold text-txt text-center">
          Bem-vindo de volta
        </h1>
        <p className="mt-2 text-sm text-txt-2 text-center">
          Entre com um clique e continue seu plano de estudo.
        </p>

        {errorMessage && (
          <Alert variant="error" className="mt-5">
            {errorMessage}
          </Alert>
        )}

        <Button
          onClick={handleLogin}
          disabled={loading}
          variant="primary"
          size="lg"
          className="mt-6 w-full"
        >
          <GoogleIcon />
          {loading ? "Redirecionando..." : "Entrar com Google"}
        </Button>

        <p className="mt-4 text-center text-[11px] text-txt-3">
          Login seguro com Google
        </p>

        <p className="mt-6 text-center text-[11px] text-txt-3">
          Ao entrar, você concorda com os termos de uso do Roboto.
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
