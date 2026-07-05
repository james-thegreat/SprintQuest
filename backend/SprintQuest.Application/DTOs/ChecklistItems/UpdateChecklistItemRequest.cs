namespace SprintQuest.Application.DTOs.ChecklistItems;

public class UpdateChecklistItemRequest
{
    public string Title { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }
}