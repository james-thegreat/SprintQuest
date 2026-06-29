namespace SprintQuest.Domain.Entities;

public class Achievement
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string BadgeKey { get; private set; }
    public int RequiredXp { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Achievement(
        string name,
        string description,
        string badgeKey,
        int requiredXp)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Achievement name is required.",
                nameof(name));
        }

        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException(
                "Achievement description is required.",
                nameof(description));
        }

        if (string.IsNullOrWhiteSpace(badgeKey))
        {
            throw new ArgumentException(
                "Badge key is required.",
                nameof(badgeKey));
        }

        if (requiredXp < 0)
        {
            throw new ArgumentException(
                "Required XP cannot be negative.",
                nameof(requiredXp));
        }

        Id = Guid.NewGuid();
        Name = name.Trim();
        Description = description.Trim();
        BadgeKey = badgeKey.Trim();
        RequiredXp = requiredXp;
        CreatedAt = DateTime.UtcNow;
    }
}