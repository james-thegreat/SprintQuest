using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SprintQuest.Infrastructure.Persistence;
using SprintQuest.Application.Interfaces;
using SprintQuest.Infrastructure.Services;

namespace SprintQuest.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new ArgumentException(
                "Database connection string is required.",
                nameof(connectionString));
        }

        services.AddScoped<IProjectService, ProjectService>();

        services.AddDbContext<SprintQuestDbContext>(options =>
            options.UseSqlite(connectionString));

        return services;
    }
}