using Microsoft.EntityFrameworkCore;
using NUNO_Backend.Database.Entities;

namespace NUNO_Backend.Database {
  public class NunoDbContext : DbContext {
    public DbSet<User> Users { get; set; }

    public NunoDbContext(DbContextOptions<NunoDbContext> options) : base(options) { }
  }

  //Commands for database

  ////VisualStudio (Package Manager Console)
  //Add Migration:    Add-Migration Description -OutputDir "Database/Migrations"
  //Update Database:  Update-Database
}
