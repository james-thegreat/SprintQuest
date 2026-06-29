using Microsoft.EntityFrameworkCore;
using SprintQuest.Domain.Entities;

namespace SprintQuest.Infrastructure.Persistence;

public class SprintQuestDbContext : DbContext
{
    public SprintQuestDbContext(
        DbContextOptions<SprintQuestDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Sprint> Sprints => Set<Sprint>();
    public DbSet<TaskItem> TaskItems => Set<TaskItem>();
    public DbSet<ChecklistItem> ChecklistItems => Set<ChecklistItem>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<XpEvent> XpEvents => Set<XpEvent>();
}