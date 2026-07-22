using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SprintQuest.Infrastructure.Persistence;

namespace SprintQuest.Tests.Infrastructure;

public sealed class SqliteTestDatabase : IDisposable
{
    private readonly SqliteConnection _connection;

    public SprintQuestDbContext Context { get; }

    public SqliteTestDatabase()
    {
        _connection = new SqliteConnection(
            "Data Source=:memory:;Foreign Keys=True");

        _connection.Open();

        var options =
            new DbContextOptionsBuilder<SprintQuestDbContext>()
                .UseSqlite(_connection)
                .Options;

        Context = new SprintQuestDbContext(options);
        Context.Database.EnsureCreated();
    }

    public void Dispose()
    {
        Context.Dispose();
        _connection.Dispose();
    }
}
