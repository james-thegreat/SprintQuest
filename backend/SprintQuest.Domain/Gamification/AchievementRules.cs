using SprintQuest.Domain.Entities;

namespace SprintQuest.Domain.Gamification;

public static class AchievementRules
{
    public static IReadOnlyList<Achievement> GetUnlockedAchievements(
        int completedTaskCount,
        int totalXp)
    {
        var achievements = new List<Achievement>();

        if (completedTaskCount > 0)
        {
            achievements.Add(new Achievement(
                "First Task Complete",
                "Complete your first task.",
                "first-task-complete",
                requiredXp: 0));
        }

        return achievements;
    }
}