# Roboto

App de estudos para concursos — personalização, prática (questões + resumos) e métricas por tema.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind
- **Backend/Auth:** Supabase (Login Google)
- **Deploy:** Vercel

## Documentação

- [Contexto de negócio](docs/BUSINESS_CONTEXT.md) — fonte de verdade do produto
- [Próximos passos](docs/NEXT_STEPS.md) — ordem de implementação do MVP e perguntas pendentes

## Setup

```bash
cp .env.local.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).