using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.Validation;
using SprintQuest.Domain.Enums;

namespace SprintQuest.Application.DTOs.TaskItems;

public class CreateTaskItemRequest
{
    [NotEmptyGuid(ErrorMessage = "Sprint id is required.")]
    public Guid SprintId { get; set; }

    [NotWhiteSpace(ErrorMessage = "Task title is required.")]
    [StringLength(
        150,
        ErrorMessage = "Task title cannot exceed 150 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(
        2000,
        ErrorMessage = "Task description cannot exceed 2000 characters.")]
    public string? Description { get; set; }

    [EnumDataType(
        typeof(Priority),
        ErrorMessage = "Task priority is invalid.")]
    public Priority Priority { get; set; } = Priority.Medium;

    [Range(
        0,
        100,
        ErrorMessage = "Story points must be between 0 and 100.")]
    public int StoryPoints { get; set; } = 1;

    [Range(
        0,
        10000,
        ErrorMessage = "XP reward must be between 0 and 10000.")]
    public int XpReward { get; set; } = 10;
}