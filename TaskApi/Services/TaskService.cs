using TaskApi.Models;
using TaskApi.Repositories;

namespace TaskApi.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;

    public TaskService(ITaskRepository repo)
    {
        _repo = repo;
    }

    public Task<IEnumerable<TaskItem>> GetAllAsync(string? status)
        => _repo.GetAllAsync(status);

    public Task<TaskItem> CreateAsync(TaskItem item)
        => _repo.CreateAsync(item);

    public async Task UpdateAsync(int id, TaskItem item)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) throw new Exception("Task not found");

        existing.Title = item.Title;
        existing.DueDate = item.DueDate;
        existing.IsCompleted = item.IsCompleted;

        await _repo.UpdateAsync(existing);
    }

    public Task DeleteAsync(int id)
        => _repo.DeleteAsync(id);
}
