import { readFileSync } from "fs";
import { join } from "path";
import OpenAI from "openai";
import type { SummaryGeneratorPort } from "@/domain/summaries/summary-generator-port";
import type { SummaryLevel } from "@/domain/summaries/types";

/** Carrega o system prompt de docs/summary-prompt.md (conteúdo após o primeiro "---"). */
function loadSystemPrompt(): string {
  const path = join(process.cwd(), "docs", "summary-prompt.md");
  const raw = readFileSync(path, "utf-8");
  const parts = raw.split(/\n---\n/);
  const prompt = (parts[1] ?? raw).trim();
  if (!prompt) {
    throw new Error("docs/summary-prompt.md: prompt vazio ou sem bloco após ---");
  }
  return prompt;
}

const LEVEL_DIRECTIVES: Record<SummaryLevel, string> = {
  medio:
    "DIRETIVA DE NÍVEL: Conteúdo de nível médio. Foque em conceitos fundamentais, definições claras e linguagem acessível. Priorize o essencial que é cobrado em provas de nível médio, evitando aprofundamentos excessivos.",
  tecnico:
    "DIRETIVA DE NÍVEL: Conteúdo de nível técnico. Combine fundamentos sólidos com terminologia profissional e aplicações práticas. Inclua detalhes técnicos relevantes para provas de nível técnico.",
  superior:
    "DIRETIVA DE NÍVEL: Conteúdo de nível superior. Aprofunde a análise com visão crítica, relações entre institutos, jurisprudência e doutrina quando aplicável. Aborde nuances e exceções cobradas em provas de nível superior.",
};

const TIMEOUT_MS = 60_000;
const MAX_TOKENS = 4096;

function createClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const openaiSummaryGenerator: SummaryGeneratorPort = {
  async generate(themeName, subjectName, level) {
    const client = createClient();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const systemPrompt = loadSystemPrompt();
      const userMessage = `${LEVEL_DIRECTIVES[level]}

Produza um resumo sobre o tema "${themeName}" da matéria "${subjectName}".`;

      const response = await client.chat.completions.create(
        {
          model: "gpt-4o-mini",
          max_tokens: MAX_TOKENS,
          temperature: 0.4,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        },
        { signal: controller.signal },
      );

      const contentMd = response.choices[0]?.message?.content?.trim();
      if (!contentMd) {
        throw new Error("OpenAI returned empty content");
      }

      return { contentMd };
    } finally {
      clearTimeout(timer);
    }
  },
};
