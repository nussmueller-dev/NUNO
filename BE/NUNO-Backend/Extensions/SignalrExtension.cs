using Microsoft.AspNetCore.Authorization;
using SignalR.Authentication;
using SignalR.Hubs;

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
      app.MapHub<PlayerOrderHub>("/playerorder");
      app.MapHub<TestHub>("/test");
    }
  }
}
