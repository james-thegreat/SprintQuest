using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.Validation;

namespace SprintQuest.Application.DTOs.ChecklistItems;

public class CreateChecklistItemRequest
{
    [NotEmptyGuid(ErrorMessage = "Task item id is required.")]
    public Guid TaskItemId { get; set; }

    [NotWhiteSpace(ErrorMessage = "Checklist item title is required.")]
    [StringLength(
        200,
        ErrorMessage =
            "Checklist item title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;
}