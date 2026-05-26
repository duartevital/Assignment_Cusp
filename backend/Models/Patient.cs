namespace Assignment_Cusp.Models;

public class Patient
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
