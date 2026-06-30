using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SprintQuest.Domain.Entities;

namespace SprintQuest.Infrastructure.Persistence.Configurations;

public class XpEventConfiguration : IEntityTypeConfiguration<XpEvent>
{
    public void Configure(EntityTypeBuilder<XpEvent> builder)
    {
        builder.HasKey(xpEvent => xpEvent.Id);

        builder.Property(xpEvent => xpEvent.Amount)
            .IsRequired();

        builder.Property(xpEvent => xpEvent.Reason)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(xpEvent => xpEvent.CreatedAt)
            .IsRequired();
    }
}