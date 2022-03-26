using SignalR.Hubs;

namespace NUNO_Backend.Extensions {
  public static class SignalrExtension {
    public static void AddSignalrProject(this WebApplicationBuilder builder) {
      builder.Services.AddSignalR();
    }

    public static void MapSignalrHubs(this WebApplication app) {
      app.MapHub<PlayerOrderHub>("/playerorder");
    }
  }
}
