using SprintQuest.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var databaseConnectionString = builder.Configuration.GetConnectionString(
    "SprintQuestDatabase")
    ?? throw new InvalidOperationException(
        "Connection string 'SprintQuestDatabase' was not found.");

builder.Services.AddInfrastructure(databaseConnectionString!);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();