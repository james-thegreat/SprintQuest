using SprintQuest.Domain.Gamification;

namespace SprintQuest.Tests;

public class AchievementRulesTests
{
    [Fact]
    public void GetUnlockedAchievements_WhenNoTasksCompleted_ReturnsEmptyList()
    {
        // Act
        var achievements = AchievementRules.GetUnlockedAchievements(
            completedTaskCount: 0,
            totalXp: 0);

        // Assert
        Assert.Empty(achievements);
    }

    [Fact]
    public void GetUnlockedAchievements_WhenAtLeastOneTaskCompleted_UnlocksFirstTaskComplete()
    {
        // Act
        var achievements = AchievementRules.GetUnlockedAchievements(
            completedTaskCount: 1,
            totalXp: 10);

        // Assert
        var achievement = Assert.Single(achievements);
        Assert.Equal("First Task Complete", achievement.Name);
        Assert.Equal("Complete your first task.", achievement.Description);
        Assert.Equal("first-task-complete", achievement.BadgeKey);
        Assert.Equal(0, achievement.RequiredXp);
    }
}