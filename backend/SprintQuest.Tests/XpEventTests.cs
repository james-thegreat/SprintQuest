using SprintQuest.Domain.Entities;

namespace SprintQuest.Tests;

public class XpEventTests
{
    [Fact]
    public void Constructor_WithValidData_CreatesXpEvent()
    {
        // Act
        var xpEvent = new XpEvent(25, "Completed a task");

        // Assert
        Assert.NotEqual(Guid.Empty, xpEvent.Id);
        Assert.Equal(25, xpEvent.Amount);
        Assert.Equal("Completed a task", xpEvent.Reason);
        Assert.NotEqual(default, xpEvent.CreatedAt);
    }

    [Fact]
    public void Constructor_WithZeroAmount_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            new XpEvent(0, "Completed a task"));
    }

    [Fact]
    public void Constructor_WithNegativeAmount_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            new XpEvent(-10, "Invalid award"));
    }

    [Fact]
    public void Constructor_WithEmptyReason_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            new XpEvent(25, ""));
    }
}