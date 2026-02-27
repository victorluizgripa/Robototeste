import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function todayMidnightUTC(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const todayIso = todayMidnightUTC();

  const [{ count: totalToday }, { count: correctToday }] = await Promise.all([
    supabase
      .from("user_answers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayIso),
    supabase
      .from("user_answers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_correct", true)
      .gte("created_at", todayIso),
  ]);

  const answered = totalToday ?? 0;
  const correct = correctToday ?? 0;
  const accuracyLabel =
    answered > 0 ? `${Math.round((correct / answered) * 100)}%` : "–";

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "estudante";

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          segments={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        />

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-txt">Olá, {displayName}</h1>
          <p className="mt-1 text-sm text-txt-2">
            Resumo rápido do seu estudo hoje.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-xs font-medium text-txt-3 uppercase tracking-wide">
              Questões hoje
            </p>
            <p className="mt-2 text-2xl font-bold text-txt">{answered}</p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-medium text-txt-3 uppercase tracking-wide">
              Acerto médio
            </p>
            <p className="mt-2 text-2xl font-bold text-txt">{accuracyLabel}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-txt-3 uppercase tracking-wide">
                Streak
              </p>
              <Badge>Em breve</Badge>
            </div>
            <p className="mt-2 text-2xl font-bold text-txt-3">–</p>
            <p className="mt-1 text-[11px] text-txt-3">
              Disponível após implementação do tracking diário.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}
