using SprintQuest.Application.DTOs.ChecklistItems;

namespace SprintQuest.Application.Interfaces;

public interface IChecklistItemService
{
    Task<List<ChecklistItemDto>> GetAllAsync();

    Task<List<ChecklistItemDto>> GetByTaskItemIdAsync(Guid taskItemId);

    Task<ChecklistItemDto?> GetByIdAsync(Guid id);

    Task<ChecklistItemDto?> CreateAsync(CreateChecklistItemRequest request);

    Task<bool> UpdateAsync(Guid id, UpdateChecklistItemRequest request);

    Task<bool> DeleteAsync(Guid id);
}