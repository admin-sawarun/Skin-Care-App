import { useState } from 'react';
import { api, apiErrorMessage } from '../lib/api';
import { useApiQuery } from '../hooks/useApiQuery';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useSocketEvent } from '../lib/socket';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Field, { TextInput } from '../components/Field';
import { Loading, ErrorMessage } from '../components/Feedback';
import { toastSuccess, toastError } from '../store/toastStore';

function emptyForm() {
  return { name: '', email: '', phone: '', specialization: '', experience: '', password: '' };
}

export default function Doctors() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, loading, error, refetch } = useApiQuery(
    () => api.get('/admin/doctors', { params: { limit: 100, ...(debouncedSearch && { search: debouncedSearch }) } }),
    [debouncedSearch],
  );
  useSocketEvent(['doctor_availability_changed', 'notification'], refetch);
  const [deciding, setDeciding] = useState(null); // { doctor, action: 'approve' | 'reject' }
  const [decideBusy, setDecideBusy] = useState(false);

  // Doctors who signed up from the app wait here until an admin decides.
  const allDoctors = data?.data ?? [];
  const pending = allDoctors.filter((d) => d.status === 'PENDING');
  const doctors = allDoctors.filter((d) => d.status !== 'PENDING');

  async function handleDecision() {
    const { doctor, action } = deciding;
    setDecideBusy(true);
    try {
      await api.patch(`/admin/doctors/${doctor.id}/${action}`);
      toastSuccess(action === 'approve' ? `${doctor.name} approved. They can log in now.` : `${doctor.name}'s request was rejected.`);
      setDeciding(null);
      refetch();
      window.dispatchEvent(new Event('doctors-pending-changed'));
    } catch (err) {
      toastError(apiErrorMessage(err));
    } finally {
      setDecideBusy(false);
    }
  }
  const [editing, setEditing] = useState(null); // doctor object, or {} for new
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  function openCreate() {
    setForm(emptyForm());
    setFormError(null);
    setEditing({});
  }
  function openEdit(doctor) {
    setForm({ name: doctor.name, email: doctor.email, phone: doctor.phone, specialization: doctor.specialization || '', experience: doctor.experience || '', password: '' });
    setFormError(null);
    setEditing(doctor);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization || undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        // Blank on edit = keep the current password.
        password: form.password || undefined,
      };
      if (editing.id) {
        await api.put(`/admin/doctors/${editing.id}`, payload);
      } else {
        await api.post('/admin/doctors', payload);
      }
      setEditing(null);
      toastSuccess(editing.id ? 'Doctor updated.' : 'Doctor added.');
      refetch();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(doctor) {
    setTogglingId(doctor.id);
    try {
      await api.put(`/admin/doctors/${doctor.id}`, { isAvailable: !doctor.isAvailable });
      toastSuccess(doctor.isAvailable ? 'Marked unavailable.' : 'Marked available.');
      refetch();
    } catch (err) {
      toastError(apiErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    setDeleteBusy(true);
    try {
      await api.delete(`/admin/doctors/${deleting.id}`);
      setDeleting(null);
      toastSuccess('Doctor deleted.');
      refetch();
    } catch (err) {
      toastError(apiErrorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  // The list stays mounted while a search refetch is in flight, otherwise the
  // search box would be unmounted and lose focus on every keystroke.
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Doctors</h1>
        <Button onClick={openCreate}>+ Add doctor</Button>
      </div>

      <TextInput
        placeholder="Search by name, email or specialization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {pending.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <h2 className="mb-3 text-sm font-semibold text-amber-800">
            Pending approval ({pending.length}) · doctors who requested an account from the app
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((doctor) => (
              <Card key={doctor.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-800">{doctor.name}</div>
                    <div className="text-xs text-slate-400">
                      {doctor.specialization || 'General'}
                      {doctor.experience != null ? ` · ${doctor.experience} yrs experience` : ''}
                    </div>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Pending
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-500">{doctor.email}</div>
                <div className="text-sm text-slate-500">{doctor.phone}</div>
                <div className="mt-1 text-xs text-slate-400">Requested {new Date(doctor.createdAt).toLocaleString()}</div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => setDeciding({ doctor, action: 'approve' })}>Approve</Button>
                  <Button variant="danger" onClick={() => setDeciding({ doctor, action: 'reject' })}>Reject</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {doctor.avatar ? (
                  <img src={doctor.avatar} alt={doctor.name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal/10 text-sm font-semibold text-brand-teal">
                    {doctor.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-slate-800">{doctor.name}</div>
                  <div className="text-xs text-slate-400">{doctor.specialization || 'General'}</div>
                </div>
              </div>
              {doctor.status === 'REJECTED' ? (
                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                  Rejected
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${doctor.isAvailable ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${doctor.isAvailable ? 'bg-brand-green' : 'bg-slate-400'}`} />
                  {doctor.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              )}
            </div>
            <div className="mt-3 text-sm text-slate-500">{doctor.email}</div>
            <div className="text-sm text-slate-500">{doctor.phone}</div>
            <div className="mt-3 flex gap-4 text-sm">
              <div><span className="font-semibold text-slate-800">{doctor.totalCases ?? 0}</span> <span className="text-slate-400">cases</span></div>
              <div><span className="font-semibold text-slate-800">{doctor.solvedCases ?? 0}</span> <span className="text-slate-400">solved</span></div>
              <div>
                <span className="font-semibold text-slate-800">{doctor.avgRating ? doctor.avgRating.toFixed(1) : '—'}</span>{' '}
                <span className="text-slate-400">rating{doctor.reviewCount ? ` (${doctor.reviewCount})` : ''}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => openEdit(doctor)}>Edit</Button>
              {doctor.status === 'REJECTED' ? (
                <Button variant="secondary" onClick={() => setDeciding({ doctor, action: 'approve' })}>Approve</Button>
              ) : (
                <Button variant="secondary" onClick={() => toggleAvailability(doctor)} disabled={togglingId === doctor.id}>
                  {togglingId === doctor.id ? 'Updating…' : doctor.isAvailable ? 'Mark unavailable' : 'Mark available'}
                </Button>
              )}
              <Button variant="danger" onClick={() => setDeleting(doctor)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
      {data && !doctors.length && <p className="py-6 text-center text-sm text-slate-400">No doctors found.</p>}

      <ConfirmDialog
        open={!!deciding}
        onClose={() => setDeciding(null)}
        onConfirm={handleDecision}
        title={deciding?.action === 'approve' ? 'Approve doctor' : 'Reject doctor'}
        description={
          deciding?.action === 'approve'
            ? `Approve ${deciding?.doctor.name}? They will be able to log in to the doctor app and receive cases, and they will get a notification.`
            : `Reject ${deciding?.doctor.name}'s request? They will not be able to log in, and they will get a notification.`
        }
        confirmLabel={deciding?.action === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={deciding?.action === 'approve' ? 'primary' : 'danger'}
        loading={decideBusy}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit doctor' : 'Add doctor'} footer={
        <>
          <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </>
      }>
        <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Phone">
          <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+919810000000" />
        </Field>
        <Field label="Specialization"><TextInput value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /></Field>
        <Field label="Experience (years)"><TextInput type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></Field>
        <Field label={editing?.id ? 'New password (leave blank to keep current)' : 'Login password (doctor signs in with email + this password)'}>
          <TextInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" autoComplete="new-password" />
        </Field>
        {formError && <ErrorMessage message={formError} />}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete doctor"
        description={`Delete ${deleting?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteBusy}
      />
    </div>
  );
}
