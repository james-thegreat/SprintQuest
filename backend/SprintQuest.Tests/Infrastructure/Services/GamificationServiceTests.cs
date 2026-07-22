using Microsoft.EntityFrameworkCore;
using SprintQuest.Domain.Entities;
using SprintQuest.Infrastructure.Services;
using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;

namespace SprintQuest.Tests.Infrastructure.Services;

public class GamificationServiceTests
{
    [Fact]
    public async Task GetSummaryAsync_WhenDatabaseIsEmpty_ReturnsEmptySummary()
    {
        // Arrange
        using var database = new SqliteTestDatabase();
        var service = new GamificationService(database.Context);

        // Act
        var result = await service.GetSummaryAsync();

        // Assert
        Assert.Equal(0, result.TotalXp);
        Assert.Equal(0, result.XpEventCount);
        Assert.Equal(0, result.CompletedTaskCount);
        Assert.Empty(result.UnlockedAchievements);
    }

    [Fact]
    public async Task GetSummaryAsync_WithCompletedTaskAndXpEvents_ReturnsCorrectSummary()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var project = new Project("Gamification Test Project");

        var sprint = new Sprint(
            project.Id,
            "Gamification Test Sprint",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14));

        var completedTask = new TaskItem(
            sprint.Id,
            "Complete gamification testing");

        completedTask.Complete();

        var incompleteTask = new TaskItem(
            sprint.Id,
            "Future task");

        database.Context.Projects.Add(project);
        database.Context.Sprints.Add(sprint);
        database.Context.TaskItems.AddRange(
            completedTask,
            incompleteTask);

        database.Context.XpEvents.AddRange(
            new XpEvent(20, "Completed first task"),
            new XpEvent(30, "Completed second task"));

        await database.Context.SaveChangesAsync();

        var service = new GamificationService(database.Context);

        // Act
        var result = await service.GetSummaryAsync();

        // Assert
        Assert.Equal(50, result.TotalXp);
        Assert.Equal(2, result.XpEventCount);
        Assert.Equal(1, result.CompletedTaskCount);

        var achievement =
            Assert.Single(result.UnlockedAchievements);

        Assert.Equal("First Task Complete", achievement.Name);
        Assert.Equal(
            "Complete your first task.",
            achievement.Description);
        Assert.Equal(
            "first-task-complete",
            achievement.BadgeKey);
    }

    [Fact]
    public async Task GetSummaryAsync_WhenCalledRepeatedly_DoesNotChangeStoredData()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var project = new Project("Summary Repeat Test Project");

        var sprint = new Sprint(
            project.Id,
            "Summary Repeat Test Sprint",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14));

        var task = new TaskItem(
            sprint.Id,
            "Completed task");

        task.Complete();

        database.Context.Projects.Add(project);
        database.Context.Sprints.Add(sprint);
        database.Context.TaskItems.Add(task);
        database.Context.XpEvents.Add(
            new XpEvent(25, "Completed task"));

        await database.Context.SaveChangesAsync();

        var service = new GamificationService(database.Context);

        // Act
        var firstResult = await service.GetSummaryAsync();
        var secondResult = await service.GetSummaryAsync();

        // Assert
        Assert.Equal(firstResult.TotalXp, secondResult.TotalXp);
        Assert.Equal(
            firstResult.XpEventCount,
            secondResult.XpEventCount);
        Assert.Equal(
            firstResult.CompletedTaskCount,
            secondResult.CompletedTaskCount);

        Assert.Equal(
            1,
            await database.Context.XpEvents.CountAsync());

        Assert.Equal(
            1,
            await database.Context.TaskItems.CountAsync(
                savedTask =>
                    savedTask.Status == DomainTaskStatus.Done));
    }
}
