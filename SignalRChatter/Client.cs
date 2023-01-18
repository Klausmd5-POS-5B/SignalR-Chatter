namespace SignalRChatter;

public class Client
{

    public string Username { get; set; }
    public DateTime RegisterTime { get; set; } = DateTime.Now;
    public DateTime LastMessageTime { get; set; }
}