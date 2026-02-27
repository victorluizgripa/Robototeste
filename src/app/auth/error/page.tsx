import { Breadcrumb } from "@/components/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  void searchParams;

  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-md mx-auto">
        <Breadcrumb
          segments={[
            { label: "Home", href: "/dashboard" },
            { label: "Erro de autenticação" },
          ]}
        />

        <Card className="mt-8 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-bg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6 text-error-text"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-txt">
            Não foi possível finalizar o login
          </h1>
          <p className="text-sm text-txt-2">
            Ocorreu um erro durante a autenticação. Tente novamente ou verifique
            se o login com Google está habilitado.
          </p>
          <a href="/login">
            <Button className="w-full">Voltar para o login</Button>
          </a>
        </Card>
      </div>
    </main>
  );
}
