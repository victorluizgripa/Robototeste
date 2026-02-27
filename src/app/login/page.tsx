"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      } else {
        setCheckingSession(false);
      }
    }

    void checkSession();
  }, [router, supabase]);

  async function handleLogin() {
    setErrorMessage(null);
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600">
          <BriefcaseIcon />
        </div>
        <span className="text-2xl font-bold text-txt">Roboto</span>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-surface shadow-card border border-border p-8">
        <h1 className="text-lg font-bold text-txt text-center">
          Bem-vindo de volta
        </h1>
        <p className="mt-1.5 text-sm text-txt-2 text-center">
          Entre para continuar seu plano de estudo.
        </p>

        {errorMessage && (
          <Alert variant="error" className="mt-5">
            {errorMessage}
          </Alert>
        )}

        <Button
          onClick={handleLogin}
          disabled={loading}
          variant="secondary"
          size="lg"
          className="mt-6 w-full"
        >
          <GoogleIcon />
          {loading ? "Redirecionando..." : "Entrar com Google"}
        </Button>

        <p className="mt-6 text-center text-[11px] text-txt-3">
          Ao entrar, você concorda com os termos de uso do Roboto.
        </p>
      </div>
    </main>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75a24.726 24.726 0 0 1-7.814-1.259C2.984 14.091 2.25 12.95 2.25 11.739V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25ZM10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v.041a48.936 48.936 0 0 1 6 0V6a1.5 1.5 0 0 0-1.5-1.5h-3Zm3.75 9.75a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0 0 1.5h4.5Z"
        clipRule="evenodd"
      />
      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.93 0 5.748-.483 8.287-1.336.252-.084.49-.189.713-.31V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.28-4.312.427-6.477.427-2.165 0-4.357-.147-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
    </svg>
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
