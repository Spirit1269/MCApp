// src/api/Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Data;

namespace MotorcycleClubHub.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Club> Clubs { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Chapter> Chapters { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<DuesInvoice> DuesInvoices { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<RideRoute> RideRoutes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Club
            modelBuilder.Entity<Club>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LogoUrl).HasMaxLength(255);
                entity.Property(e => e.PrimaryHex).HasMaxLength(7);
                entity.Property(e => e.SecondaryHex).HasMaxLength(7);
            });

            // District
            modelBuilder.Entity<District>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.HasOne<Club>()
                      .WithMany()
                      .HasForeignKey(d => d.ClubId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Chapter
            modelBuilder.Entity<Chapter>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.HasOne<District>()
                      .WithMany()
                      .HasForeignKey(c => c.DistrictId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Member
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ClubId).IsRequired();
                entity.Property(e => e.ChapterId).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.IsApproved).IsRequired();
                entity.Property(e => e.StripeCustomerId).HasMaxLength(50);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.DisplayName).IsUnique();
                entity.HasMany(e => e.Roles)
                      .WithOne(r => r.Member)
                      .HasForeignKey(r => r.MemberId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.AvatarUrl).HasMaxLength(255);
                entity.HasOne<Chapter>()
                      .WithMany()
                      .HasForeignKey(m => m.ChapterId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Role
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RoleName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ScopeType).IsRequired().HasMaxLength(10);
                entity.HasOne(r => r.Member)
                    .WithMany(m => m.Roles)
                    .HasForeignKey(r => r.MemberId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Post
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.BodyMd).IsRequired();
                entity.Property(e => e.ScopeType).IsRequired().HasMaxLength(10);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.HasOne<Member>()
                      .WithMany()
                      .HasForeignKey(p => p.CreatedBy)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Event
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.DescriptionMd).IsRequired();
                entity.Property(e => e.ScopeType).IsRequired().HasMaxLength(10);
                entity.Property(e => e.FlyerUrl).HasMaxLength(255);
                entity.HasOne<Member>()
                      .WithMany()
                      .HasForeignKey(e => e.CreatedBy)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // DuesInvoice
            modelBuilder.Entity<DuesInvoice>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Period).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Date).IsRequired().HasConversion<string>();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.StripeInvoiceId).HasMaxLength(50);
                entity.HasOne<Chapter>()
                      .WithMany()
                      .HasForeignKey(d => d.ChapterId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Payment
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne<DuesInvoice>()
                      .WithMany()
                      .HasForeignKey(p => p.DuesInvoiceId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // RideRoute
            modelBuilder.Entity<RideRoute>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.HasOne<Member>()
                      .WithMany()
                      .HasForeignKey(r => r.CreatedBy)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
