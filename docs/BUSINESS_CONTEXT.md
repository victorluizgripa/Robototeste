# Roboto — Contexto de Negócio (Fonte de Verdade)

> **Objetivo:** dar contexto de produto/negócio para agentes de IA e devs construírem o Roboto com coerência.  
> **Anti-alucinação:** não inventar fluxos, telas, eventos, tabelas ou regras não descritas aqui. Quando faltar detalhe, propor 2–3 alternativas e pedir confirmação.

---

## 1) O que é o Roboto

O **Roboto** é um app de estudos para concursos que maximiza aprendizagem por meio de:

- **Personalização do estudo** (recomendações e conteúdo adaptado por tema).
- **Foco em prática**: resolver questões + gerar/consumir resumos por tema.
- **Controle de desempenho** via métricas claras e acionáveis (por tema).
- **Reforço** (resumos/explicações) quando necessário.
- **Gamificação leve** para manter consistência (streak, metas, feedback visual).

**Tese:** o Roboto guia o aluno do zero até a aprovação, priorizando prática e personalização do estudo com feedback contínuo.

---

## 2) Persona e JTBD

### Persona primária

- Concurseiro que precisa de direção e constância.

### Dores principais

- Não sabe o que estudar agora e repete erros.
- Se sente perdido: estuda alguns dias e depois para.

### JTBD

- Transformar tempo de estudo em **progresso mensurável por tema**, reduzindo erro recorrente e aumentando consistência semanal.

---

## 3) Promessa do produto

**Proposta de valor:**  
"Você estuda o que mais importa hoje, com feedback claro do que melhorou e qual o próximo passo."

---

## 4) Métrica norte e métricas de suporte

### North Star Metric

- **WAU (%)**: % de usuários **ativos** na semana.  
  **Ativo =** realizou pelo menos 1 ação de estudo: **resolver questões** ou **ler um resumo**.

### Métricas de suporte

- Retenção D7 / D30
- Questões respondidas por semana
- % de temas com domínio ≥ X%
- Taxa de conclusão de sessão (iniciar → responder → ver feedback)
- Streak (dias ativos)

---

## 5) Escopo (MVP vs depois)

### MVP (primeiro slice vertical)

1. **Auth + onboarding curto**
2. **Banco de questões (listagem)** — listar questões existentes no banco (Supabase)
3. **Fazer questão (detalhe)** — abrir questão, responder, exibir resolução, justificativas, dicas
4. **Análise do estudo** — quantidade de questões por tema, percentual de acerto por tema
5. **Resumos (listagem + geração)** — listar resumos existentes, selecionar tema e gerar resumo via prompt pré-definido

> Onboarding curto: definir o mínimo para personalização (ex.: selecionar prova/área/temas). Se ficar para depois, o MVP vira genérico.

### Não-MVP (postergar)

- Editor avançado de resumos
- Simulados com cronômetro e análises avançadas
- Geração massiva de questões por IA
- Gamificação pesada
- Priorização automática sofisticada

---

## 6) Monetização

Sistema com **3 tiers**, configurados na tabela `plan_configurations`.

| Recurso                    | Free   | Premium | Premium Plus |
|---------------------------|--------|---------|--------------|
| Questões/dia              | Limitado | Moderado | 500 (safety) |
| Resumos gerados/dia       | Limitado | Moderado | 50 (safety)  |
| Resumos visualizados/dia  | Limitado | Moderado | Ilimitado (visual) |
| Chat mensagens/dia        | Limitado | Moderado | 200 (safety) |
| Plano de Estudos          | ❌     | ✅      | ✅           |
| Analytics                 | ❌     | ✅      | ✅           |
| Modificação de resumos    | ❌     | ✅      | ✅           |

Premium Plus se apresenta como "ilimitado" ao usuário, com safety limits altos.

---

## 7) Conteúdo: qualidade e rastreabilidade

### Contrato mínimo de uma questão

- Enunciado
- Alternativas
- Gabarito
- Explicação geral
- **Dica do Roboto**
- Justificativa por alternativa (correta e incorretas)
- Conteúdo adicional (links)
- Conceitos cobrados (associação com tabela `concepts`)

### Rastreabilidade

- Toda questão tem **origem** (importada/gerada) e metadados de referência.

---

## 8) Taxonomia do conteúdo

### Hierarquias

- **Matéria → Tema → Questão**
- **Matéria → Tema → Resumo**
- **Matéria → Tema → Conceito**
- **Edital/Prova → Grupo de temas → Tema**

**Tema** é a entidade ponte entre as visões Matéria/Tema e Edital/Grupo/Tema.

---

## 9) Princípios de UX e tom

- Poucos cliques para começar a estudar
- Card-first (ações principais em cards)
- Feedback imediato e claro
- Evitar excesso de filtros no início
- **Tom:** mentor direto, objetivo, sem enrolação

---

## 10) Restrições operacionais

- Registrar outputs de IA no banco para reuso/caching entre alunos (ex.: resumos).
- Evitar dependência de IA em fluxos críticos do MVP.
- Cada feature deve ter custo operacional estimado.

---

## 11) Decisões técnicas (confirmadas)

- **Frontend:** Next.js (App Router) + TypeScript
- **Backend/Auth:** Supabase com Login Google
- **Deploy:** Vercel

---

## 12) Perguntas pendentes (travar produto)

1. Qual concurso/banca/cargo foco inicial (ou modo genérico)?
2. Qual rota pós-login (ex.: `/dashboard`) e ordem das telas do MVP?
3. Qual regra de "domínio por tema" (métrica e limiar)?
4. Monetização: limites exatos Free/Premium/Premium Plus e ponto de paywall.

---

## 13) Critérios de aceite do MVP

- Usuário consegue: logar com Google, ver banco de questões, abrir e responder uma questão com feedback completo, ver análise básica por tema (quantidade e % acerto), listar resumos e gerar um resumo por tema.
- Nenhuma tela crítica depende de IA para funcionar (IA apenas para gerar resumo).
- Estados de loading/erro tratados nas telas principais.
