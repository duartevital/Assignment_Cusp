using Assignment_Cusp.DTOs;
using Assignment_Cusp.Exceptions;
using Assignment_Cusp.Models;
using Assignment_Cusp.Repositories;

namespace Assignment_Cusp.Services;

public class AppointmentService(
    IAppointmentRepository appointmentRepository,
    IPatientRepository patientRepository) : IAppointmentService
{
    private static readonly Dictionary<string, int> TreatmentDurations = new()
    {
        { "Cleaning",   30 },
        { "Filling",    45 },
        { "Extraction", 60 },
        { "Root Canal", 90 }
    };

    public IEnumerable<TreatmentDto> GetTreatments() =>
        TreatmentDurations.Select(kv => new TreatmentDto(kv.Key, kv.Value));

    public async Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId)
    {
        var patientExists = await patientRepository.ExistsAsync(patientId);
        if (!patientExists)
            throw new NotFoundException($"Patient {patientId} not found.");

        var appointments = await appointmentRepository.GetByPatientIdAsync(patientId);
        return appointments.Select(ToDto);
    }

    public async Task<AppointmentDto> CreateAsync(CreateAppointmentRequest request)
    {
        if (request.PatientId <= 0)
            throw new ValidationException("A valid patient ID is required.");

        if (request.DateTime == default)
            throw new ValidationException("Appointment date and time are required.");

        if (string.IsNullOrWhiteSpace(request.Dentist))
            throw new ValidationException("Dentist is required.");

        if (!TreatmentDurations.TryGetValue(request.Treatment ?? "", out var duration))
            throw new ValidationException($"Treatment must be one of: {string.Join(", ", TreatmentDurations.Keys)}.");

        var patientExists = await patientRepository.ExistsAsync(request.PatientId);
        if (!patientExists)
            throw new NotFoundException($"Patient {request.PatientId} not found.");

        var appointment = new Appointment
        {
            PatientId = request.PatientId,
            DateTime = request.DateTime.ToUniversalTime(),
            Dentist = request.Dentist.Trim(),
            Treatment = request.Treatment!,
            DurationMinutes = duration
        };

        var created = await appointmentRepository.AddAsync(appointment);
        return ToDto(created);
    }

    private static AppointmentDto ToDto(Appointment a) =>
        new(a.Id, a.PatientId, a.DateTime.ToString("o"), a.Dentist, a.Treatment, a.DurationMinutes);
}
