import { useState } from 'react';
import { api, apiErrorMessage } from '../lib/api';
import { useApiQuery } from '../hooks/useApiQuery';
import { useSocketEvent } from '../lib/socket';
import { toastSuccess, toastError } from '../store/toastStore';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { Select } from '../components/Field';
import { Loading, ErrorMessage } from '../components/Feedback';

const STATUSES = ['PENDING', 'COMPLETED'];

export default function AccountDeletionRequests() {
  const [status, setStatus] = useState('PENDING');
  const [completingId, setCompletingId] = useState(null);
  const { data, loading, error, refetch } = useApiQuery(
    () => api.get('/admin/account-deletion-requests', { params: { ...(status && { status }) } }),
    [status],
  );

  // Submitted from the public /account-deletion page - see public.routes.js.
  useSocketEvent('account_deletion_requested', refetch);

  async function handleComplete(request) {
    if (!window.confirm(`Permanently delete the account for ${request.phone}? This cannot be undone.`)) return;
    setCompletingId(request.id);
    try {
      const res = await api.post(`/admin/account-deletion-requests/${request.id}/complete`);
      toastSuccess(res.data.userDeleted ? 'Account deleted.' : 'Marked complete (no matching account was found).');
      refetch();
    } catch (err) {
      toastError(apiErrorMessage(err));
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Account Deletion Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submitted from the public account-deletion page (Google Play requires this). Confirm the phone number
          before completing - there's no SMS verification on that page yet.
        </p>
      </div>

      <div className="flex gap-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      <Card>
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {data && (
          <Table
            rowKey={(row) => row.id}
            emptyMessage="No deletion requests."
            columns={[
              { key: 'phone', header: 'Phone', render: (r) => <span className="font-mono text-sm">{r.phone}</span> },
              { key: 'matchedUser', header: 'Matched account', render: (r) => r.matchedUser?.name || <span className="text-slate-400">No account found</span> },
              { key: 'reason', header: 'Reason', render: (r) => r.reason || <span className="text-slate-400">—</span> },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'createdAt', header: 'Requested', render: (r) => new Date(r.createdAt).toLocaleString() },
              {
                key: 'action',
                header: '',
                render: (r) =>
                  r.status === 'PENDING' ? (
                    <Button variant="danger" disabled={completingId === r.id} onClick={() => handleComplete(r)}>
                      {completingId === r.id ? 'Deleting…' : 'Delete account'}
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400">{r.processedAt ? new Date(r.processedAt).toLocaleDateString() : ''}</span>
                  ),
              },
            ]}
            rows={data.data}
          />
        )}
      </Card>
    </div>
  );
}
