using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace MotorcycleClubHub.Filters
{
    public class RequireClubIdAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var clubId = context.HttpContext.User.Claims
                .FirstOrDefault(c => c.Type == "club_id")?.Value;

            if (string.IsNullOrEmpty(clubId))
            {
                context.Result = new UnauthorizedObjectResult("Missing or invalid Club ID in user claims.");
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}
