export interface Appointment {
  id: number;
  patientId: number;
  dateTime: string;
  dentist: string;
  treatment: string;
  durationMinutes: number;
}
