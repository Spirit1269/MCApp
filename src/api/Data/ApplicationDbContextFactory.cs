using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MotorcycleClubHub.Data;
using MotorcycleClubHub.Api.Data;

namespace MotorcycleClubHub.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // ✅ Replace with your actual connection string
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=MCAppDev;Trusted_Connection=True;");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
// This factory is used by EF Core tools to create the DbContext at design time.
// It allows you to run migrations and other design-time operations without needing to run the application.