using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;

namespace TaskApi.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly TaskDbContext _context;

    public TaskRepository(TaskDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync(string? status)
    {
        var query = _context.Tasks.AsQueryable();

        if (status == "doing")
            query = query.Where(t => t.IsCompleted == false);
        else if (status == "done")
            query = query.Where(t => t.IsCompleted == true);

        return await query.ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
        => await _context.Tasks.FindAsync(id);

    public async Task<TaskItem> CreateAsync(TaskItem item)
    {
        _context.Tasks.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task UpdateAsync(TaskItem item)
    {
        _context.Tasks.Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var item = await _context.Tasks.FindAsync(id);
        if (item != null)
        {
            _context.Tasks.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}
