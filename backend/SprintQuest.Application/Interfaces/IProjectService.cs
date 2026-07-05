using SprintQuest.Application.DTOs.Projects;

namespace SprintQuest.Application.Interfaces;

public interface IProjectService
{
    Task<List<ProjectDto>> GetAllAsync();

    Task<ProjectDto?> GetByIdAsync(Guid id);

    Task<ProjectDto> CreateAsync(CreateProjectRequest request);

    Task<bool> UpdateAsync(Guid id, UpdateProjectRequest request);

    Task<bool> DeleteAsync(Guid id);
}