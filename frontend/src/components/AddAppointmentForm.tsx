import { useEffect, useState } from 'react';
import { createAppointment, getTreatments } from '../api/appointments';
import type { Appointment } from '../api/Appointment';
import type { Treatment } from '../api/Treatment';
import Button from './ui/Button';
import FormField from './ui/FormField';
import Input from './ui/Input';
import Select from './ui/Select';

const DENTISTS = [
  'Dr. Anderson',
  'Dr. Martinez',
  'Dr. Thompson',
  'Dr. Garcia',
  'Dr. Wilson',
];

interface Props {
  patientId: number;
  onAdded: (appointment: Appointment) => void;
  onCancel: () => void;
}

export default function AddAppointmentForm({ patientId, onAdded, onCancel }: Props) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dentist, setDentist] = useState('');
  const [treatment, setTreatment] = useState('');
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTreatments().then(setTreatments);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date)      { setError('Date is required.'); return; }
    if (!time)      { setError('Time is required.'); return; }
    if (!dentist)   { setError('Please select a dentist.'); return; }
    if (!treatment) { setError('Please select a treatment.'); return; }

    try {
      setSubmitting(true);
      const appointment = await createAppointment({
        patientId,
        dateTime: `${date}T${time}:00`,
        dentist,
        treatment,
      });
      onAdded(appointment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedTreatment = treatments.find(t => t.name === treatment);
  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Date" required>
          <Input type="date" value={date} min={todayDate} onChange={e => setDate(e.target.value)} />
        </FormField>
        <FormField label="Time" required>
          <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
        </FormField>
      </div>

      <FormField label="Dentist" required>
        <Select value={dentist} onChange={e => setDentist(e.target.value)}>
          <option value="">Select a dentist…</option>
          {DENTISTS.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
      </FormField>

      <FormField
        label="Treatment"
        required
        hint={selectedTreatment ? `Duration: ${selectedTreatment.durationMinutes} minutes` : undefined}
      >
        <Select value={treatment} onChange={e => setTreatment(e.target.value)}>
          <option value="">Select a treatment…</option>
          {treatments.map(t => (
            <option key={t.name} value={t.name}>
              {t.name} — {t.durationMinutes} min
            </option>
          ))}
        </Select>
      </FormField>

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" fullWidth type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" fullWidth type="submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add Appointment'}
        </Button>
      </div>
    </form>
  );
}
