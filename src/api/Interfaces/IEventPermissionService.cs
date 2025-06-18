using MotorcycleClubHub.Data;
using System.Threading.Tasks;

namespace MotorcycleClubHub.Api.Interfaces
{
    public interface IEventPermissionService
    {
        Task<bool> CanCreateEventAsync(Member member, string scopeType, string scopeId);
        Task<bool> CanUpdateOrDeleteEventAsync(Member member, Event @event);
    }
}
