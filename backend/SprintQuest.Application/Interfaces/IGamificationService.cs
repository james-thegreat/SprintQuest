using SprintQuest.Application.DTOs.Gamification;

namespace SprintQuest.Application.Interfaces;

public interface IGamificationService
{
    Task<GamificationSummaryDto> GetSummaryAsync();
}