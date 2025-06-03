using System;
using System.ComponentModel.DataAnnotations;

namespace MotorcycleClubHub.Data
{
    public class Club
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? PrimaryHex { get; set; } 
        public string? SecondaryHex { get; set; }
    }

    public class District
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ClubId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class Chapter
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string DistrictId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class Member
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ChapterId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string? StripeCustomerId { get; set; }
    }

    public class Role
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string MemberId { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string ScopeId { get; set; } = string.Empty;
        public string ScopeType { get; set; } = string.Empty; // 'club', 'district', 'chapter'
    }

    public class Post
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ScopeId { get; set; } = string.Empty;
        public string ScopeType { get; set; } = string.Empty; // 'club', 'district', 'chapter'
        public string Title { get; set; } = string.Empty;
        public string BodyMd { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty; // Reference to Member.Id
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Event
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ScopeId { get; set; } = string.Empty;
        public string ScopeType { get; set; } = string.Empty; // 'club', 'district', 'chapter'
        public string Title { get; set; } = string.Empty;
        public string DescriptionMd { get; set; } = string.Empty;
        public string? FlyerUrl { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty; // Reference to Member.Id
    }

    public class DuesInvoice
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ChapterId { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty; // e.g., '2023-Q1'
        public int AmountCents { get; set; }
        public string Status { get; set; } = "draft"; // 'draft', 'sent', 'paid', 'overdue', 'cancelled'
        public string? StripeInvoiceId { get; set; }
    }

    public class Payment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string DuesInvoiceId { get; set; } = string.Empty;
        public int AmountCents { get; set; }
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    }

    public class RideRoute
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string CreatedBy { get; set; } = string.Empty; // Reference to Member.Id
        public string Title { get; set; } = string.Empty;
        public double StartLat { get; set; }
        public double StartLng { get; set; }
        public double DistanceMi { get; set; }
        public string GpxJson { get; set; } = string.Empty;
    }
}