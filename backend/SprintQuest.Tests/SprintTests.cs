using SprintQuest.Domain.Entities;
using Xunit;

namespace SprintQuest.Tests;

public class SprintTests
{
    [Fact]
    public void Constructor_WithValidData_CreatesSprint()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var startDate = new DateTime(2026, 7, 1);
        var endDate = new DateTime(2026, 7, 14);

        // Act
        var sprint = new Sprint(projectId, "M2 - Core Domain Models", startDate, endDate);

        // Assert
        Assert.NotEqual(Guid.Empty, sprint.Id);
        Assert.Equal(projectId, sprint.ProjectId);
        Assert.Equal("M2 - Core Domain Models", sprint.Name);
        Assert.Equal(startDate, sprint.StartDate);
        Assert.Equal(endDate, sprint.EndDate);
        Assert.NotEqual(default, sprint.CreatedAt);
    }

    [Fact]
    public void Constructor_WithEmptyProjectId_ThrowsArgumentException()
    {
        // Arrange
        var startDate = new DateTime(2026, 7, 1);
        var endDate = new DateTime(2026, 7, 14);

        // Act + Assert
        Assert.Throws<ArgumentException>(() =>
            new Sprint(Guid.Empty, "M2 - Core Domain Models", startDate, endDate));
    }

    [Fact]
    public void Constructor_WithEmptyName_ThrowsArgumentException()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var startDate = new DateTime(2026, 7, 1);
        var endDate = new DateTime(2026, 7, 14);

        // Act + Assert
        Assert.Throws<ArgumentException>(() =>
            new Sprint(projectId, "", startDate, endDate));
    }

    [Fact]
    public void Constructor_WithEndDateBeforeStartDate_ThrowsArgumentException()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var startDate = new DateTime(2026, 7, 14);
        var endDate = new DateTime(2026, 7, 1);

        // Act + Assert
        Assert.Throws<ArgumentException>(() =>
            new Sprint(projectId, "Invalid Sprint", startDate, endDate));
    }

    [Fact]
    public void Rename_WithValidName_UpdatesSprintName()
    {
        // Arrange
        var sprint = new Sprint(
            Guid.NewGuid(),
            "Old Sprint Name",
            new DateTime(2026, 7, 1),
            new DateTime(2026, 7, 14));

        // Act
        sprint.Rename("New Sprint Name");

        // Assert
        Assert.Equal("New Sprint Name", sprint.Name);
    }

    [Fact]
    public void UpdateDates_WithValidDates_UpdatesSprintDates()
    {
        // Arrange
        var sprint = new Sprint(
            Guid.NewGuid(),
            "M2",
            new DateTime(2026, 7, 1),
            new DateTime(2026, 7, 14));

        var newStartDate = new DateTime(2026, 7, 15);
        var newEndDate = new DateTime(2026, 7, 28);

        // Act
        sprint.UpdateDates(newStartDate, newEndDate);

        // Assert
        Assert.Equal(newStartDate, sprint.StartDate);
        Assert.Equal(newEndDate, sprint.EndDate);
    }
}