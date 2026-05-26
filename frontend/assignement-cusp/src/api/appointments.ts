import type { Appointment, Treatment } from './types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function getAppointments(patientId: number): Promise<Appointment[]> {
  return fetch(`/appointments/${patientId}`).then(handleResponse<Appointment[]>);
}

export function getTreatments(): Promise<Treatment[]> {
  return fetch('/appointments/treatments').then(handleResponse<Treatment[]>);
}

export function createAppointment(data: {
  patientId: number;
  dateTime: string;
  dentist: string;
  treatment: string;
}): Promise<Appointment> {
  return fetch('/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse<Appointment>);
}
