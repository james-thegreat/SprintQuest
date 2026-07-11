using Microsoft.EntityFrameworkCore;
using SprintQuest.Application.DTOs.Gamification;
using SprintQuest.Application.Interfaces;
using SprintQuest.Infrastructure.Persistence;

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

        return new GamificationSummaryDto
        {
            TotalXp = totalXp,
            XpEventCount = xpEventCount
        };
    }
}