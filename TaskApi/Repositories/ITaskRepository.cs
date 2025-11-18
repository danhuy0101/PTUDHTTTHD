using TaskApi.Models;

namespace TaskApi.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllAsync(string? status);
    Task<TaskItem?> GetByIdAsync(int id);
    Task<TaskItem> CreateAsync(TaskItem item);
    Task UpdateAsync(TaskItem item);
    Task DeleteAsync(int id);
}
