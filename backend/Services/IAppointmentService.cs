using Assignment_Cusp.DTOs;

namespace Assignment_Cusp.Services;

public interface IAppointmentService
{
    IEnumerable<TreatmentDto> GetTreatments();
    Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId);
    Task<AppointmentDto> CreateAsync(CreateAppointmentRequest request);
}
