namespace SprintQuest.Application.DTOs.Gamification;

public class GamificationSummaryDto
{
    public int TotalXp { get; set; }
    public int XpEventCount { get; set; }
    public int CompletedTaskCount { get; set; }
    public List<UnlockedAchievementDto> UnlockedAchievements { get; set; } = [];
}

public class UnlockedAchievementDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BadgeKey { get; set; } = string.Empty;
}