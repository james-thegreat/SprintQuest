using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Scalar.AspNetCore;
using SprintQuest.Infrastructure;
using SprintQuest.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

const string ApiRateLimitPolicy = "ApiRateLimit";
const string FrontendCorsPolicy = "FrontendCors";

var databaseConnectionString = builder.Configuration.GetConnectionString(
    "SprintQuestDatabase")
    ?? throw new InvalidOperationException(
        "Connection string 'SprintQuestDatabase' was not found.");

var allowedOrigins =
    builder.Configuration
        .GetSection("AllowedOrigins")
        .Get<string[]>()
    ?? throw new InvalidOperationException(
        "At least one allowed frontend origin must be configured.");

builder.Services.AddInfrastructure(databaseConnectionString!);

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
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

app.UseCors(FrontendCorsPolicy);

app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers()
    .RequireRateLimiting(ApiRateLimitPolicy);

app.MapHub<BoardHub>("/hubs/board");

app.Run();