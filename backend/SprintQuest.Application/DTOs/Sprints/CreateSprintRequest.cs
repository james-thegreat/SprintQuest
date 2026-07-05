namespace SprintQuest.Application.DTOs.Sprints;

public class CreateSprintRequest
{
    public Guid ProjectId { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
}