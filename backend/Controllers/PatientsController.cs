using Assignment_Cusp.DTOs;
using Assignment_Cusp.Services;
using Microsoft.AspNetCore.Mvc;

namespace Assignment_Cusp.Controllers;

[ApiController]
[Route("[controller]")]
public class PatientsController(IPatientService patientService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await patientService.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await patientService.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreatePatientRequest request)
    {
        var patient = await patientService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = patient.Id }, patient);
    }
}
