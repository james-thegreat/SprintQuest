using SprintQuest.Domain.Enums;

namespace SprintQuest.Application.DTOs.TaskItems;

public class CreateTaskItemRequest
{
    public Guid SprintId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Priority Priority { get; set; } = Priority.Medium;

    public int StoryPoints { get; set; } = 1;

    public int XpReward { get; set; } = 10;
}