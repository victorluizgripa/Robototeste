import type {
  SummaryLevel,
  GeneralSummary,
  UserSummaryWithContent,
} from "./types";

export interface SummaryRepositoryPort {
  findGeneralSummary(
    themeId: string,
    level: SummaryLevel,
  ): Promise<GeneralSummary | null>;

  createGeneralSummary(
    themeId: string,
    level: SummaryLevel,
    contentMd: string,
  ): Promise<GeneralSummary>;

  createUserSummary(
    userId: string,
    generalSummaryId: string,
  ): Promise<{ id: string }>;

  listUserSummaries(userId: string): Promise<UserSummaryWithContent[]>;

  getUserSummary(
    userId: string,
    userSummaryId: string,
  ): Promise<UserSummaryWithContent | null>;
}
