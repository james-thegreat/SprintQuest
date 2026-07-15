using Microsoft.AspNetCore.Mvc;
using SprintQuest.Application.DTOs.ChecklistItems;
using SprintQuest.Application.Interfaces;

namespace SprintQuest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChecklistItemsController : ControllerBase
{
    private readonly IChecklistItemService _checklistItemService;

    public ChecklistItemsController(IChecklistItemService checklistItemService)
    {
        _checklistItemService = checklistItemService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ChecklistItemDto>>> GetAll()
    {
        var checklistItems = await _checklistItemService.GetAllAsync();

        return Ok(checklistItems);
    }

    [HttpGet("task/{taskItemId:guid}")]
    public async Task<ActionResult<List<ChecklistItemDto>>> GetByTaskItemId(Guid taskItemId)
    {
        var checklistItems = await _checklistItemService.GetByTaskItemIdAsync(taskItemId);

        return Ok(checklistItems);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ChecklistItemDto>> GetById(Guid id)
    {
        var checklistItem = await _checklistItemService.GetByIdAsync(id);

        if (checklistItem is null)
        {
            return NotFound();
        }

        return Ok(checklistItem);
    }

    [HttpPost]
    public async Task<ActionResult<ChecklistItemDto>> Create(
        CreateChecklistItemRequest request)
    {
        var checklistItem =
            await _checklistItemService.CreateAsync(request);

        if (checklistItem is null)
        {
            return NotFound("Task item not found.");
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = checklistItem.Id },
            checklistItem);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateChecklistItemRequest request)
    {
        var updated =
            await _checklistItemService.UpdateAsync(id, request);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _checklistItemService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}