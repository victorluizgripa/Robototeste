import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roboto — Estudos para concursos",
  description:
    "Você estuda o que mais importa hoje, com feedback claro do que melhorou e qual o próximo passo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
