namespace Assignment_Cusp.DTOs;

public record AppointmentDto(
    int Id,
    int PatientId,
    string DateTime,
    string Dentist,
    string Treatment,
    int DurationMinutes);
