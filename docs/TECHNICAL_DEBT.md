# Dívidas técnicas — Roboto

Documento centralizado de dívidas técnicas conhecidas do projeto. Atualizar conforme itens forem quitados ou novos forem identificados.

---

## 1. Autenticação e proteção de rotas

| Item | Descrição | Impacto |
|------|-----------|---------|
| **Proteção por página** | Não existe `middleware.ts`. Rotas protegidas fazem `getUser()` + `redirect("/login")` em cada page/layout. | Duplicação de lógica; risco de esquecer proteção em novas rotas. |
| **Centralizar auth** | Considerar middleware ou layout protegido para rotas que exigem login (`/dashboard`, `/questoes`, `/questoes/[id]`, `/resumos`, `/resumos/[id]`). | Menos repetição e comportamento consistente. |

**Referência:** `src/app/dashboard/page.tsx`, `src/app/questoes/page.tsx`, `src/app/resumos/page.tsx`, etc.

---

## 2. Ferramentas e dependências

| Item | Descrição | Impacto |
|------|-----------|---------|
| **`next lint` deprecated** | O script `npm run lint` usa `next lint`, que está deprecated e será removido no Next.js 16. | Migrar para ESLint CLI (ver mensagem do Next: `npx @next/codemod@canary next-lint-to-eslint-cli`). |

---

## 3. Testes

| Item | Descrição | Impacto |
|------|-----------|---------|
| **Ausência de testes automatizados** | Não há testes unitários nem e2e no repositório (apenas em `node_modules`). | Regressões e refatorações mais arriscadas; critérios de aceite do MVP dependem de teste manual. |

**Sugestão:** Introduzir testes para fluxos críticos (auth, criação de resumo, resposta de questão) e para domain/actions quando possível.

---

## 4. Variáveis de ambiente e runtime

| Item | Descrição | Impacto |
|------|-----------|---------|
| **Non-null assertion em env** | `src/lib/supabase/server.ts` usa `process.env.NEXT_PUBLIC_SUPABASE_URL!` e `..._ANON_KEY!`. | Se a variável não estiver definida, falha em runtime sem mensagem clara. |
| **Validação de env** | Considerar validação no startup (ex.: módulo que lê e valida env antes de criar clientes). | Falha rápida e mensagem explícita em dev/deploy. |

---

## 5. Tratamento de erros

| Item | Descrição | Impacto |
|------|-----------|---------|
| **Supabase server `setAll`** | Em `src/lib/supabase/server.ts`, o `setAll` faz `try/catch` e ignora erros (“Ignorado em Server Components”). | Pode mascarar falhas de cookie em contextos onde deveriam ser tratadas ou logadas. |

---

## 6. UX e consistência

| Item | Descrição | Impacto |
|------|-----------|---------|
| **Breadcrumb na página de erro de auth** | `src/app/auth/error/page.tsx`: “Home” aponta para `/dashboard`. Usuário nessa página normalmente não está autenticado. | Pode ser mais coerente “Home” → `/` (landing) em vez de `/dashboard`. |

---

## 7. Schema e banco de dados

| Item | Descrição | Impacto |
|------|-----------|---------|
| **Documentação do schema** | Existe uma migration em `supabase/migrations/` para resumos. O restante do schema (subjects, themes, question_bank, user_answers, etc.) pode não estar totalmente versionado em migrations. | Garantir que toda a verdade do schema esteja em migrations versionadas (conforme `docs/NEXT_STEPS.md`) para reprodutibilidade e onboarding. |

---

## 8. Produto e limites (não implementados no MVP)

| Item | Descrição | Impacto |
|------|-----------|---------|
| **Limites de uso** | Tiers Free/Premium/Premium Plus e limites (resumos/dia, questões/dia, etc.) definidos em `docs/BUSINESS_CONTEXT.md` e `plan_configurations` não estão implementados. | Quando ativados, será necessário implementar checagens e possivelmente paywall. |
| **Domínio por tema** | Regra de “domínio” (ex.: 70% acerto nas últimas N questões) e onde aparece na análise ainda são perguntas pendentes (ver `docs/NEXT_STEPS.md`). | Impacta análise e futura aba de configurações. |

---

## 9. Decisões de produto pendentes

As seguintes perguntas (em `docs/BUSINESS_CONTEXT.md` e `docs/NEXT_STEPS.md`) ainda não estão travadas e podem gerar retrabalho:

1. Foco inicial: concurso/banca/cargo específico ou modo genérico?
2. Rota pós-login e ordem das telas (hoje: home com cards; dashboard com métricas do dia).
3. Regra de domínio por tema (métrica e limiar).
4. Monetização: limites exatos Free/Premium/Premium Plus e ponto de paywall.

Enquanto não forem definidas, evitar assumir regras que conflitem com as opções em aberto.

---

## Como usar este documento

- **Ao quitar uma dívida:** marcar o item como resolvido (ex.: adicionar “✅ Resolvido em DD/MM” ou remover da lista).
- **Ao identificar nova dívida:** adicionar na seção adequada (ou criar nova) com descrição objetiva e impacto.
- **Priorização:** usar em planejamento de sprints ou refatorações; não bloqueia MVP, mas orienta melhorias contínuas.
