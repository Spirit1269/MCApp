using System;
using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Api.Middleware;
using MotorcycleClubHub.Api.Services;
using MotorcycleClubHub.Data;
using Microsoft.AspNetCore.Authentication.Google;
using dotenv.net;


DotEnv.Load();


var builder = WebApplication.CreateBuilder(args);

// 1) Register CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClubHub", policy =>
    {
        policy
          .WithOrigins(
            "https://blue-field-0f8b9f710.6.azurestaticapps.net",
            "https://tripowersllc.com",
            "https://www.tripowersllc.com" 
          )
          .AllowAnyHeader()
          .AllowAnyMethod();
    });
});

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
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowClubHub");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
  db.Database.Migrate();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseMiddleware<ClubIdEnforcementMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();