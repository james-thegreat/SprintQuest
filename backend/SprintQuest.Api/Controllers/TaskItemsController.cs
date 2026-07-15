using Microsoft.AspNetCore.Mvc;
using SprintQuest.Application.DTOs.TaskItems;
using SprintQuest.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using SprintQuest.Api.Hubs;

namespace SprintQuest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskItemsController : ControllerBase
{
    private readonly ITaskItemService _taskItemService;
    private readonly IHubContext<BoardHub> _boardHubContext;

    public TaskItemsController(
        ITaskItemService taskItemService,
        IHubContext<BoardHub> boardHubContext)
    {
        _taskItemService = taskItemService;
        _boardHubContext = boardHubContext;
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
    public async Task<ActionResult<TaskItemDto>> Create(
        CreateTaskItemRequest request)
    {
        var task = await _taskItemService.CreateAsync(request);

        if (task is null)
        {
            return NotFound("Sprint not found.");
        }

        await _boardHubContext.Clients.All.SendAsync(
            "TaskCreated",
            task);

        return CreatedAtAction(
            nameof(GetById),
            new { id = task.Id },
            task);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskItemDto>> Update(
        Guid id,
        UpdateTaskItemRequest request)
    {
        var updatedTask = await _taskItemService.UpdateAsync(id, request);

        if (updatedTask is null)
        {
            return NotFound();
        }

        return Ok(updatedTask);
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