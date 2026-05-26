using Assignment_Cusp.Data;
using Assignment_Cusp.Exceptions;
using Assignment_Cusp.Repositories;
using Assignment_Cusp.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("DentalClinicDb"));

builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler(errApp =>
    errApp.Run(async ctx =>
    {
        var ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;

        ctx.Response.ContentType = "application/json";
        ctx.Response.StatusCode = ex switch
        {
            NotFoundException  => StatusCodes.Status404NotFound,
            ValidationException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        await ctx.Response.WriteAsJsonAsync(new { error = ex?.Message ?? "An unexpected error occurred." });
    }));

app.UseCors();
app.UseStaticFiles();
app.MapControllers();

app.Run();
