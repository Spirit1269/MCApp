using MotorcycleClubHub.Data;

namespace MotorcycleClubHub.Api.Interfaces
{
    public interface IClubContextService
    {
        string ClubId { get; }
        string UserId { get; }
        string Email { get; }
        IQueryable<Club> Clubs { get; }
        void AddClub(Club club);
        int SaveChanges();
    }
}
