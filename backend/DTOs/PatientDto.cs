namespace Assignment_Cusp.DTOs;

public record PatientDto(
    int Id,
    string FullName,
    string Address,
    string? PhotoUrl,
    IEnumerable<AppointmentDto> Appointments);
