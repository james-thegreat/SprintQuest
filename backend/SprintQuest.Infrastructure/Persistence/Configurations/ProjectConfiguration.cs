using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SprintQuest.Domain.Entities;

namespace SprintQuest.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasKey(project => project.Id);

        builder.Property(project => project.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(project => project.Description)
            .HasMaxLength(1000);

        builder.HasMany(project => project.Sprints)
            .WithOne()
            .HasForeignKey(sprint => sprint.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}