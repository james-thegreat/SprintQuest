using SprintQuest.Domain.Entities;

namespace SprintQuest.Tests;

public class ProjectTests
{
    [Fact]
    public void Constructor_WithValidName_CreatesProject()
    {
        // Arrange
        var name = "SprintQuest";

        // Act
        var project = new Project(name, "Gamified project board");

        // Assert
        Assert.NotEqual(Guid.Empty, project.Id);
        Assert.Equal("SprintQuest", project.Name);
        Assert.Equal("Gamified project board", project.Description);
        Assert.NotEqual(default, project.CreatedAt);
    }

    [Fact]
    public void Constructor_WithEmptyName_ThrowsArgumentException()
    {
        // Act + Assert
        Assert.Throws<ArgumentException>(() => new Project(""));
    }

    [Fact]
    public void Rename_WithValidName_UpdatesProjectName()
    {
        // Arrange
        var project = new Project("Old Name");

        // Act
        project.Rename("New Name");

        // Assert
        Assert.Equal("New Name", project.Name);
    }

    [Fact]
    public void Rename_WithEmptyName_ThrowsArgumentException()
    {
        // Arrange
        var project = new Project("SprintQuest");

        // Act + Assert
        Assert.Throws<ArgumentException>(() => project.Rename(""));
    }
}