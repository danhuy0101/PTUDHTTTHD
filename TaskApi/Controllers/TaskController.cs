using Microsoft.AspNetCore.Mvc;
using TaskApi.Models;
using TaskApi.Services;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly ITaskService _service;

    public TaskController(ITaskService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
        => Ok(await _service.GetAllAsync(status));

    [HttpPost]
    public async Task<IActionResult> Create(TaskItem item)
        => Ok(await _service.CreateAsync(item));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskItem item)
    {
        await _service.UpdateAsync(id, item);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
}
