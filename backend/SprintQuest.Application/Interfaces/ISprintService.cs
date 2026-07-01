using SprintQuest.Application.DTOs.Sprints;

namespace SprintQuest.Application.Interfaces;

public interface ISprintService
{
    Task<List<SprintDto>> GetAllAsync();

    Task<List<SprintDto>> GetByProjectIdAsync(Guid projectId);

    Task<SprintDto?> GetByIdAsync(Guid id);

    Task<SprintDto?> CreateAsync(CreateSprintRequest request);

    Task<bool> UpdateAsync(Guid id, UpdateSprintRequest request);

    Task<bool> DeleteAsync(Guid id);
}