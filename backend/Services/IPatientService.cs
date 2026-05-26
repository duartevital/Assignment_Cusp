using Assignment_Cusp.DTOs;

namespace Assignment_Cusp.Services;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllAsync();
    Task<PatientDto> GetByIdAsync(int id);
    Task<PatientDto> CreateAsync(CreatePatientRequest request);
}
