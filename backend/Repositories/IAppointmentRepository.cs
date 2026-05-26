using Assignment_Cusp.Models;

namespace Assignment_Cusp.Repositories;

public interface IAppointmentRepository
{
    Task<IEnumerable<Appointment>> GetByPatientIdAsync(int patientId);
    Task<Appointment> AddAsync(Appointment appointment);
}
