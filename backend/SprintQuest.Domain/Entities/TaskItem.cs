using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;
using SprintQuest.Domain.Enums;

namespace SprintQuest.Domain.Entities;

public class TaskItem
{
    private readonly List<ChecklistItem> _checklistItems = new();
    
    public Guid Id { get; private set; }
    public Guid SprintId { get; private set; }
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public DomainTaskStatus Status { get; private set; }
    public Priority Priority { get; private set; }
    public int StoryPoints { get; private set; }
    public int XpReward { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public IReadOnlyCollection<ChecklistItem> ChecklistItems => _checklistItems.AsReadOnly();

    public TaskItem(
        Guid sprintId,
        string title,
        string? description = null,
        Priority priority = Priority.Medium,
        int storyPoints = 1,
        int xpReward = 10)
    {
        if (sprintId == Guid.Empty)
        {
            throw new ArgumentException("Sprint id is required.", nameof(sprintId));
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Task title is required.", nameof(title));
        }

        if (storyPoints < 0)
        {
            throw new ArgumentException("Story points cannot be negative.", nameof(storyPoints));
        }

        if (xpReward < 0)
        {
            throw new ArgumentException("XP reward cannot be negative.", nameof(xpReward));
        }

        Id = Guid.NewGuid();
        SprintId = sprintId;
        Title = title.Trim();
        Description = description?.Trim();
        Status = DomainTaskStatus.Backlog;
        Priority = priority;
        StoryPoints = storyPoints;
        XpReward = xpReward;
        CreatedAt = DateTime.UtcNow;
    }

    public void Rename(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
        {
            throw new ArgumentException("Task title is required.", nameof(newTitle));
        }

        Title = newTitle.Trim();
    }

    public void UpdateDescription(string? description)
    {
        Description = description?.Trim();
    }

    public void MoveToStatus(DomainTaskStatus newStatus)
    {
        Status = newStatus;

        if (newStatus == DomainTaskStatus.Done)
        {
            CompletedAt ??= DateTime.UtcNow;
        }
        else
        {
            CompletedAt = null;
        }
    }

    public void Complete()
    {
        MoveToStatus(DomainTaskStatus.Done);
    }

    public void Reopen()
    {
        MoveToStatus(DomainTaskStatus.ToDo);
    }

    public ChecklistItem AddChecklistItem(string title)
    {
        var checklistItem = new ChecklistItem(Id, title);

        _checklistItems.Add(checklistItem);

        return checklistItem;
    }
}