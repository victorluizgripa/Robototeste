"use client";

import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SummaryDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Breadcrumb
          segments={[
            { label: "Home", href: "/" },
            { label: "Meus Resumos", href: "/resumos" },
            { label: "Erro" },
          ]}
        />

        <Card className="p-8 text-center space-y-4">
          <h1 className="text-lg font-bold text-txt">
            Erro ao carregar resumo
          </h1>
          <p className="text-sm text-txt-2">
            Não foi possível carregar este resumo. Ele pode ter sido removido ou
            estar indisponível no momento.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={reset}>
              Tentar novamente
            </Button>
            <Link href="/resumos">
              <Button>Voltar para resumos</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
