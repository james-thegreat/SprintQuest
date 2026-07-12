using Microsoft.EntityFrameworkCore;
using SprintQuest.Application.DTOs.Gamification;
using SprintQuest.Application.Interfaces;
using SprintQuest.Infrastructure.Persistence;
using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;
using SprintQuest.Domain.Gamification;

namespace SprintQuest.Infrastructure.Services;

public class GamificationService : IGamificationService
{
    private readonly SprintQuestDbContext _context;

    public GamificationService(SprintQuestDbContext context)
    {
        _context = context;
    }

    public async Task<GamificationSummaryDto> GetSummaryAsync()
    {
        var totalXp = await _context.XpEvents
            .SumAsync(xpEvent => xpEvent.Amount);

        var xpEventCount = await _context.XpEvents
            .CountAsync();

        var completedTaskCount = await _context.TaskItems
            .CountAsync(task => task.Status == DomainTaskStatus.Done);

        var unlockedAchievements = AchievementRules.GetUnlockedAchievements(
            completedTaskCount,
            totalXp);

        return new GamificationSummaryDto
        {
            TotalXp = totalXp,
            XpEventCount = xpEventCount,
            CompletedTaskCount = completedTaskCount,
            UnlockedAchievements = unlockedAchievements
                .Select(achievement => new UnlockedAchievementDto
                {
                    Name = achievement.Name,
                    Description = achievement.Description,
                    BadgeKey = achievement.BadgeKey
                })
                .ToList()
        };
    }
}