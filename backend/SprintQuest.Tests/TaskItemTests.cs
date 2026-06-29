using SprintQuest.Domain.Entities;
using SprintQuest.Domain.Enums;
using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;

namespace SprintQuest.Tests;

public class TaskItemTests
{
    [Fact]
    public void Constructor_WithValidData_CreatesTaskItem()
    {
        // Arrange
        var sprintId = Guid.NewGuid();

        // Act
        var task = new TaskItem(
            sprintId,
            "Build TaskItem model",
            "Create the core task domain entity",
            Priority.High,
            storyPoints: 3,
            xpReward: 25);

        // Assert
        Assert.NotEqual(Guid.Empty, task.Id);
        Assert.Equal(sprintId, task.SprintId);
        Assert.Equal("Build TaskItem model", task.Title);
        Assert.Equal("Create the core task domain entity", task.Description);
        Assert.Equal(DomainTaskStatus.Backlog, task.Status);
        Assert.Equal(Priority.High, task.Priority);
        Assert.Equal(3, task.StoryPoints);
        Assert.Equal(25, task.XpReward);
        Assert.Null(task.CompletedAt);
    }

    [Fact]
    public void Constructor_WithEmptySprintId_ThrowsArgumentException()
    {
        // Act + Assert
        Assert.Throws<ArgumentException>(() =>
            new TaskItem(Guid.Empty, "Invalid task"));
    }

    [Fact]
    public void Constructor_WithEmptyTitle_ThrowsArgumentException()
    {
        // Act + Assert
        Assert.Throws<ArgumentException>(() =>
            new TaskItem(Guid.NewGuid(), ""));
    }

    [Fact]
    public void Complete_SetsStatusToDoneAndSetsCompletedAt()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Complete me");

        // Act
        task.Complete();

        // Assert
        Assert.Equal(DomainTaskStatus.Done, task.Status);
        Assert.NotNull(task.CompletedAt);
    }

    [Fact]
    public void Reopen_SetsStatusToToDoAndClearsCompletedAt()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Reopen me");
        task.Complete();

        // Act
        task.Reopen();

        // Assert
        Assert.Equal(DomainTaskStatus.ToDo, task.Status);
        Assert.Null(task.CompletedAt);
    }

    [Fact]
    public void MoveToStatus_WhenMovedToDone_SetsCompletedAt()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Move me");

        // Act
        task.MoveToStatus(DomainTaskStatus.Done);

        // Assert
        Assert.Equal(DomainTaskStatus.Done, task.Status);
        Assert.NotNull(task.CompletedAt);
    }

    [Fact]
    public void MoveToStatus_WhenMovedAwayFromDone_ClearsCompletedAt()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Move me");
        task.MoveToStatus(DomainTaskStatus.Done);

        // Act
        task.MoveToStatus(DomainTaskStatus.InProgress);

        // Assert
        Assert.Equal(DomainTaskStatus.InProgress, task.Status);
        Assert.Null(task.CompletedAt);
    }

    [Fact]
    public void AddChecklistItem_WithValidTitle_AddsChecklistItemToTask()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Build checklist support");

        // Act
        var checklistItem = task.AddChecklistItem("Write ChecklistItem entity");

        // Assert
        Assert.Single(task.ChecklistItems);
        Assert.Equal(task.Id, checklistItem.TaskItemId);
        Assert.Contains(checklistItem, task.ChecklistItems);
    }
}