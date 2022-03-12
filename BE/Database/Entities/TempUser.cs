namespace NUNO_Backend.Database.Entities {
  public class TempUser {
    public int Id { get; set; }
    public string Username { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;
  }
}
