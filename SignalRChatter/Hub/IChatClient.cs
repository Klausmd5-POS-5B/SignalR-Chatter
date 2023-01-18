namespace SignalRChatter.Hub;

public interface IChatClient
{
    Task NewMessage(string name, string message, string timestamp);
    Task ClientConnected(string name);
    Task ClientDisconnected(string name);
    Task AdminNotification(string name);
    Task NrClientsChanged(int nr);
}