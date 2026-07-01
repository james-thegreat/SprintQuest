using Microsoft.AspNetCore.Mvc;
using SprintQuest.Application.DTOs.Sprints;
using SprintQuest.Application.Interfaces;

namespace SprintQuest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SprintsController : ControllerBase
{
    private readonly ISprintService _sprintService;

    public SprintsController(ISprintService sprintService)
    {
        _sprintService = sprintService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SprintDto>>> GetAll()
    {
        var sprints = await _sprintService.GetAllAsync();

        return Ok(sprints);
    }

    [HttpGet("project/{projectId:guid}")]
    public async Task<ActionResult<List<SprintDto>>> GetByProjectId(Guid projectId)
    {
        var sprints = await _sprintService.GetByProjectIdAsync(projectId);

        return Ok(sprints);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SprintDto>> GetById(Guid id)
    {
        var sprint = await _sprintService.GetByIdAsync(id);

        if (sprint is null)
        {
            return NotFound();
        }

        return Ok(sprint);
    }

    [HttpPost]
    public async Task<ActionResult<SprintDto>> Create(CreateSprintRequest request)
    {
        if (request.ProjectId == Guid.Empty)
        {
            return BadRequest("Project id is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Sprint name is required.");
        }

        if (request.EndDate < request.StartDate)
        {
            return BadRequest("Sprint end date cannot be before start date.");
        }

        var sprint = await _sprintService.CreateAsync(request);

        if (sprint is null)
        {
            return NotFound("Project not found.");
        }

        return CreatedAtAction(nameof(GetById), new { id = sprint.Id }, sprint);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateSprintRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Sprint name is required.");
        }

        if (request.EndDate < request.StartDate)
        {
            return BadRequest("Sprint end date cannot be before start date.");
        }

        var updated = await _sprintService.UpdateAsync(id, request);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _sprintService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}