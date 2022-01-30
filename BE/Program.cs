using Microsoft.EntityFrameworkCore;
using NUNO_Backend.Database;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#if (DEBUG)
  var connectionString = builder.Configuration.GetConnectionString("DebugConnection");
#else
  var connectionString = builder.Configuration.GetConnectionString("ServerConnection");
#endif

builder.Services.AddDbContextPool<NunoDbContext>(options =>
  options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
