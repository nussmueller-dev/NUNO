using Microsoft.EntityFrameworkCore;
using NUNO_Backend.Database;

namespace NUNO_Backend.Extensions {
  public static class DatabaseExtension {
    public static void AddDatabaseProject(this WebApplicationBuilder builder) {
      #if (DEBUG)
            var connectionString = builder.Configuration.GetConnectionString("DebugConnection");
      #else
        var connectionString = builder.Configuration.GetConnectionString("ServerConnection");
      #endif

      builder.Services.AddDbContextPool<NunoDbContext>(options =>
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
    }
  }
}
