using MotorcycleClubHub.Data;
using System.Threading.Tasks;

namespace MotorcycleClubHub.Api.Interfaces
{
    public interface IMemberService
    {
        Task<Member?> GetCurrentMemberAsync();
        Task<string?> GetClubIdForMemberAsync(Member member);
    }
}
