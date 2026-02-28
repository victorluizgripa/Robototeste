export type SummaryLevel = "medio" | "tecnico" | "superior";

export type SummaryRequestInput = {
  themeId: string;
  level: SummaryLevel;
};

export type GeneralSummary = {
  id: string;
  themeId: string;
  level: SummaryLevel;
  contentMd: string;
  createdAt: string;
};

export type UserSummary = {
  id: string;
  userId: string;
  generalSummaryId: string;
  createdAt: string;
};

export type UserSummaryWithContent = UserSummary & {
  contentMd: string;
  themeName: string;
  subjectName: string;
  level: SummaryLevel;
};

export type CreateSummaryResult =
  | { success: true; userSummaryId: string }
  | { success: false; error: string };
