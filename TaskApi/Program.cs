using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Repositories;
using TaskApi.Services;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; 

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 34))
    )
);

builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, 
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") 
                                .AllowAnyHeader()
                                .AllowAnyMethod(); 
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); 

app.UseCors(MyAllowSpecificOrigins); 

app.UseAuthorization();

app.MapControllers();

app.Run();