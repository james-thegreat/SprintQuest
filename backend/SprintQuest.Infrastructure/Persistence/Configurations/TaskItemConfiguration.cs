using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SprintQuest.Domain.Entities;

namespace SprintQuest.Infrastructure.Persistence.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.HasKey(task => task.Id);

        builder.Property(task => task.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(task => task.Description)
            .HasMaxLength(2000);

        builder.Property(task => task.Status)
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(task => task.Priority)
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(task => task.StoryPoints)
            .IsRequired();

        builder.Property(task => task.XpReward)
            .IsRequired();

        builder.HasMany(task => task.ChecklistItems)
            .WithOne()
            .HasForeignKey(item => item.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}