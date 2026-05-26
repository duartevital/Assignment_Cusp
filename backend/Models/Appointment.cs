namespace Assignment_Cusp.Models;

public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public DateTime DateTime { get; set; }
    public string Dentist { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
}
