import { useRef, useState } from 'react';
import { createPatient } from '../api/patients';
import type { Patient } from '../api/Patient';
import Button from './ui/Button';
import FormField from './ui/FormField';
import Input from './ui/Input';

interface Props {
  onClose: () => void;
  onCreated: (patient: Patient) => void;
}

export default function CreatePatientModal({ onClose, onCreated }: Props) {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!address.trim()) { setError('Address is required.'); return; }

    const formData = new FormData();
    formData.append('fullName', fullName.trim());
    formData.append('address', address.trim());
    if (photo) formData.append('photo', photo);

    try {
      setSubmitting(true);
      const patient = await createPatient(formData);
      onCreated(patient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">New Patient</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <FormField label="Full Name" required>
            <Input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </FormField>

          <FormField label="Address" required>
            <Input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 123 Main St, Dublin"
            />
          </FormField>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 text-2xl">
                {preview
                  ? <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  : '📷'}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {photo ? 'Change photo' : 'Upload photo'}
                </button>
                {photo && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{photo.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
