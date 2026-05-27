using Assignment_Cusp.DTOs;
using Assignment_Cusp.Exceptions;
using Assignment_Cusp.Models;
using Assignment_Cusp.Repositories;
using Assignment_Cusp.Services;
using Microsoft.AspNetCore.Hosting;
using Moq;
using NUnit.Framework;

namespace DentalClinic.Tests.Services;

[TestFixture]
public class PatientServiceTests
{
    private Mock<IPatientRepository> _patientRepositoryMock = null!;
    private PatientService _patientService = null!;

    [SetUp]
    public void SetUp()
    {
        _patientRepositoryMock = new Mock<IPatientRepository>();
        _patientService = new PatientService(_patientRepositoryMock.Object, new Mock<IWebHostEnvironment>().Object);
    }

    [Test]
    public void CreateAsync_ThrowsValidationException_WhenFullNameIsEmpty()
    {
        var request = new CreatePatientRequest { FullName = "", Address = "123 Main St" };
        Assert.ThrowsAsync<ValidationException>(() => _patientService.CreateAsync(request));
    }

    [Test]
    public void CreateAsync_ThrowsValidationException_WhenFullNameIsWhitespace()
    {
        var request = new CreatePatientRequest { FullName = "   ", Address = "123 Main St" };
        Assert.ThrowsAsync<ValidationException>(() => _patientService.CreateAsync(request));
    }

    [Test]
    public void CreateAsync_ThrowsValidationException_WhenAddressIsEmpty()
    {
        var request = new CreatePatientRequest { FullName = "Jane Doe", Address = "" };
        Assert.ThrowsAsync<ValidationException>(() => _patientService.CreateAsync(request));
    }

    [Test]
    public void GetByIdAsync_ThrowsNotFoundException_WhenPatientDoesNotExist()
    {
        _patientRepositoryMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Patient?)null);
        Assert.ThrowsAsync<NotFoundException>(() => _patientService.GetByIdAsync(99));
    }

    [Test]
    public async Task GetByIdAsync_ReturnsPatientDto_WhenPatientExists()
    {
        var patient = new Patient { Id = 1, FullName = "Jane Doe", Address = "123 Main St" };
        _patientRepositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(patient);

        var result = await _patientService.GetByIdAsync(1);

        Assert.That(result.FullName, Is.EqualTo("Jane Doe"));
        Assert.That(result.Address, Is.EqualTo("123 Main St"));
    }

    [Test]
    public async Task GetAllAsync_ReturnsEmptyList_WhenNoPatientsExist()
    {
        _patientRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync([]);

        var result = await _patientService.GetAllAsync();

        Assert.That(result, Is.Empty);
    }
}
