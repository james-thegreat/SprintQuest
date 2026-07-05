using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;
using SprintQuest.Domain.Enums;

namespace SprintQuest.Application.DTOs.TaskItems;

public class TaskItemDto
{
    public Guid Id { get; set; }

    public Guid SprintId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DomainTaskStatus Status { get; set; }

    public Priority Priority { get; set; }

    public int StoryPoints { get; set; }

    public int XpReward { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? CompletedAt { get; set; }
}