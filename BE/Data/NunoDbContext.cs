using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Data {
  public class NunoDbContext : DbContext {
    public DbSet<User> Users { get; set; }
    public DbSet<TempUser> TempUsers { get; set; }

    public NunoDbContext(DbContextOptions<NunoDbContext> options) : base(options) {
      Database.Migrate();
    }
  }

  //Commands for database

  ////VisualStudio (Package Manager Console)
  //Add Migration:    Add-Migration Description -OutputDir "Database/Migrations"
  //Update Database:  Update-Database
}
