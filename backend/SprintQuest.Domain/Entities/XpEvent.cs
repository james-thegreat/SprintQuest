namespace SprintQuest.Domain.Entities;

public class XpEvent
{
    public Guid Id { get; private set; }
    public int Amount { get; private set; }
    public string Reason { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public XpEvent(int amount, string reason)
    {
        if (amount <= 0)
        {
            throw new ArgumentException(
                "XP amount must be greater than zero.",
                nameof(amount));
        }

        if (string.IsNullOrWhiteSpace(reason))
        {
            throw new ArgumentException(
                "XP reason is required.",
                nameof(reason));
        }

        Id = Guid.NewGuid();
        Amount = amount;
        Reason = reason.Trim();
        CreatedAt = DateTime.UtcNow;
    }
}