using Microsoft.EntityFrameworkCore;
using SprintQuest.Application.DTOs.TaskItems;
using SprintQuest.Domain.Entities;
using SprintQuest.Domain.Enums;
using SprintQuest.Infrastructure.Services;
using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;

namespace SprintQuest.Tests.Infrastructure.Services;

public class TaskItemServiceTests
{
    [Fact]
    public async Task CreateAsync_WhenSprintExists_PersistsAndReturnsTask()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var project = new Project(
            "M11 Testing Project",
            "Project used by service tests");

        var sprint = new Sprint(
            project.Id,
            "Testing Sprint",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14));

        database.Context.Projects.Add(project);
        database.Context.Sprints.Add(sprint);
        await database.Context.SaveChangesAsync();

        var request = new CreateTaskItemRequest
        {
            SprintId = sprint.Id,
            Title = "Add task-service tests",
            Description = "Protect task creation behaviour",
            Priority = Priority.High,
            StoryPoints = 5,
            XpReward = 40
        };

        var service = new TaskItemService(database.Context);

        // Act
        var result = await service.CreateAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(sprint.Id, result.SprintId);
        Assert.Equal("Add task-service tests", result.Title);
        Assert.Equal("Protect task creation behaviour", result.Description);
        Assert.Equal(DomainTaskStatus.Backlog, result.Status);
        Assert.Equal(Priority.High, result.Priority);
        Assert.Equal(5, result.StoryPoints);
        Assert.Equal(40, result.XpReward);
        Assert.Null(result.CompletedAt);

        var persistedTask =
            await database.Context.TaskItems.SingleAsync();

        Assert.Equal(result.Id, persistedTask.Id);
        Assert.Equal(result.Title, persistedTask.Title);
        Assert.Equal(result.SprintId, persistedTask.SprintId);
    }

    [Fact]
    public async Task CreateAsync_WhenSprintDoesNotExist_ReturnsNullAndDoesNotPersist()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var request = new CreateTaskItemRequest
        {
            SprintId = Guid.NewGuid(),
            Title = "Task with missing sprint",
            Description = "This task should not be saved",
            Priority = Priority.Medium,
            StoryPoints = 2,
            XpReward = 15
        };

        var service = new TaskItemService(database.Context);

        // Act
        var result = await service.CreateAsync(request);

        // Assert
        Assert.Null(result);
        Assert.Empty(await database.Context.TaskItems.ToListAsync());
    }

    [Fact]
    public async Task UpdateAsync_WhenTaskExists_ReturnsAuthoritativePersistedTask()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var project = new Project("Update Test Project");

        var sprint = new Sprint(
            project.Id,
            "Update Test Sprint",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14));

        var task = new TaskItem(
            sprint.Id,
            "Original task title",
            "Original description",
            Priority.Low,
            storyPoints: 1,
            xpReward: 10);

        database.Context.Projects.Add(project);
        database.Context.Sprints.Add(sprint);
        database.Context.TaskItems.Add(task);
        await database.Context.SaveChangesAsync();

        var request = new UpdateTaskItemRequest
        {
            Title = "Updated task title",
            Description = "Updated description",
            Status = DomainTaskStatus.InProgress,
            Priority = Priority.Critical,
            StoryPoints = 8,
            XpReward = 75
        };

        var service = new TaskItemService(database.Context);

        // Act
        var result = await service.UpdateAsync(task.Id, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(task.Id, result.Id);
        Assert.Equal(sprint.Id, result.SprintId);
        Assert.Equal("Updated task title", result.Title);
        Assert.Equal("Updated description", result.Description);
        Assert.Equal(DomainTaskStatus.InProgress, result.Status);
        Assert.Equal(Priority.Critical, result.Priority);
        Assert.Equal(8, result.StoryPoints);
        Assert.Equal(75, result.XpReward);
        Assert.Null(result.CompletedAt);

        var persistedTask = await database.Context.TaskItems
            .AsNoTracking()
            .SingleAsync(savedTask => savedTask.Id == task.Id);

        Assert.Equal(result.Title, persistedTask.Title);
        Assert.Equal(result.Description, persistedTask.Description);
        Assert.Equal(result.Status, persistedTask.Status);
        Assert.Equal(result.Priority, persistedTask.Priority);
        Assert.Equal(result.StoryPoints, persistedTask.StoryPoints);
        Assert.Equal(result.XpReward, persistedTask.XpReward);
    }

    [Fact]
    public async Task UpdateAsync_WhenTaskDoesNotExist_ReturnsNull()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var request = new UpdateTaskItemRequest
        {
            Title = "Missing task",
            Description = "This update should not succeed",
            Status = DomainTaskStatus.Testing,
            Priority = Priority.Medium,
            StoryPoints = 3,
            XpReward = 20
        };

        var service = new TaskItemService(database.Context);

        // Act
        var result = await service.UpdateAsync(Guid.NewGuid(), request);

        // Assert
        Assert.Null(result);
        Assert.Empty(await database.Context.TaskItems.ToListAsync());
        Assert.Empty(await database.Context.XpEvents.ToListAsync());
    }


    [Fact]
    public async Task UpdateAsync_WhenMovedToDone_PersistsXpEvent()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var project = new Project("Completion Test Project");

        var sprint = new Sprint(
            project.Id,
            "Completion Test Sprint",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14));

        var task = new TaskItem(
            sprint.Id,
            "Complete service testing",
            "Award XP when completed",
            Priority.High,
            storyPoints: 5,
            xpReward: 50);

        database.Context.Projects.Add(project);
        database.Context.Sprints.Add(sprint);
        database.Context.TaskItems.Add(task);
        await database.Context.SaveChangesAsync();

        var request = new UpdateTaskItemRequest
        {
            Title = task.Title,
            Description = task.Description,
            Status = DomainTaskStatus.Done,
            Priority = task.Priority,
            StoryPoints = task.StoryPoints,
            XpReward = task.XpReward
        };

        var service = new TaskItemService(database.Context);

        // Act
        var result = await service.UpdateAsync(task.Id, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(DomainTaskStatus.Done, result.Status);
        Assert.NotNull(result.CompletedAt);

        var xpEvent = await database.Context.XpEvents
            .AsNoTracking()
            .SingleAsync();

        Assert.Equal(50, xpEvent.Amount);
        Assert.Equal(
            "Completed task: Complete service testing",
            xpEvent.Reason);

        var persistedTask = await database.Context.TaskItems
            .AsNoTracking()
            .SingleAsync(savedTask => savedTask.Id == task.Id);

        Assert.Equal(DomainTaskStatus.Done, persistedTask.Status);
        Assert.NotNull(persistedTask.CompletedAt);
    }

    [Fact]
    public async Task UpdateAsync_WhenTaskIsAlreadyDone_DoesNotDuplicateXpEvent()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var project = new Project("Duplicate XP Test Project");

        var sprint = new Sprint(
            project.Id,
            "Duplicate XP Test Sprint",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14));

        var task = new TaskItem(
            sprint.Id,
            "Prevent duplicate XP",
            xpReward: 30);

        database.Context.Projects.Add(project);
        database.Context.Sprints.Add(sprint);
        database.Context.TaskItems.Add(task);
        await database.Context.SaveChangesAsync();

        var request = new UpdateTaskItemRequest
        {
            Title = task.Title,
            Description = task.Description,
            Status = DomainTaskStatus.Done,
            Priority = task.Priority,
            StoryPoints = task.StoryPoints,
            XpReward = task.XpReward
        };

        var service = new TaskItemService(database.Context);

        // Act
        var firstResult = await service.UpdateAsync(task.Id, request);
        var secondResult = await service.UpdateAsync(task.Id, request);

        // Assert
        Assert.NotNull(firstResult);
        Assert.NotNull(secondResult);
        Assert.Equal(DomainTaskStatus.Done, secondResult.Status);

        var xpEvents = await database.Context.XpEvents
            .AsNoTracking()
            .ToListAsync();

        var xpEvent = Assert.Single(xpEvents);
        Assert.Equal(30, xpEvent.Amount);
    }

    [Fact]
    public async Task DeleteAsync_WhenTaskExists_RemovesTaskAndReturnsTrue()
    {
        // Arrange
        using var database = new SqliteTestDatabase();

        var project = new Project("Delete Test Project");

        var sprint = new Sprint(
            project.Id,
            "Delete Test Sprint",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14));

        var task = new TaskItem(
            sprint.Id,
            "Delete this task");

        database.Context.Projects.Add(project);
        database.Context.Sprints.Add(sprint);
        database.Context.TaskItems.Add(task);
        await database.Context.SaveChangesAsync();

        var service = new TaskItemService(database.Context);

        // Act
        var result = await service.DeleteAsync(task.Id);

        // Assert
        Assert.True(result);
        Assert.False(
            await database.Context.TaskItems
                .AnyAsync(savedTask => savedTask.Id == task.Id));
    }

    [Fact]
    public async Task DeleteAsync_WhenTaskDoesNotExist_ReturnsFalse()
    {
        // Arrange
        using var database = new SqliteTestDatabase();
        var service = new TaskItemService(database.Context);

        // Act
        var result = await service.DeleteAsync(Guid.NewGuid());

        // Assert
        Assert.False(result);
        Assert.Empty(await database.Context.TaskItems.ToListAsync());
    }

}
