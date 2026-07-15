using SprintQuest.Application.DTOs.TaskItems;

namespace SprintQuest.Application.Interfaces;

public interface ITaskItemService
{
    Task<List<TaskItemDto>> GetAllAsync();

    Task<List<TaskItemDto>> GetBySprintIdAsync(Guid sprintId);

    Task<TaskItemDto?> GetByIdAsync(Guid id);

    Task<TaskItemDto?> CreateAsync(CreateTaskItemRequest request);

    Task<TaskItemDto?> UpdateAsync(
    Guid id,
    UpdateTaskItemRequest request);

    Task<bool> DeleteAsync(Guid id);
}