using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRChatter.Hub;

namespace SignalRChatter.Controllers;

[ApiController]
[Route("[controller]")]
public class UserCTRL : ControllerBase
{

    private readonly IHubContext<ChatHub, IChatClient> _hub;
    
    public UserCTRL(IHubContext<ChatHub, IChatClient> hub) => _hub = hub;
    
}