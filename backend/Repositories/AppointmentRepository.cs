using Assignment_Cusp.Data;
using Assignment_Cusp.Models;
using Microsoft.EntityFrameworkCore;

namespace Assignment_Cusp.Repositories;

public class AppointmentRepository(AppDbContext db) : IAppointmentRepository
{
    public async Task<IEnumerable<Appointment>> GetByPatientIdAsync(int patientId) =>
        await db.Appointments
            .Where(a => a.PatientId == patientId)
            .OrderBy(a => a.DateTime)
            .ToListAsync();

    public async Task<Appointment> AddAsync(Appointment appointment)
    {
        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();
        return appointment;
    }
}
