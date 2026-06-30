using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SprintQuest.Domain.Entities;

namespace SprintQuest.Infrastructure.Persistence.Configurations;

public class AchievementConfiguration
    : IEntityTypeConfiguration<Achievement>
{
    public void Configure(EntityTypeBuilder<Achievement> builder)
    {
        builder.HasKey(achievement => achievement.Id);

        builder.Property(achievement => achievement.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(achievement => achievement.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(achievement => achievement.BadgeKey)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(achievement => achievement.RequiredXp)
            .IsRequired();
    }
}