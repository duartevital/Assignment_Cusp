using Assignment_Cusp.Data;
using Assignment_Cusp.Models;
using Microsoft.EntityFrameworkCore;

namespace Assignment_Cusp.Repositories;

public class PatientRepository(AppDbContext db) : IPatientRepository
{
    public async Task<IEnumerable<Patient>> GetAllAsync() =>
        await db.Patients
            .Include(p => p.Appointments)
            .OrderBy(p => p.FullName)
            .ToListAsync();

    public async Task<Patient?> GetByIdAsync(int id) =>
        await db.Patients
            .Include(p => p.Appointments)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<bool> ExistsAsync(int id) =>
        await db.Patients.AnyAsync(p => p.Id == id);

    public async Task<Patient> AddAsync(Patient patient)
    {
        db.Patients.Add(patient);
        await db.SaveChangesAsync();
        return patient;
    }
}
