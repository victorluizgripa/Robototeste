import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { QuestionFilters } from "@/components/question-filters";
import { QuestionCard } from "@/components/question-card";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 18;

type SearchParams = {
  subject?: string;
  banca?: string;
  theme?: string;
  search?: string;
  page?: string;
};

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const subjectId = str(resolvedParams?.subject);
  const bancaParam = str(resolvedParams?.banca);
  const themeParam = str(resolvedParams?.theme);
  const searchParam = str(resolvedParams?.search);
  const currentPage = Math.max(
    Number.parseInt(str(resolvedParams?.page) || "1", 10) || 1,
    1
  );
  const offset = (currentPage - 1) * PAGE_SIZE;

  const [
    { data: subjects },
    { data: allThemes },
    { data: bancaRows },
    questionsResult,
  ] = await Promise.all([
    supabase.from("subjects").select("id, name").order("name"),
    supabase.from("themes").select("id, name, subject_id").order("name"),
    supabase
      .from("question_bank")
      .select("banca")
      .not("banca", "is", null)
      .limit(1000),
    fetchQuestions(supabase, {
      subjectId,
      bancaParam,
      themeParam,
      searchParam,
      offset,
    }),
  ]);

  const distinctBancas = [
    ...new Set(
      bancaRows
        ?.map((r: { banca: string | null }) => r.banca)
        .filter(Boolean) as string[]
    ),
  ].sort();

  const { data: questions, count, error } = questionsResult;

  if (error) {
    console.error("Erro ao carregar questões:", error.message);
  }

  const total = count ?? 0;
  const hasNextPage = offset + PAGE_SIZE < total;
  const hasPreviousPage = currentPage > 1;

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          segments={[
            { label: "Home", href: "/dashboard" },
            { label: "Banco de Questões" },
          ]}
        />

        <section className="text-center py-4">
          <h1 className="text-2xl font-bold text-txt md:text-3xl">
            Banco de Questões
          </h1>
          <p className="mt-2 text-sm text-txt-2 max-w-lg mx-auto">
            Um banco que cresce com seus estudos, com questões adaptadas à sua
            banca e nível de dificuldade.
          </p>
        </section>

        <Card className="p-4 md:p-6">
          <QuestionFilters
            subjects={subjects ?? []}
            bancas={distinctBancas}
            themes={allThemes ?? []}
            currentSearch={searchParam}
            currentBanca={bancaParam}
            currentSubject={subjectId}
            currentTheme={themeParam}
          />
        </Card>

        {error && (
          <Alert variant="error">
            Não foi possível carregar as questões agora. Tente novamente em
            alguns instantes.
          </Alert>
        )}

        <p className="text-sm text-txt-2">
          <strong className="text-txt">{total}</strong> questões encontradas
        </p>

        {!error && (!questions || questions.length === 0) && (
          <Card className="px-4 py-10 text-center">
            <p className="text-sm text-txt-3">
              Nenhuma questão encontrada para os filtros selecionados.
            </p>
          </Card>
        )}

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {questions?.map((question) => (
            <Link
              key={question.id}
              href={`/questoes/${question.id}`}
              className="block group"
            >
              <QuestionCard question={question} />
            </Link>
          ))}
        </section>

        {total > 0 && (
          <footer className="flex items-center justify-between border-t border-border pt-4 text-sm text-txt-3">
            <span>
              Mostrando{" "}
              <strong className="text-txt-2">
                {Math.min(offset + 1, total)}–
                {Math.min(offset + PAGE_SIZE, total)}
              </strong>{" "}
              de <strong className="text-txt-2">{total}</strong>
            </span>
            <div className="flex items-center gap-2">
              <PaginationLink
                label="Anterior"
                disabled={!hasPreviousPage}
                page={currentPage - 1}
                params={resolvedParams}
              />
              <PaginationLink
                label="Próxima"
                disabled={!hasNextPage}
                page={currentPage + 1}
                params={resolvedParams}
              />
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}

function str(value: string | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function fetchQuestions(
  supabase: SupabaseClient,
  {
    subjectId,
    bancaParam,
    themeParam,
    searchParam,
    offset,
  }: {
    subjectId?: string;
    bancaParam?: string;
    themeParam?: string;
    searchParam?: string;
    offset: number;
  }
) {
  let query = supabase
    .from("question_bank")
    .select(
      `
      id,
      question_text,
      banca,
      difficulty,
      options,
      theme:themes (
        id,
        name,
        subject:subjects (
          id,
          name
        )
      )
    `,
      { count: "exact" }
    )
    .eq("is_active", true)
    .eq("quality_state", "active")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (subjectId) {
    query = query.eq("themes.subject_id", subjectId);
  }
  if (bancaParam) {
    query = query.eq("banca", bancaParam);
  }
  if (themeParam) {
    query = query.eq("theme_id", themeParam);
  }
  if (searchParam) {
    query = query.ilike("question_text", `%${searchParam}%`);
  }

  return query;
}

type QuestionRow = NonNullable<
  Awaited<ReturnType<typeof fetchQuestions>>["data"]
>[number];

export type QuestionCardData = QuestionRow;

type PaginationLinkProps = {
  label: string;
  disabled: boolean;
  page: number;
  params?: SearchParams;
};

function PaginationLink({
  label,
  disabled,
  page,
  params,
}: PaginationLinkProps) {
  if (disabled || page < 1) {
    return (
      <Button variant="secondary" size="sm" disabled>
        {label}
      </Button>
    );
  }

  const sp = new URLSearchParams();
  if (params?.subject) sp.set("subject", params.subject);
  if (params?.banca) sp.set("banca", params.banca);
  if (params?.theme) sp.set("theme", params.theme);
  if (params?.search) sp.set("search", params.search);
  sp.set("page", String(page));

  return (
    <Link href={`/questoes?${sp.toString()}`}>
      <Button variant="secondary" size="sm">
        {label}
      </Button>
    </Link>
  );
}
