using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace MotorcycleClubHub.Api.Middleware
{
    public class ClubIdEnforcementMiddleware
    {
        private readonly RequestDelegate _next;

        public ClubIdEnforcementMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var hasClubId = context.User.Claims.Any(c => c.Type == "club_id");
                if (!hasClubId)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Missing club_id claim.");
                    return;
                }
            }

            await _next(context);
        }
    }
}
// This middleware checks if the user is authenticated and has a "club_id" claim.
// If not, it returns a 401 Unauthorized response with a message indicating the missing claim.