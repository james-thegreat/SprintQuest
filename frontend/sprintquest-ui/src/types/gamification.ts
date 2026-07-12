export type UnlockedAchievement = {
  name: string;
  description: string;
  badgeKey: string;
};

export type GamificationSummary = {
  totalXp: number;
  xpEventCount: number;
  completedTaskCount: number;
  unlockedAchievements: UnlockedAchievement[];
};