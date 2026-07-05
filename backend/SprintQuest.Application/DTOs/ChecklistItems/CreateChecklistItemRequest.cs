namespace SprintQuest.Application.DTOs.ChecklistItems;

public class CreateChecklistItemRequest
{
    public Guid TaskItemId { get; set; }

    public string Title { get; set; } = string.Empty;
}