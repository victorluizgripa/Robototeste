import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type NavCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  enabled: boolean;
};

const W = "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl";
const I = "h-5 w-5";
const ACTIVE_BG = `${W} bg-accent-100`;
const ACTIVE_IC = `${I} text-accent-600`;
const MUTED_BG = `${W} bg-surface-2`;
const MUTED_IC = `${I} text-txt-3`;

function MetodoRobotoIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path d="M10.75 16.82A7.462 7.462 0 0 1 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06V3.81a.75.75 0 0 0-.546-.721A9.006 9.006 0 0 0 15 2.75a9.006 9.006 0 0 0-4.25 1.065v13.004ZM9.25 4.815A9.006 9.006 0 0 0 5 2.75a9.006 9.006 0 0 0-2.454.339A.75.75 0 0 0 2 3.81v11.25a.75.75 0 0 0 .954.721A7.506 7.506 0 0 1 5 15.5c1.579 0 3.042.487 4.25 1.32V4.815Z" />
      </svg>
    </div>
  );
}

function AnaliseEstudoIcon() {
  return (
    <div className={ACTIVE_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={ACTIVE_IC} aria-hidden="true">
        <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" />
      </svg>
    </div>
  );
}

function MeusResumosIcon() {
  return (
    <div className={ACTIVE_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={ACTIVE_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A48.07 48.07 0 0 1 12 3c1.268 0 2.53.038 3.988.012ZM6.5 7.5a1.5 1.5 0 0 0-1.5 1.5v6.5A1.5 1.5 0 0 0 6.5 17h7A1.5 1.5 0 0 0 15 15.5V10.621a1.5 1.5 0 0 0-.44-1.06l-3.12-3.122A1.5 1.5 0 0 0 10.378 6H6.5Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

function BancoQuestoesIcon() {
  return (
    <div className={ACTIVE_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={ACTIVE_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

function ConteudoProgramaticoIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" />
      </svg>
    </div>
  );
}

function PriorizacaoIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .75-.75v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z" />
      </svg>
    </div>
  );
}

function PlanoEstudosIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

function NovidadesIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v11.75A2.75 2.75 0 0 0 16.75 18h-12A2.75 2.75 0 0 1 2 15.25V3.5Zm3.75 7a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM5 5.75A.75.75 0 0 1 5.75 5h4.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 8.25v-2.5Z" clipRule="evenodd" />
        <path d="M16.5 6.5h-1v8.75a1.25 1.25 0 1 0 2.5 0V8a1.5 1.5 0 0 0-1.5-1.5Z" />
      </svg>
    </div>
  );
}

function MateriaisAdicionaisIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75Zm0 4.167a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Zm0 4.166a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Zm0 4.167a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

function ConceitosIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

function ExplicarConceitoIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 3.925 1 5.261v2.978c0 1.336.993 2.506 2.43 2.737.236.038.474.065.713.082a13.14 13.14 0 0 0 1.439 2.646l-.326.652a1.5 1.5 0 0 0 .58 1.92l.09.053a17.47 17.47 0 0 0 3.29 1.44.75.75 0 0 0 .568 0 17.47 17.47 0 0 0 3.29-1.44l.09-.053a1.5 1.5 0 0 0 .58-1.92l-.326-.652A13.14 13.14 0 0 0 15.857 11.1c.24-.018.478-.044.713-.082C18.007 10.745 19 9.575 19 8.239V5.26c0-1.336-.993-2.506-2.43-2.737A42.11 42.11 0 0 0 10 2Zm0 4.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6.5Zm0-2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

function SimuladoIcon() {
  return (
    <div className={MUTED_BG}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={MUTED_IC} aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

const NAV_CARDS: NavCard[] = [
  {
    title: "Método Roboto",
    description: "Resumo personalizado + questões no estilo da banca. Estude de forma inteligente.",
    href: "#",
    icon: <MetodoRobotoIcon />,
    enabled: false,
  },
  {
    title: "Análise do Estudo",
    description: "Veja estatísticas detalhadas do seu desempenho por tópico.",
    href: "/dashboard",
    icon: <AnaliseEstudoIcon />,
    enabled: true,
  },
  {
    title: "Meus Resumos",
    description: "Consulte todos os resumos gerados nas suas sessões de estudo.",
    href: "/resumos",
    icon: <MeusResumosIcon />,
    enabled: true,
  },
  {
    title: "Banco de Questões",
    description: "Filtre e resolva questões de concursos anteriores por banca e tópico.",
    href: "/questoes",
    icon: <BancoQuestoesIcon />,
    enabled: true,
  },
  {
    title: "Conteúdo Programático",
    description: "Visualize o conteúdo programático completo de cada concurso.",
    href: "#",
    icon: <ConteudoProgramaticoIcon />,
    enabled: false,
  },
  {
    title: "Priorização",
    description: "Veja quais temas precisam de mais atenção com base no seu desempenho.",
    href: "#",
    icon: <PriorizacaoIcon />,
    enabled: false,
  },
  {
    title: "Plano de Estudos",
    description: "Crie um cronograma personalizado até a data da sua prova.",
    href: "#",
    icon: <PlanoEstudosIcon />,
    enabled: false,
  },
  {
    title: "Novidades",
    description: "Acompanhe as últimas notícias de concursos públicos.",
    href: "#",
    icon: <NovidadesIcon />,
    enabled: false,
  },
  {
    title: "Materiais Adicionais",
    description: "Explore vídeos, artigos e materiais complementares por tema.",
    href: "#",
    icon: <MateriaisAdicionaisIcon />,
    enabled: false,
  },
  {
    title: "Conceitos",
    description: "Estude conceitos em formato de flashcard e acompanhe seu progresso.",
    href: "#",
    icon: <ConceitosIcon />,
    enabled: false,
  },
  {
    title: "Explicar Conceito",
    description: "Não entendeu algo? Nossa IA explica de forma simples e clara.",
    href: "#",
    icon: <ExplicarConceitoIcon />,
    enabled: false,
  },
  {
    title: "Simulado",
    description: "Monte simulados personalizados com questões por matéria e dificuldade.",
    href: "#",
    icon: <SimuladoIcon />,
    enabled: false,
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "estudante";

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-txt">Olá, {displayName}</h1>
          <p className="mt-2 text-sm text-txt-2">
            Como você quer estudar hoje?
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NAV_CARDS.map((card) =>
            card.enabled ? (
              <Link key={card.title} href={card.href} className="block group">
                <Card hover className="p-6 h-full">
                  {card.icon}
                  <h2 className="mt-3 text-sm font-semibold text-txt group-hover:text-accent-700 transition-colors">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-xs text-txt-3">{card.description}</p>
                </Card>
              </Link>
            ) : (
              <div key={card.title} className="cursor-not-allowed">
                <Card className="p-6 h-full opacity-60">
                  <div className="flex items-center gap-3">
                    {card.icon}
                    <Badge>Em breve</Badge>
                  </div>
                  <h2 className="mt-3 text-sm font-semibold text-txt-2">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-xs text-txt-3">{card.description}</p>
                </Card>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}
