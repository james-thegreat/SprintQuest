using SprintQuest.Domain.Entities;

namespace SprintQuest.Tests;

public class ChecklistItemTests
{
    [Fact]
    public void Constructor_WithValidData_CreatesChecklistItem()
    {
        // Arrange
        var taskItemId = Guid.NewGuid();

        // Act
        var item = new ChecklistItem(taskItemId, "Write domain tests");

        // Assert
        Assert.NotEqual(Guid.Empty, item.Id);
        Assert.Equal(taskItemId, item.TaskItemId);
        Assert.Equal("Write domain tests", item.Title);
        Assert.False(item.IsCompleted);
        Assert.Null(item.CompletedAt);
        Assert.NotEqual(default, item.CreatedAt);
    }

    [Fact]
    public void Constructor_WithEmptyTaskItemId_ThrowsArgumentException()
    {
        // Act + Assert
        Assert.Throws<ArgumentException>(() =>
            new ChecklistItem(Guid.Empty, "Invalid item"));
    }

    [Fact]
    public void Constructor_WithEmptyTitle_ThrowsArgumentException()
    {
        // Act + Assert
        Assert.Throws<ArgumentException>(() =>
            new ChecklistItem(Guid.NewGuid(), ""));
    }

    [Fact]
    public void Complete_SetsIsCompletedToTrueAndSetsCompletedAt()
    {
        // Arrange
        var item = new ChecklistItem(Guid.NewGuid(), "Complete me");

        // Act
        item.Complete();

        // Assert
        Assert.True(item.IsCompleted);
        Assert.NotNull(item.CompletedAt);
    }

    [Fact]
    public void Reopen_SetsIsCompletedToFalseAndClearsCompletedAt()
    {
        // Arrange
        var item = new ChecklistItem(Guid.NewGuid(), "Reopen me");
        item.Complete();

        // Act
        item.Reopen();

        // Assert
        Assert.False(item.IsCompleted);
        Assert.Null(item.CompletedAt);
    }

    [Fact]
    public void Rename_WithValidTitle_UpdatesTitle()
    {
        // Arrange
        var item = new ChecklistItem(Guid.NewGuid(), "Old title");

        // Act
        item.Rename("New title");

        // Assert
        Assert.Equal("New title", item.Title);
    }
}