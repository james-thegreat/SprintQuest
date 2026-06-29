namespace SprintQuest.Domain.Entities;

public class ChecklistItem
{
    public Guid Id { get; private set; }
    public Guid TaskItemId { get; private set; }
    public string Title { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    public ChecklistItem(Guid taskItemId, string title)
    {
        if (taskItemId == Guid.Empty)
        {
            throw new ArgumentException("Task item id is required.", nameof(taskItemId));
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Checklist item title is required.", nameof(title));
        }

        Id = Guid.NewGuid();
        TaskItemId = taskItemId;
        Title = title.Trim();
        IsCompleted = false;
        CreatedAt = DateTime.UtcNow;
    }

    public void Rename(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
        {
            throw new ArgumentException("Checklist item title is required.", nameof(newTitle));
        }

        Title = newTitle.Trim();
    }

    public void Complete()
    {
        IsCompleted = true;
        CompletedAt ??= DateTime.UtcNow;
    }

    public void Reopen()
    {
        IsCompleted = false;
        CompletedAt = null;
    }
}