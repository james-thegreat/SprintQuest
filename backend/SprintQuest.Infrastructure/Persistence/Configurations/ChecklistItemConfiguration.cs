using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SprintQuest.Domain.Entities;

namespace SprintQuest.Infrastructure.Persistence.Configurations;

public class ChecklistItemConfiguration
    : IEntityTypeConfiguration<ChecklistItem>
{
    public void Configure(EntityTypeBuilder<ChecklistItem> builder)
    {
        builder.HasKey(item => item.Id);

        builder.Property(item => item.TaskItemId)
            .IsRequired();

        builder.Property(item => item.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(item => item.IsCompleted)
            .IsRequired();
    }
}