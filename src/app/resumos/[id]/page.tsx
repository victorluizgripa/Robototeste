import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createSummaryRepository } from "@/infra/summaries/supabase-summary-repository";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SummaryContent } from "./summary-content";

const LEVEL_LABELS: Record<string, string> = {
  medio: "Médio",
  tecnico: "Técnico",
  superior: "Superior",
};

function truncateSubject(name: string, maxLength = 28): string {
  if (name.length <= maxLength) return name;
  const slice = name.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice.slice(0, maxLength - 1);
  return `${cut.trimEnd()}…`;
}

type Params = { id: string };

export default async function SummaryDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const repo = createSummaryRepository();
  const summary = await repo.getUserSummary(user.id, id);

  if (!summary) {
    notFound();
  }

  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(summary.createdAt));

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Breadcrumb
          segments={[
            { label: "Home", href: "/" },
            { label: "Meus Resumos", href: "/resumos" },
            { label: summary.themeName },
          ]}
        />

        <header className="space-y-3">
          <h1 className="text-2xl font-bold text-txt md:text-3xl">
            {summary.themeName}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" title={summary.subjectName}>
              {truncateSubject(summary.subjectName)}
            </Badge>
            <Badge>{LEVEL_LABELS[summary.level] ?? summary.level}</Badge>
            <span className="text-xs text-txt-3">Gerado em {dateStr}</span>
          </div>
        </header>

        <Card className="p-6 md:p-8">
          <SummaryContent markdown={summary.contentMd} />
        </Card>

        <footer className="flex items-center justify-between border-t border-border pt-4">
          <Link href="/resumos">
            <Button variant="secondary" size="sm">
              Voltar para resumos
            </Button>
          </Link>
          <Link href="/resumos/novo">
            <Button size="sm">Criar outro</Button>
          </Link>
        </footer>
      </div>
    </main>
  );
}
