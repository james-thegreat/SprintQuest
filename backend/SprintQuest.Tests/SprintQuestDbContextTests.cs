using Microsoft.EntityFrameworkCore;
using SprintQuest.Domain.Entities;
using SprintQuest.Infrastructure.Persistence;

namespace SprintQuest.Tests;

public class SprintQuestDbContextTests
{
    [Fact]
    public void Model_IncludesCoreEntities()
    {
        using var context = CreateContext();

        Assert.NotNull(context.Model.FindEntityType(typeof(Project)));
        Assert.NotNull(context.Model.FindEntityType(typeof(Sprint)));
        Assert.NotNull(context.Model.FindEntityType(typeof(TaskItem)));
        Assert.NotNull(context.Model.FindEntityType(typeof(ChecklistItem)));
        Assert.NotNull(context.Model.FindEntityType(typeof(Achievement)));
        Assert.NotNull(context.Model.FindEntityType(typeof(XpEvent)));
    }

    [Fact]
    public void Model_ConfiguresImportantRequiredFieldsAndLengths()
    {
        using var context = CreateContext();

        var projectEntity = context.Model.FindEntityType(typeof(Project))!;
        var taskEntity = context.Model.FindEntityType(typeof(TaskItem))!;
        var achievementEntity = context.Model.FindEntityType(typeof(Achievement))!;

        var projectName = projectEntity.FindProperty(nameof(Project.Name))!;
        Assert.False(projectName.IsNullable);
        Assert.Equal(100, projectName.GetMaxLength());

        var taskTitle = taskEntity.FindProperty(nameof(TaskItem.Title))!;
        Assert.False(taskTitle.IsNullable);
        Assert.Equal(200, taskTitle.GetMaxLength());

        var taskStatus = taskEntity.FindProperty(nameof(TaskItem.Status))!;
        Assert.False(taskStatus.IsNullable);
        Assert.Equal(20, taskStatus.GetMaxLength());

        var taskPriority = taskEntity.FindProperty(nameof(TaskItem.Priority))!;
        Assert.False(taskPriority.IsNullable);
        Assert.Equal(20, taskPriority.GetMaxLength());

        var achievementName = achievementEntity.FindProperty(nameof(Achievement.Name))!;
        Assert.False(achievementName.IsNullable);
        Assert.Equal(100, achievementName.GetMaxLength());
    }

    [Fact]
    public void Model_ConfiguresCascadeRelationships()
    {
        using var context = CreateContext();

        AssertForeignKeyDeleteBehavior<Sprint>(
            context,
            nameof(Sprint.ProjectId),
            DeleteBehavior.Cascade);

        AssertForeignKeyDeleteBehavior<TaskItem>(
            context,
            nameof(TaskItem.SprintId),
            DeleteBehavior.Cascade);

        AssertForeignKeyDeleteBehavior<ChecklistItem>(
            context,
            nameof(ChecklistItem.TaskItemId),
            DeleteBehavior.Cascade);
    }

    private static SprintQuestDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SprintQuestDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;

        return new SprintQuestDbContext(options);
    }

    private static void AssertForeignKeyDeleteBehavior<TEntity>(
        SprintQuestDbContext context,
        string foreignKeyPropertyName,
        DeleteBehavior expectedDeleteBehavior)
    {
        var entityType = context.Model.FindEntityType(typeof(TEntity))!;

        var foreignKey = entityType.GetForeignKeys()
            .Single(foreignKey => foreignKey.Properties
                .Any(property => property.Name == foreignKeyPropertyName));

        Assert.Equal(expectedDeleteBehavior, foreignKey.DeleteBehavior);
    }
}