using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Scalar.AspNetCore;
using SprintQuest.Infrastructure;
using SprintQuest.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

const string ApiRateLimitPolicy = "ApiRateLimit";

var databaseConnectionString = builder.Configuration.GetConnectionString(
    "SprintQuestDatabase")
    ?? throw new InvalidOperationException(
        "Connection string 'SprintQuestDatabase' was not found.");

builder.Services.AddInfrastructure(databaseConnectionString!);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode =
        StatusCodes.Status429TooManyRequests;

    options.AddPolicy<string>(
        ApiRateLimitPolicy,
        httpContext =>
        {
            var partitionKey =
                httpContext.Connection.RemoteIpAddress?.ToString()
                ?? "unknown";

            return RateLimitPartition.GetFixedWindowLimiter(
                partitionKey,
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromSeconds(10),
                    QueueLimit = 0,
                    QueueProcessingOrder =
                        QueueProcessingOrder.OldestFirst,
                    AutoReplenishment = true
                });
        });
});

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("FrontendDev");

app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers()
    .RequireRateLimiting(ApiRateLimitPolicy);

app.MapHub<BoardHub>("/hubs/board");

app.Run();