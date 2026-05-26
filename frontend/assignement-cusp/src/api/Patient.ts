import type { Appointment } from './Appointment';

export interface Patient {
  id: number;
  fullName: string;
  address: string;
  photoUrl: string | null;
  appointments: Appointment[];
}
