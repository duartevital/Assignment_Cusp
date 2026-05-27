using Assignment_Cusp.DTOs;
using Assignment_Cusp.Exceptions;
using Assignment_Cusp.Models;
using Assignment_Cusp.Repositories;
using Assignment_Cusp.Services;
using Moq;
using NUnit.Framework;

namespace DentalClinic.Tests.Services;

[TestFixture]
public class AppointmentServiceTests
{
    private Mock<IAppointmentRepository> _appointmentRepositoryMock = null!;
    private Mock<IPatientRepository> _patientRepositoryMock = null!;
    private AppointmentService _appointmentService = null!;

    [SetUp]
    public void SetUp()
    {
        _appointmentRepositoryMock = new Mock<IAppointmentRepository>();
        _patientRepositoryMock = new Mock<IPatientRepository>();
        _appointmentService = new AppointmentService(_appointmentRepositoryMock.Object, _patientRepositoryMock.Object);
    }

    [Test]
    public void CreateAsync_ThrowsValidationException_WhenPatientIdIsZero()
    {
        var request = ValidRequest() with { PatientId = 0 };
        Assert.ThrowsAsync<ValidationException>(() => _appointmentService.CreateAsync(request));
    }

    [Test]
    public void CreateAsync_ThrowsValidationException_WhenDateTimeIsDefault()
    {
        var request = ValidRequest() with { DateTime = default };
        Assert.ThrowsAsync<ValidationException>(() => _appointmentService.CreateAsync(request));
    }

    [Test]
    public void CreateAsync_ThrowsValidationException_WhenDentistIsEmpty()
    {
        var request = ValidRequest() with { Dentist = "" };
        Assert.ThrowsAsync<ValidationException>(() => _appointmentService.CreateAsync(request));
    }

    [Test]
    public void CreateAsync_ThrowsValidationException_WhenTreatmentIsUnknown()
    {
        var request = ValidRequest() with { Treatment = "Whitening" };
        Assert.ThrowsAsync<ValidationException>(() => _appointmentService.CreateAsync(request));
    }

    [Test]
    public void CreateAsync_ThrowsNotFoundException_WhenPatientDoesNotExist()
    {
        _patientRepositoryMock.Setup(r => r.ExistsAsync(1)).ReturnsAsync(false);
        Assert.ThrowsAsync<NotFoundException>(() => _appointmentService.CreateAsync(ValidRequest()));
    }

    [TestCase("Cleaning",   30)]
    [TestCase("Filling",    45)]
    [TestCase("Extraction", 60)]
    [TestCase("Root Canal", 90)]
    public async Task CreateAsync_SetsDurationMinutes_MatchingTreatment(string treatment, int expectedDuration)
    {
        _patientRepositoryMock.Setup(r => r.ExistsAsync(1)).ReturnsAsync(true);
        _appointmentRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Appointment>()))
            .ReturnsAsync((Appointment a) => { a.Id = 1; return a; });

        var result = await _appointmentService.CreateAsync(ValidRequest() with { Treatment = treatment });

        Assert.That(result.DurationMinutes, Is.EqualTo(expectedDuration));
    }

    [Test]
    public void GetTreatments_ReturnsFourTreatments()
    {
        var treatments = _appointmentService.GetTreatments().ToList();
        Assert.That(treatments, Has.Count.EqualTo(4));
    }

    [Test]
    public void GetTreatments_AllHavePositiveDuration()
    {
        var treatments = _appointmentService.GetTreatments();
        Assert.That(treatments, Has.All.Matches<TreatmentDto>(t => t.DurationMinutes > 0));
    }

    private static CreateAppointmentRequest ValidRequest() =>
        new(PatientId: 1, DateTime: DateTime.UtcNow.AddDays(1), Dentist: "Dr. Smith", Treatment: "Cleaning");
}
