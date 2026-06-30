using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SprintQuest.Domain.Entities;

namespace SprintQuest.Infrastructure.Persistence.Configurations;

public class SprintConfiguration : IEntityTypeConfiguration<Sprint>
{
    public void Configure(EntityTypeBuilder<Sprint> builder)
    {
        builder.HasKey(sprint => sprint.Id);

        builder.Property(sprint => sprint.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(sprint => sprint.StartDate)
            .IsRequired();

        builder.Property(sprint => sprint.EndDate)
            .IsRequired();

        builder.HasMany<TaskItem>()
            .WithOne()
            .HasForeignKey(task => task.SprintId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}