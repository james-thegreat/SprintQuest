using Microsoft.EntityFrameworkCore;
using SprintQuest.Application.DTOs.TaskItems;
using SprintQuest.Application.Interfaces;
using SprintQuest.Domain.Entities;
using SprintQuest.Infrastructure.Persistence;
using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;

namespace SprintQuest.Infrastructure.Services;

public class TaskItemService : ITaskItemService
{
    private readonly SprintQuestDbContext _context;

    public TaskItemService(SprintQuestDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskItemDto>> GetAllAsync()
    {
        return await _context.TaskItems
            .OrderBy(task => task.CreatedAt)
            .Select(task => new TaskItemDto
            {
                Id = task.Id,
                SprintId = task.SprintId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                StoryPoints = task.StoryPoints,
                XpReward = task.XpReward,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt
            })
            .ToListAsync();
    }

    public async Task<List<TaskItemDto>> GetBySprintIdAsync(Guid sprintId)
    {
        return await _context.TaskItems
            .Where(task => task.SprintId == sprintId)
            .OrderBy(task => task.CreatedAt)
            .Select(task => new TaskItemDto
            {
                Id = task.Id,
                SprintId = task.SprintId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                StoryPoints = task.StoryPoints,
                XpReward = task.XpReward,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt
            })
            .ToListAsync();
    }

    public async Task<TaskItemDto?> GetByIdAsync(Guid id)
    {
        return await _context.TaskItems
            .Where(task => task.Id == id)
            .Select(task => new TaskItemDto
            {
                Id = task.Id,
                SprintId = task.SprintId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                StoryPoints = task.StoryPoints,
                XpReward = task.XpReward,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TaskItemDto?> CreateAsync(CreateTaskItemRequest request)
    {
        var sprintExists = await _context.Sprints
            .AnyAsync(sprint => sprint.Id == request.SprintId);

        if (!sprintExists)
        {
            return null;
        }

        var task = new TaskItem(
            request.SprintId,
            request.Title,
            request.Description,
            request.Priority,
            request.StoryPoints,
            request.XpReward);

        _context.TaskItems.Add(task);
        await _context.SaveChangesAsync();

        return new TaskItemDto
        {
            Id = task.Id,
            SprintId = task.SprintId,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            StoryPoints = task.StoryPoints,
            XpReward = task.XpReward,
            CreatedAt = task.CreatedAt,
            CompletedAt = task.CompletedAt
        };
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateTaskItemRequest request)
    {
        var task = await _context.TaskItems.FindAsync(id);

        if (task is null)
        {
            return false;
        }


        task.UpdateDetails(
            request.Title,
            request.Description,
            request.Priority,
            request.StoryPoints,
            request.XpReward);

            if (request.Status == DomainTaskStatus.Done)
            {
                var xpEvent = task.CompleteForXp();

                if (xpEvent is not null)
                {
                    _context.XpEvents.Add(xpEvent);
                }
            }
            else
            {
                task.MoveToStatus(request.Status);
            }

            await _context.SaveChangesAsync();

            return true;

    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var task = await _context.TaskItems.FindAsync(id);

        if (task is null)
        {
            return false;
        }

        _context.TaskItems.Remove(task);
        await _context.SaveChangesAsync();

        return true;
    }
}