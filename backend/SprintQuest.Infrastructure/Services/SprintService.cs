using Microsoft.EntityFrameworkCore;
using SprintQuest.Application.DTOs.Sprints;
using SprintQuest.Application.Interfaces;
using SprintQuest.Domain.Entities;
using SprintQuest.Infrastructure.Persistence;

namespace SprintQuest.Infrastructure.Services;

public class SprintService : ISprintService
{
    private readonly SprintQuestDbContext _context;

    public SprintService(SprintQuestDbContext context)
    {
        _context = context;
    }

    public async Task<List<SprintDto>> GetAllAsync()
    {
        return await _context.Sprints
            .OrderBy(sprint => sprint.StartDate)
            .Select(sprint => new SprintDto
            {
                Id = sprint.Id,
                ProjectId = sprint.ProjectId,
                Name = sprint.Name,
                StartDate = sprint.StartDate,
                EndDate = sprint.EndDate,
                CreatedAt = sprint.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<SprintDto>> GetByProjectIdAsync(Guid projectId)
    {
        return await _context.Sprints
            .Where(sprint => sprint.ProjectId == projectId)
            .OrderBy(sprint => sprint.StartDate)
            .Select(sprint => new SprintDto
            {
                Id = sprint.Id,
                ProjectId = sprint.ProjectId,
                Name = sprint.Name,
                StartDate = sprint.StartDate,
                EndDate = sprint.EndDate,
                CreatedAt = sprint.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<SprintDto?> GetByIdAsync(Guid id)
    {
        return await _context.Sprints
            .Where(sprint => sprint.Id == id)
            .Select(sprint => new SprintDto
            {
                Id = sprint.Id,
                ProjectId = sprint.ProjectId,
                Name = sprint.Name,
                StartDate = sprint.StartDate,
                EndDate = sprint.EndDate,
                CreatedAt = sprint.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<SprintDto?> CreateAsync(CreateSprintRequest request)
    {
        var projectExists = await _context.Projects
            .AnyAsync(project => project.Id == request.ProjectId);

        if (!projectExists)
        {
            return null;
        }

        var sprint = new Sprint(
            request.ProjectId,
            request.Name,
            request.StartDate,
            request.EndDate);

        _context.Sprints.Add(sprint);
        await _context.SaveChangesAsync();

        return new SprintDto
        {
            Id = sprint.Id,
            ProjectId = sprint.ProjectId,
            Name = sprint.Name,
            StartDate = sprint.StartDate,
            EndDate = sprint.EndDate,
            CreatedAt = sprint.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateSprintRequest request)
    {
        var sprint = await _context.Sprints.FindAsync(id);

        if (sprint is null)
        {
            return false;
        }

        sprint.Rename(request.Name);
        sprint.UpdateDates(request.StartDate, request.EndDate);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var sprint = await _context.Sprints.FindAsync(id);

        if (sprint is null)
        {
            return false;
        }

        _context.Sprints.Remove(sprint);
        await _context.SaveChangesAsync();

        return true;
    }
}