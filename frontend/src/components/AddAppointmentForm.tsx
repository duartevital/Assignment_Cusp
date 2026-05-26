import { useEffect, useState } from 'react';
import { createAppointment, getTreatments } from '../api/appointments';
import type { Appointment } from '../api/Appointment';
import type { Treatment } from '../api/Treatment';

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

    if (!date) { setError('Date is required.'); return; }
    if (!time) { setError('Time is required.'); return; }
    if (!dentist) { setError('Please select a dentist.'); return; }
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
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            min={todayDate}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Dentist <span className="text-red-500">*</span>
        </label>
        <select
          value={dentist}
          onChange={e => setDentist(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a dentist…</option>
          {DENTISTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Treatment <span className="text-red-500">*</span>
        </label>
        <select
          value={treatment}
          onChange={e => setTreatment(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a treatment…</option>
          {treatments.map(t => (
            <option key={t.name} value={t.name}>
              {t.name} — {t.durationMinutes} min
            </option>
          ))}
        </select>
        {selectedTreatment && (
          <p className="text-xs text-slate-500 mt-1">
            Duration: {selectedTreatment.durationMinutes} minutes
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-slate-300 text-slate-600 text-sm font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          {submitting ? 'Adding…' : 'Add Appointment'}
        </button>
      </div>
    </form>
  );
}
