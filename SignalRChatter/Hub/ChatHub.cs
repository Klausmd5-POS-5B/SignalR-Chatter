using System.Data;
using Microsoft.AspNetCore.SignalR;
using SignalRChatter;
using SignalRChatter.Hub;

public static class UserHandler
{
    private static Dictionary<string, Client> UClients = new();

    public static void Add(string c, Client cl, IHubCallerClients<IChatClient> cl2)
    {
        UClients.Add(c, cl);
        cl2.All.NrClientsChanged(UClients.Count);

    }

    public static void Remove(string c) => UClients.Remove(c);

    public static void UpdateMessageStatus(string id, DateTime d) => UClients.First(x=>x.Key == id).Value.LastMessageTime = d;
}

public class ChatHub : Hub<IChatClient>
{

    public void NewMessage(string name, string message, string timestamp)
    {
        UserHandler.UpdateMessageStatus(Context.ConnectionId, DateTime.Parse(timestamp));
        Clients.All.NewMessage(name, message, timestamp);
    }

    public bool SignIn(string username, string pwd)
    {
        if(pwd.Length < 5) throw new HubException("Pwd too short");

        Clients.All.ClientConnected(username);
        return (username.StartsWith("Admin"));
    }

    void SignOut()
    {
    }

    public override Task OnConnectedAsync()
    {
        UserHandler.Add(Context.ConnectionId, new Client(), Clients);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        UserHandler.Remove(Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }
}