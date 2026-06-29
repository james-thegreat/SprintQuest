using SprintQuest.Domain.Entities;

namespace SprintQuest.Tests;

public class AchievementTests
{
    [Fact]
    public void Constructor_WithValidData_CreatesAchievement()
    {
        // Act
        var achievement = new Achievement(
            "First Steps",
            "Complete your first task",
            "first-task",
            10);

        // Assert
        Assert.NotEqual(Guid.Empty, achievement.Id);
        Assert.Equal("First Steps", achievement.Name);
        Assert.Equal("Complete your first task", achievement.Description);
        Assert.Equal("first-task", achievement.BadgeKey);
        Assert.Equal(10, achievement.RequiredXp);
        Assert.NotEqual(default, achievement.CreatedAt);
    }

    [Fact]
    public void Constructor_WithEmptyName_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            new Achievement("", "Description", "badge", 10));
    }

    [Fact]
    public void Constructor_WithEmptyDescription_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            new Achievement("Achievement", "", "badge", 10));
    }

    [Fact]
    public void Constructor_WithEmptyBadgeKey_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            new Achievement("Achievement", "Description", "", 10));
    }

    [Fact]
    public void Constructor_WithNegativeRequiredXp_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            new Achievement("Achievement", "Description", "badge", -1));
    }
}