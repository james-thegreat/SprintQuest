using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.Validation;

namespace SprintQuest.Application.DTOs.Sprints;

public class CreateSprintRequest : IValidatableObject
{
    [NotEmptyGuid(ErrorMessage = "Project id is required.")]
    public Guid ProjectId { get; set; }

    [NotWhiteSpace(ErrorMessage = "Sprint name is required.")]
    [StringLength(
        100,
        ErrorMessage = "Sprint name cannot exceed 100 characters.")]
    public string Name { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public IEnumerable<ValidationResult> Validate(
        ValidationContext validationContext)
    {
        if (StartDate == default)
        {
            yield return new ValidationResult(
                "Sprint start date is required.",
                [nameof(StartDate)]);
        }

        if (EndDate == default)
        {
            yield return new ValidationResult(
                "Sprint end date is required.",
                [nameof(EndDate)]);
        }

        if (StartDate != default &&
            EndDate != default &&
            EndDate < StartDate)
        {
            yield return new ValidationResult(
                "Sprint end date cannot be before start date.",
                [nameof(EndDate)]);
        }
    }
}