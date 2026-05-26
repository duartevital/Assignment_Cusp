namespace Assignment_Cusp.DTOs;

public class CreatePatientRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public IFormFile? Photo { get; set; }
}
