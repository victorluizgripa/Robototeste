import type { SummaryLevel } from "./types";

export interface SummaryGeneratorPort {
  generate(
    themeName: string,
    subjectName: string,
    level: SummaryLevel,
  ): Promise<{ contentMd: string }>;
}
