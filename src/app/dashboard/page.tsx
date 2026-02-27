import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb segments={[{ label: "Home" }]} />

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-txt">
            Olá, {user.email?.split("@")[0]}
          </h1>
          <p className="mt-1 text-sm text-txt-2">
            Resumo rápido do seu estudo hoje.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-xs font-medium text-txt-3 uppercase tracking-wide">
              Questões hoje
            </p>
            <p className="mt-2 text-2xl font-bold text-txt">0</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium text-txt-3 uppercase tracking-wide">
              Acerto médio
            </p>
            <p className="mt-2 text-2xl font-bold text-txt">–</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium text-txt-3 uppercase tracking-wide">
              Streak
            </p>
            <p className="mt-2 text-2xl font-bold text-txt">0 dias</p>
          </Card>
        </section>

        <section className="mt-6">
          <Link href="/questoes" className="block">
            <Card hover className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 text-accent-600"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-txt">
                    Banco de Questões
                  </h2>
                  <p className="mt-0.5 text-xs text-txt-3">
                    Explore questões por matéria e tema. Comece a praticar agora.
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-accent-600">
                  Acessar &rarr;
                </span>
              </div>
            </Card>
          </Link>
        </section>
      </div>
    </main>
  );
}
