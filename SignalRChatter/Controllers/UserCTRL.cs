using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRChatter.Hub;

namespace SignalRChatter.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class UserCTRL : ControllerBase
{

    private readonly IHubContext<ChatHub, IChatClient> _hub;
    
    public UserCTRL(IHubContext<ChatHub, IChatClient> hub) => _hub = hub;
    
    [HttpGet]
    public List<Client> AllUsers() => UserHandler.GetAll();
    
    [HttpPost]
    public void Broadcast([FromBody] string message) => _hub.Clients.All.NewMessage("Broadcast", message, DateTime.Now.ToString("o"));
}