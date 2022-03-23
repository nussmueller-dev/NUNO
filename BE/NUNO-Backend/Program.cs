using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NUNO_Backend.Database;
using NUNO_Backend.Helpers;
using NUNO_Backend.Logic;
using NUNO_Backend.Models;
using NUNO_Backend.Extensions;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.AddDatabaseProject();
builder.AddAuthenticationProject();
builder.AddModelsProject();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors(builder => builder
  .AllowAnyOrigin()
  .AllowAnyMethod()
  .AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
