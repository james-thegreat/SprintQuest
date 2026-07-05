using Microsoft.AspNetCore.Mvc;
using SprintQuest.Application.DTOs.TaskItems;
using SprintQuest.Application.Interfaces;

namespace SprintQuest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskItemsController : ControllerBase
{
    private readonly ITaskItemService _taskItemService;

    public TaskItemsController(ITaskItemService taskItemService)
    {
        _taskItemService = taskItemService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskItemDto>>> GetAll()
    {
        var tasks = await _taskItemService.GetAllAsync();

        return Ok(tasks);
    }

    [HttpGet("sprint/{sprintId:guid}")]
    public async Task<ActionResult<List<TaskItemDto>>> GetBySprintId(Guid sprintId)
    {
        var tasks = await _taskItemService.GetBySprintIdAsync(sprintId);

        return Ok(tasks);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskItemDto>> GetById(Guid id)
    {
        var task = await _taskItemService.GetByIdAsync(id);

        if (task is null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItemDto>> Create(CreateTaskItemRequest request)
    {
        if (request.SprintId == Guid.Empty)
        {
            return BadRequest("Sprint id is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest("Task title is required.");
        }

        if (request.StoryPoints < 0)
        {
            return BadRequest("Story points cannot be negative.");
        }

        if (request.XpReward < 0)
        {
            return BadRequest("XP reward cannot be negative.");
        }

        var task = await _taskItemService.CreateAsync(request);

        if (task is null)
        {
            return NotFound("Sprint not found.");
        }

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateTaskItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest("Task title is required.");
        }

        if (request.StoryPoints < 0)
        {
            return BadRequest("Story points cannot be negative.");
        }

        if (request.XpReward < 0)
        {
            return BadRequest("XP reward cannot be negative.");
        }

        var updated = await _taskItemService.UpdateAsync(id, request);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _taskItemService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}