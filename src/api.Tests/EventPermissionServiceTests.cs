using MotorcycleClubHub.Api.Services;
using MotorcycleClubHub.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Tests;

public class EventPermissionServiceTests
{
    [Fact]
    public async Task ClubOfficer_CanCreateEvent()
    {
        var member = new Member
        {
            Roles = new List<Role>
            {
                new Role { RoleName = "President", ScopeType = "club" }
            }
        };
        var svc = new EventPermissionService();
        var result = await svc.CanCreateEventAsync(member, "club", "club1");
        Assert.True(result);
    }

    [Fact]
    public async Task ChapterSergeantAtArms_CanCreateEvent()
    {
        var member = new Member
        {
            Roles = new List<Role>
            {
                new Role { RoleName = "Sergeant At Arms", ScopeType = "chapter", ScopeId = "chap1" }
            }
        };
        var svc = new EventPermissionService();
        var result = await svc.CanCreateEventAsync(member, "chapter", "chap1");
        Assert.True(result);
    }

    [Fact]
    public async Task NonOfficer_CannotCreateEvent()
    {
        var member = new Member();
        var svc = new EventPermissionService();
        var result = await svc.CanCreateEventAsync(member, "club", "club1");
        Assert.False(result);
    }

    [Fact]
    public async Task Creator_CanUpdateOrDeleteEvent()
    {
        var member = new Member { Id = "user1" };
        var evt = new Event { CreatedBy = "user1", ScopeType = "club", ScopeId = "club1" };
        var svc = new EventPermissionService();
        var result = await svc.CanUpdateOrDeleteEventAsync(member, evt);
        Assert.True(result);
    }
}