import type { Patient } from './types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function getAllPatients(): Promise<Patient[]> {
  return fetch('/patients').then(handleResponse<Patient[]>);
}

export function getPatient(id: number): Promise<Patient> {
  return fetch(`/patients/${id}`).then(handleResponse<Patient>);
}

export function createPatient(formData: FormData): Promise<Patient> {
  return fetch('/patients', { method: 'POST', body: formData })
    .then(handleResponse<Patient>);
}
