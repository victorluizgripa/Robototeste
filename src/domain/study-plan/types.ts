export type StudyPlan = {
  id: string;
  userId: string;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudyPlanTheme = {
  id: string;
  studyPlanId: string;
  themeId: string;
  position: number;
  createdAt: string;
};

export type StudyPlanThemeWithNames = StudyPlanTheme & {
  themeName: string;
  subjectName: string;
};

export type CreateStudyPlanInput = {
  themeIds: string[];
  targetDate?: string | null;
};

export type StudyPlanWithThemes = StudyPlan & {
  themes: StudyPlanThemeWithNames[];
};
