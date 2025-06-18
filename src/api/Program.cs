using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Api.Middleware;
using MotorcycleClubHub.Api.Services;
using MotorcycleClubHub.Data;
using Microsoft.AspNetCore.Authentication.Google;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(opts =>
    opts.UseSqlServer(
        builder.Configuration.GetConnectionString("Default") // from appsettings OR AZURE
        ?? Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING")
        ?? throw new InvalidOperationException("No DB connection string configured")));

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = "Cookies";
        options.DefaultChallengeScheme = "Google";
    })
    .AddCookie("Cookies")
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    });

builder.Services.AddControllers();
builder.Services.AddScoped<IEventPermissionService, EventPermissionService>();
builder.Services.AddScoped<IMemberService, MemberService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseMiddleware<ClubIdEnforcementMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();