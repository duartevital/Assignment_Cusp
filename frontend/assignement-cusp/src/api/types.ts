export interface Appointment {
  id: number;
  patientId: number;
  dateTime: string;
  dentist: string;
  treatment: string;
  durationMinutes: number;
}

export interface Patient {
  id: number;
  fullName: string;
  address: string;
  photoUrl: string | null;
  appointments: Appointment[];
}

export interface Treatment {
  name: string;
  durationMinutes: number;
}
