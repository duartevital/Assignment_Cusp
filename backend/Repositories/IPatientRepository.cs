using Assignment_Cusp.Models;

namespace Assignment_Cusp.Repositories;

public interface IPatientRepository
{
    Task<IEnumerable<Patient>> GetAllAsync();
    Task<Patient?> GetByIdAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<Patient> AddAsync(Patient patient);
}
