using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.Validation;

namespace SprintQuest.Application.DTOs.Projects;

public class UpdateProjectRequest
{
    [NotWhiteSpace(ErrorMessage = "Project name is required.")]
    [StringLength(
        100,
        ErrorMessage = "Project name cannot exceed 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(
        1000,
        ErrorMessage = "Project description cannot exceed 1000 characters.")]
    public string? Description { get; set; }
}