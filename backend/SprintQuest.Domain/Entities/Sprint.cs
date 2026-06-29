namespace SprintQuest.Domain.Entities;

public class Sprint
{
    public Guid Id { get; private set; }
    public Guid ProjectId { get; private set; }
    public string Name { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Sprint(Guid projectId, string name, DateTime startDate, DateTime endDate)
    {
        if (projectId == Guid.Empty)
        {
            throw new ArgumentException("Project id is required.", nameof(projectId));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Sprint name is required.", nameof(name));
        }

        if (endDate < startDate)
        {
            throw new ArgumentException("Sprint end date cannot be before start date.", nameof(endDate));
        }

        Id = Guid.NewGuid();
        ProjectId = projectId;
        Name = name.Trim();
        StartDate = startDate;
        EndDate = endDate;
        CreatedAt = DateTime.UtcNow;
    }

    public void Rename(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
        {
            throw new ArgumentException("Sprint name is required.", nameof(newName));
        }

        Name = newName.Trim();
    }

    public void UpdateDates(DateTime startDate, DateTime endDate)
    {
        if (endDate < startDate)
        {
            throw new ArgumentException("Sprint end date cannot be before start date.", nameof(endDate));
        }

        StartDate = startDate;
        EndDate = endDate;
    }
}