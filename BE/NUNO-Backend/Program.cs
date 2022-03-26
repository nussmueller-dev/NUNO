using NUNO_Backend.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.AddDatabaseProject();
builder.AddAuthenticationProject();
builder.AddModelsProject();
builder.AddSignalrProject();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors(builder => builder
  .SetIsOriginAllowed(_ => true)
  .AllowAnyMethod()
  .AllowAnyHeader()
  .AllowCredentials());

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapSignalrHubs();

app.Run();
