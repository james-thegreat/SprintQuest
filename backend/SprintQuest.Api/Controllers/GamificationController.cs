using Microsoft.AspNetCore.Mvc;
using SprintQuest.Application.Interfaces;

namespace SprintQuest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamificationController : ControllerBase
{
    private readonly IGamificationService _gamificationService;

    public GamificationController(IGamificationService gamificationService)
    {
        _gamificationService = gamificationService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _gamificationService.GetSummaryAsync();

        return Ok(summary);
    }
}