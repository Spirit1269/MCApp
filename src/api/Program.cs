using System;
using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Api.Middleware;
using MotorcycleClubHub.Api.Services;
using MotorcycleClubHub.Api.Data;
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
            "https://www.tripowersllc.com",
            "https://mcclubhub.com",
            "https://www.mcclubhub.com"
          )
          .AllowAnyHeader()
          .AllowAnyMethod();
    });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
    
var connStr =
    builder.Configuration.GetConnectionString("Default")
    ?? builder.Configuration["DATABASE_CONNECTION_STRING"]
    ?? throw new InvalidOperationException("No DB connection string configured");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connStr));
    
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = "Cookies";
        options.DefaultChallengeScheme = "Google";
    })
    .AddCookie("Cookies")
    .AddGoogle(googleOptions =>
    {
        var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
        var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
        if (string.IsNullOrEmpty(googleClientId) || string.IsNullOrEmpty(googleClientSecret))
        {
            throw new InvalidOperationException("Google authentication ClientId or ClientSecret is not configured.");
        }
        googleOptions.ClientId = googleClientId;
        googleOptions.ClientSecret = googleClientSecret;
    });

builder.Services.AddControllers();
builder.Services.AddScoped<IEventPermissionService, EventPermissionService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IClubContextService, ClubContextService>();
builder.Services.AddScoped<IDuesService, DuesService>();

builder.Services.AddControllers();


var app = builder.Build();

app.UseCors("AllowClubHub");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseSwagger();                // Serves the generated JSON at /swagger/v1/swagger.json
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Club API V1");
        c.RoutePrefix = "swagger";   // Hosts UI at /swagger
    });
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