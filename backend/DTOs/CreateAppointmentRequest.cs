namespace Assignment_Cusp.DTOs;

public record CreateAppointmentRequest(
    int PatientId,
    DateTime DateTime,
    string Dentist,
    string Treatment);
