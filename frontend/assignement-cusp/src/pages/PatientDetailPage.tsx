import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPatient } from '../api/patients';
import type { Appointment, Patient } from '../api/types';
import AddAppointmentForm from '../components/AddAppointmentForm';
import AppointmentList from '../components/AppointmentList';
import Avatar from '../components/Avatar';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getPatient(Number(id))
      .then(setPatient)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load patient.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAppointmentAdded(appointment: Appointment) {
    setPatient(prev => {
      if (!prev) return prev;
      const updated = [...prev.appointments, appointment].sort(
        (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
      return { ...prev, appointments: updated };
    });
    setShowForm(false);
  }

  if (loading) return <p className="text-center text-slate-400 py-20">Loading…</p>;
  if (error)   return <p className="text-center text-red-500 py-20">{error}</p>;
  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Patients
          </Link>
          <h1 className="text-xl font-bold text-slate-800">🦷 Dental Clinic</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Patient info card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5">
          <Avatar name={patient.fullName} photoUrl={patient.photoUrl} size="lg" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{patient.fullName}</h2>
            <p className="text-slate-500 mt-1">{patient.address}</p>
          </div>
        </div>

        {/* Appointments card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">
              Appointments
              {patient.appointments.length > 0 && (
                <span className="ml-2 text-xs font-normal text-slate-400">
                  ({patient.appointments.length})
                </span>
              )}
            </h3>
            <button
              onClick={() => setShowForm(v => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xl leading-none transition-colors"
              title={showForm ? 'Cancel' : 'Add appointment'}
            >
              {showForm ? '−' : '+'}
            </button>
          </div>

          {showForm && (
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
              <AddAppointmentForm
                patientId={patient.id}
                onAdded={handleAppointmentAdded}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <AppointmentList appointments={patient.appointments} />
        </div>
      </main>
    </div>
  );
}
