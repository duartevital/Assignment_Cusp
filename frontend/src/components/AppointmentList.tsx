import type { Appointment } from '../api/Appointment';

interface Props {
  appointments: Appointment[];
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-IE', { month: 'short' }),
    full: d.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function AppointmentList({ appointments }: Props) {
  if (appointments.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-slate-400">
        <p className="text-sm">No appointments yet.</p>
        <p className="text-xs mt-1">Click + to schedule one.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {appointments.map(appt => {
        const { day, month, full, time } = formatDateTime(appt.dateTime);
        return (
          <li key={appt.id} className="px-6 py-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex flex-col items-center justify-center shrink-0">
              <span className="text-blue-700 font-bold text-sm leading-none">{day}</span>
              <span className="text-blue-400 text-xs uppercase leading-none mt-0.5">{month}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800">{appt.treatment}</p>
              <p className="text-sm text-slate-500 truncate">
                {appt.dentist} · {time} · {appt.durationMinutes} min
              </p>
            </div>
            <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{full}</span>
          </li>
        );
      })}
    </ul>
  );
}
