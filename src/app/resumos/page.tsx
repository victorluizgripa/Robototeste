import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createSummaryRepository } from "@/infra/summaries/supabase-summary-repository";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateSummaryModal } from "./create-summary-modal";

const LEVEL_LABELS: Record<string, string> = {
  medio: "Médio",
  tecnico: "Técnico",
  superior: "Superior",
};

export default async function SummariesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [repo, { data: subjects }, { data: themes }] = await Promise.all([
    Promise.resolve(createSummaryRepository()),
    supabase.from("subjects").select("id, name").order("name"),
    supabase.from("themes").select("id, name, subject_id").order("name"),
  ]);

  const summaries = await repo.listUserSummaries(user.id);

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Breadcrumb
          segments={[
            { label: "Home", href: "/" },
            { label: "Meus Resumos" },
          ]}
        />

        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-txt md:text-3xl">
              Meus Resumos
            </h1>
            <p className="mt-1 text-sm text-txt-2">
              Resumos gerados por IA para suas sessões de estudo.
            </p>
          </div>
          <CreateSummaryModal
            subjects={subjects ?? []}
            themes={themes ?? []}
          />
        </section>

        {summaries.length === 0 ? (
          <Card className="px-6 py-12 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 text-accent-600"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A48.07 48.07 0 0 1 12 3c1.268 0 2.53.038 3.988.012ZM6.5 7.5a1.5 1.5 0 0 0-1.5 1.5v6.5A1.5 1.5 0 0 0 6.5 17h7A1.5 1.5 0 0 0 15 15.5V10.621a1.5 1.5 0 0 0-.44-1.06l-3.12-3.122A1.5 1.5 0 0 0 10.378 6H6.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-txt-2">
              Você ainda não tem nenhum resumo.
            </p>
            <CreateSummaryModal
              subjects={subjects ?? []}
              themes={themes ?? []}
              trigger={<Button>Criar meu primeiro resumo</Button>}
            />
          </Card>
        ) : (
          <>
            <p className="text-sm text-txt-2">
              <strong className="text-txt">{summaries.length}</strong>{" "}
              {summaries.length === 1 ? "resumo" : "resumos"}
            </p>

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summaries.map((summary) => (
                <Link
                  key={summary.id}
                  href={`/resumos/${summary.id}`}
                  className="block group"
                >
                  <Card hover className="p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-sm font-semibold text-txt group-hover:text-accent-700 transition-colors line-clamp-2">
                        {summary.themeName}
                      </h2>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 shrink-0 text-txt-3 group-hover:text-accent-600 transition-colors"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <p className="mt-2 text-xs text-txt-3 line-clamp-3">
                      {summary.contentMd.slice(0, 150).replace(/[#*]/g, "")}...
                    </p>

                    <div className="mt-auto pt-3 flex items-center gap-2">
                      <Badge variant="accent">{summary.subjectName}</Badge>
                      <Badge>{LEVEL_LABELS[summary.level] ?? summary.level}</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
