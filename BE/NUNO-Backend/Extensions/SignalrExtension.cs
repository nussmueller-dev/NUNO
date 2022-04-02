using Game.CustomAuthentication;
using Game.Hubs;
using Microsoft.AspNetCore.Authorization;

namespace NUNO_Backend.Extensions {
  public static class SignalrExtension {
    public static void AddSignalrProject(this WebApplicationBuilder builder) {
      builder.Services.AddSingleton<IAuthorizationHandler, PlayerAuthorizationHandler>();
      builder.Services.AddAuthorization(options => {
        options.AddPolicy("PlayerAuthorization", policy => {
          policy.Requirements.Add(new PlayerAuthorizationRequirement());
        });
      });
      builder.Services.AddSignalR();
    }

    public static void MapSignalrHubs(this WebApplication app) {
      app.MapHub<PlayerOrderHub>("/hubs/playerorder");
      app.MapHub<TestHub>("/hubs/test");
    }
  }
}
