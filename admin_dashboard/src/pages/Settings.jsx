import { useState } from 'react';
import { api, apiErrorMessage } from '../lib/api';
import { useApiQuery } from '../hooks/useApiQuery';
import { useAuthStore } from '../store/authStore';
import { toastSuccess, toastError } from '../store/toastStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Field, { TextInput } from '../components/Field';
import { Loading, ErrorMessage } from '../components/Feedback';

function emptyAdminForm() {
  return { name: '', email: '', password: '' };
}

// Only the super admin (the originally-seeded account) can see or use this -
// it's not a general permission tier, just one account able to create more.
function AdminAccounts() {
  const { data, loading, error, refetch } = useApiQuery(() => api.get('/admin/admins'), []);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyAdminForm());
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm(emptyAdminForm());
    setFormError(null);
    setCreating(true);
  }

  async function handleCreate() {
    setSaving(true);
    setFormError(null);
    try {
      await api.post('/admin/admins', form);
      setCreating(false);
      toastSuccess('Admin account created.');
      refetch();
    } catch (err) {
      const message = apiErrorMessage(err);
      setFormError(message);
      toastError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600">Admin accounts</h3>
        <Button onClick={openCreate}>+ Add admin</Button>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {data && (
        <div className="divide-y divide-slate-100">
          {data.data.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-sm font-medium text-slate-800">{a.name}</div>
                <div className="text-xs text-slate-400">{a.email}</div>
              </div>
              {a.isSuperAdmin && (
                <span className="rounded-full border border-brand-teal/20 bg-brand-teal/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  Super admin
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add admin"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating…' : 'Create'}</Button>
          </>
        }
      >
        <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Login password">
          <TextInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" autoComplete="new-password" />
        </Field>
        {formError && <ErrorMessage message={formError} />}
      </Modal>
    </Card>
  );
}

export default function Settings() {
  const admin = useAuthStore((s) => s.admin);
  const updateAdmin = useAuthStore((s) => s.updateAdmin);

  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    try {
      const { data } = await api.put('/admin/profile', { name, email });
      updateAdmin(data.admin);
      toastSuccess('Profile updated.');
    } catch (err) {
      const message = apiErrorMessage(err);
      setProfileError(message);
      toastError(message);
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError(null);
    try {
      await api.put('/admin/profile/password', { oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      toastSuccess('Password changed.');
    } catch (err) {
      const message = apiErrorMessage(err);
      setPasswordError(message);
      toastError(message);
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-800">Settings</h1>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-600">Profile</h3>
        <form onSubmit={handleProfileSave}>
          <Field label="Name"><TextInput required value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email"><TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          {profileError && <div className="mb-3"><ErrorMessage message={profileError} /></div>}
          <Button type="submit" disabled={profileSaving}>{profileSaving ? 'Saving…' : 'Save profile'}</Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-600">Change password</h3>
        <form onSubmit={handlePasswordChange}>
          <Field label="Current password"><TextInput type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></Field>
          <Field label="New password"><TextInput type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></Field>
          {passwordError && <div className="mb-3"><ErrorMessage message={passwordError} /></div>}
          <Button type="submit" disabled={passwordSaving}>{passwordSaving ? 'Saving…' : 'Change password'}</Button>
        </form>
      </Card>

      {admin?.isSuperAdmin && <AdminAccounts />}
    </div>
  );
}
