using Assignment_Cusp.DTOs;
using Assignment_Cusp.Services;
using Microsoft.AspNetCore.Mvc;

namespace Assignment_Cusp.Controllers;

[ApiController]
[Route("[controller]")]
public class AppointmentsController(IAppointmentService appointmentService) : ControllerBase
{
    [HttpGet("treatments")]
    public IActionResult GetTreatments() =>
        Ok(appointmentService.GetTreatments());

    [HttpGet("{patientId:int}")]
    public async Task<IActionResult> GetByPatient(int patientId) =>
        Ok(await appointmentService.GetByPatientIdAsync(patientId));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest request)
    {
        var appointment = await appointmentService.CreateAsync(request);
        return CreatedAtAction(nameof(GetByPatient), new { patientId = appointment.PatientId }, appointment);
    }
}
