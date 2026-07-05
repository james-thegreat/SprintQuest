namespace SprintQuest.Domain.Entities;

public class Project
{
    private readonly List<Sprint> _sprints = new();

    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public IReadOnlyCollection<Sprint> Sprints => _sprints.AsReadOnly();

    public Project(string name, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Project name is required.", nameof(name));
        }

        Id = Guid.NewGuid();
        Name = name.Trim();
        Description = description?.Trim();
        CreatedAt = DateTime.UtcNow;
    }

    public void Rename(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
        {
            throw new ArgumentException("Project name is required.", nameof(newName));
        }

        Name = newName.Trim();
    }

    public void UpdateDescription(string? description)
    {
        Description = description?.Trim();
    }

    public Sprint AddSprint(string name, DateTime startDate, DateTime endDate)
    {
        var sprint = new Sprint(Id, name, startDate, endDate);

        _sprints.Add(sprint);

        return sprint;
    }

    public void UpdateDetails(string name, string? description)
{
    if (string.IsNullOrWhiteSpace(name))
    {
        throw new ArgumentException("Project name is required.", nameof(name));
    }

    Name = name.Trim();
    Description = string.IsNullOrWhiteSpace(description)
        ? null
        : description.Trim();
}
}