# Próximos passos — Roboto MVP

Guia objetivo para seguir após o setup inicial. Decisões de produto pendentes estão no final.

---

## Feito até aqui

- [x] Contexto de negócio em `docs/BUSINESS_CONTEXT.md`
- [x] Next.js (App Router) + TypeScript + Tailwind
- [x] Supabase: client browser (`src/lib/supabase/client.ts`) e server (`src/lib/supabase/server.ts`)
- [x] Variáveis de ambiente: copiar `.env.local.example` → `.env.local` e preencher

---

## Ordem sugerida para o MVP

### 1. Ambiente

1. **Supabase:** criar projeto em [supabase.com](https://supabase.com), anotar URL e anon key.
2. **Auth Google:** no dashboard do projeto → Authentication → Providers → Google (habilitar e configurar OAuth no Google Cloud).
3. **`.env.local`:** copiar de `.env.local.example` e preencher `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Supabase → Authentication → URL Configuration:** conferir `Site URL` e `Redirect URLs` permitidos, para evitar erros de redirect ao usar `redirectTo`.
5. Rodar `npm install` e `npm run dev` e abrir a home para validar.

### 2. Schema incremental no Supabase (SQL)

Partir do que **já existe** no banco (fonte de verdade, não renomear/duplicar):

- `subjects`
- `themes` (FK `subject_id` → `subjects.id`)
- `question_bank` (FK `theme_id` → `themes.id`, `options jsonb`, etc.)
- `concepts` (FK `theme_id` → `themes.id`)

Para o MVP, **adicionar apenas** o que ainda falta para suportar as telas definidas:

1. **Progresso do usuário** (ex.: `user_progress`):  
   - contrato mínimo: `user_id`, `question_id`, `is_correct`, `answered_at`  
   - usado para: tela de **análise** (quantidade e % de acerto por tema).
2. **Resumos persistidos** (ex.: `summaries`):  
   - contrato mínimo: `id`, `theme_id`, `content`, `created_by`, `created_at`
   - usado para: listagem de resumos + reuso/caching entre alunos.

Regra geral: antes de criar coluna nova, definir o **contrato de dados** que a UI precisa (inputs/outputs da tela) e só então mapear para SQL. Centralizar a verdade desse schema num arquivo versionado (ex.: `supabase/migrations/001_initial.sql` + migrações incrementais).

### 3. Rotas e telas (MVP)

Definir **rota pós-login fixa** e evitar “ou” para não gerar ambiguidade.

Ordem sugerida de implementação:

| # | Rota / tela | O que fazer |
|---|-------------|-------------|
| 1 | Auth + redirecionamento | Login com Google, redirect para rota pós-login (ex.: `/dashboard`); proteger rotas que exigem auth. |
| 2 | Onboarding curto | Uma tela mínima (ex.: seleção de prova/área ou “começar genérico”) para não deixar o MVP genérico demais. |
| 3 | `/questoes` | Listagem do banco de questões (`question_bank` no Supabase), card-first, poucos cliques. |
| 4 | `/questoes/[id]` | Detalhe: abrir questão, responder, **gravar progresso** e exibir resolução, justificativas, dicas. |
| 5 | `/analise` | Análise do estudo: quantidade de questões e % de acerto por tema (usando a tabela de progresso). |
| 6 | `/resumos` | Listar resumos existentes; botão/ação “gerar resumo” por tema (prompt pré-definido, IA só aqui). |

Em cada tela: estados de **loading** e **erro** conforme critérios de aceite.

### 4. Regras e limites (MVP)

- **Domínio por tema:** definir métrica e limiar (ex.: “X% de acerto nas últimas N questões do tema”) e onde isso aparece na análise.
- **Monetização no MVP:** pode começar só com Free; depois ativar limites e paywall conforme `plan_configurations`.

---

## Perguntas pendentes (travar produto)

Responder estas quatro ajuda a evitar retrabalho:

1. **Foco inicial:** um concurso/banca/cargo específico ou modo genérico para o MVP?
2. **Rota pós-login e ordem das telas:** home. Na home terá um resumodas métricas do dia e algumas outras coisas que serão feitas no futuro.
3. **Domínio por tema:** qual regra (ex.: 70% acerto em últimas 10 questões). O user poderá ajustar isso em uma aba de configurações no futuro.
4. **Paywall:** Sem paywaal por enquanto.

Quando essas estiverem definidas, dá para desenhar fluxos e componentes sem “inventar” regras.

---

## Comandos úteis

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

---

## Referência

- Contexto de negócio: `docs/BUSINESS_CONTEXT.md`
- Critérios de aceite do MVP: seção 13 do contexto de negócio.
