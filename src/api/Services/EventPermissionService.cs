using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MotorcycleClubHub.Api.Services
{
    public class EventPermissionService : IEventPermissionService
    {
        public Task<bool> CanCreateEventAsync(Member member, string scopeType, string scopeId)
        {
            return Task.FromResult(IsOfficerForScope(member, scopeType, scopeId));
        }

        public Task<bool> CanUpdateOrDeleteEventAsync(Member member, Event @event)
        {
            // If the user created the event, allow it
            if (@event.CreatedBy == member.Id)
                return Task.FromResult(true);

            return Task.FromResult(IsOfficerForScope(member, @event.ScopeType, @event.ScopeId));
        }

        private bool IsOfficerForScope(Member member, string scopeType, string scopeId)
        {
            var roles = member.Roles;

            return scopeType switch
            {
                "club" => roles.Any(r =>
                    r.ScopeType == "club" &&
                    new[] { "President", "Vice President", "Secretary", "Treasurer", "Road Captain", "Seargeant At Arms","Board Member" }.Contains(r.RoleName)),

                "district" => roles.Any(r =>
                    r.ScopeType == "district" && r.ScopeId == scopeId &&
                    new[] { "President", "Vice President"}.Contains(r.RoleName)),

                "chapter" => roles.Any(r =>
                    r.ScopeType == "chapter" && r.ScopeId == scopeId &&
                    new[] { "President", "Vice President", "Secretary", "Treasurer", "Road Captain", "Seargeant At Arms" }.Contains(r.RoleName)),

                _ => false
            };
        }
    }
}

