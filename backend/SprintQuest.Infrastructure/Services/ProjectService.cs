using Microsoft.EntityFrameworkCore;
using SprintQuest.Application.DTOs.Projects;
using SprintQuest.Application.Interfaces;
using SprintQuest.Domain.Entities;
using SprintQuest.Infrastructure.Persistence;

namespace SprintQuest.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly SprintQuestDbContext _context;

    public ProjectService(SprintQuestDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        return await _context.Projects
            .OrderBy(project => project.CreatedAt)
            .Select(project => new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ProjectDto?> GetByIdAsync(Guid id)
    {
        return await _context.Projects
            .Where(project => project.Id == id)
            .Select(project => new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectRequest request)
    {
        var project = new Project(request.Name, request.Description);

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateProjectRequest request)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project is null)
        {
            return false;
        }

        project.UpdateDetails(request.Name, request.Description);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project is null)
        {
            return false;
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return true;
    }
}