using Assignment_Cusp.DTOs;
using Assignment_Cusp.Exceptions;
using Assignment_Cusp.Models;
using Assignment_Cusp.Repositories;

namespace Assignment_Cusp.Services;

public class PatientService(IPatientRepository patientRepository, IWebHostEnvironment env) : IPatientService
{
    public async Task<IEnumerable<PatientDto>> GetAllAsync()
    {
        var patients = await patientRepository.GetAllAsync();
        return patients.Select(ToDto);
    }

    public async Task<PatientDto> GetByIdAsync(int id)
    {
        var patient = await patientRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Patient {id} not found.");

        return ToDto(patient);
    }

    public async Task<PatientDto> CreateAsync(CreatePatientRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ValidationException("Full name is required.");

        if (string.IsNullOrWhiteSpace(request.Address))
            throw new ValidationException("Address is required.");

        var photoUrl = await SavePhotoAsync(request.Photo);

        var patient = new Patient
        {
            FullName = request.FullName.Trim(),
            Address = request.Address.Trim(),
            PhotoUrl = photoUrl
        };

        var created = await patientRepository.AddAsync(patient);
        return ToDto(created);
    }

    private async Task<string?> SavePhotoAsync(IFormFile? photo)
    {
        if (photo is not { Length: > 0 })
            return null;

        var allowed = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowed.Contains(photo.ContentType))
            throw new ValidationException("Photo must be a JPEG, PNG, GIF, or WebP image.");

        var uploadsDir = Path.Combine(env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";
        await using var stream = new FileStream(Path.Combine(uploadsDir, fileName), FileMode.Create);
        await photo.CopyToAsync(stream);

        return $"/uploads/{fileName}";
    }

    private static PatientDto ToDto(Patient p) => new(
        p.Id,
        p.FullName,
        p.Address,
        p.PhotoUrl,
        p.Appointments
            .OrderBy(a => a.DateTime)
            .Select(a => new AppointmentDto(a.Id, a.PatientId, a.DateTime.ToString("o"), a.Dentist, a.Treatment, a.DurationMinutes)));
}
