using Microsoft.EntityFrameworkCore;
using SprintQuest.Application.DTOs.ChecklistItems;
using SprintQuest.Application.Interfaces;
using SprintQuest.Domain.Entities;
using SprintQuest.Infrastructure.Persistence;

namespace SprintQuest.Infrastructure.Services;

public class ChecklistItemService : IChecklistItemService
{
    private readonly SprintQuestDbContext _context;

    public ChecklistItemService(SprintQuestDbContext context)
    {
        _context = context;
    }

    public async Task<List<ChecklistItemDto>> GetAllAsync()
    {
        return await _context.ChecklistItems
            .OrderBy(item => item.CreatedAt)
            .Select(item => new ChecklistItemDto
            {
                Id = item.Id,
                TaskItemId = item.TaskItemId,
                Title = item.Title,
                IsCompleted = item.IsCompleted,
                CreatedAt = item.CreatedAt,
                CompletedAt = item.CompletedAt
            })
            .ToListAsync();
    }

    public async Task<List<ChecklistItemDto>> GetByTaskItemIdAsync(Guid taskItemId)
    {
        return await _context.ChecklistItems
            .Where(item => item.TaskItemId == taskItemId)
            .OrderBy(item => item.CreatedAt)
            .Select(item => new ChecklistItemDto
            {
                Id = item.Id,
                TaskItemId = item.TaskItemId,
                Title = item.Title,
                IsCompleted = item.IsCompleted,
                CreatedAt = item.CreatedAt,
                CompletedAt = item.CompletedAt
            })
            .ToListAsync();
    }

    public async Task<ChecklistItemDto?> GetByIdAsync(Guid id)
    {
        return await _context.ChecklistItems
            .Where(item => item.Id == id)
            .Select(item => new ChecklistItemDto
            {
                Id = item.Id,
                TaskItemId = item.TaskItemId,
                Title = item.Title,
                IsCompleted = item.IsCompleted,
                CreatedAt = item.CreatedAt,
                CompletedAt = item.CompletedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ChecklistItemDto?> CreateAsync(CreateChecklistItemRequest request)
    {
        var taskExists = await _context.TaskItems
            .AnyAsync(task => task.Id == request.TaskItemId);

        if (!taskExists)
        {
            return null;
        }

        var checklistItem = new ChecklistItem(request.TaskItemId, request.Title);

        _context.ChecklistItems.Add(checklistItem);
        await _context.SaveChangesAsync();

        return new ChecklistItemDto
        {
            Id = checklistItem.Id,
            TaskItemId = checklistItem.TaskItemId,
            Title = checklistItem.Title,
            IsCompleted = checklistItem.IsCompleted,
            CreatedAt = checklistItem.CreatedAt,
            CompletedAt = checklistItem.CompletedAt
        };
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateChecklistItemRequest request)
    {
        var checklistItem = await _context.ChecklistItems.FindAsync(id);

        if (checklistItem is null)
        {
            return false;
        }

        checklistItem.Rename(request.Title);

        if (request.IsCompleted)
        {
            checklistItem.Complete();
        }
        else
        {
            checklistItem.Reopen();
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var checklistItem = await _context.ChecklistItems.FindAsync(id);

        if (checklistItem is null)
        {
            return false;
        }

        _context.ChecklistItems.Remove(checklistItem);
        await _context.SaveChangesAsync();

        return true;
    }
}