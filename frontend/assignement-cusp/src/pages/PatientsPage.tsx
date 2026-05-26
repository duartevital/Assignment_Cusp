import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPatients } from '../api/patients';
import type { Patient } from '../api/types';
import Avatar from '../components/Avatar';
import CreatePatientModal from '../components/CreatePatientModal';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(patient: Patient) {
    setPatients(prev =>
      [...prev, patient].sort((a, b) => a.fullName.localeCompare(b.fullName))
    );
    setShowModal(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">🦷 Dental Clinic</h1>
            <p className="text-xs text-slate-500 mt-0.5">Patient Management</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Create New Patient
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading…</p>
        ) : patients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No patients yet.</p>
            <p className="text-slate-400 text-sm mt-1">Click "Create New Patient" to get started.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {patients.map(patient => (
              <li key={patient.id}>
                <Link
                  to={`/patients/${patient.id}`}
                  className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <Avatar name={patient.fullName} photoUrl={patient.photoUrl} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                      {patient.fullName}
                    </p>
                    <p className="text-sm text-slate-500 truncate">{patient.address}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {patient.appointments.length} appt{patient.appointments.length !== 1 ? 's' : ''}
                  </span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      {showModal && (
        <CreatePatientModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
