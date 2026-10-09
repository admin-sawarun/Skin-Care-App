import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, apiErrorMessage } from '../lib/api';
import { useApiQuery } from '../hooks/useApiQuery';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { toastError, toastSuccess } from '../store/toastStore';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { TextInput, Select } from '../components/Field';
import { Loading, ErrorMessage } from '../components/Feedback';

const PAYMENT_STATUSES = ['CREATED', 'PAID', 'FAILED', 'REFUNDED'];

export default function Payments() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [refundTarget, setRefundTarget] = useState(null);
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState(null);

  const debouncedSearch = useDebouncedValue(search);
  const filters = { ...(debouncedSearch && { search: debouncedSearch }), ...(status && { status }) };
  const { data, loading, error, refetch } = useApiQuery(
    () => api.get('/admin/payments', { params: { page, limit: 20, ...filters } }),
    [debouncedSearch, status, page],
  );

  async function handleRefund() {
    if (!refundTarget) return;
    setRefunding(true);
    setRefundError(null);
    try {
      await api.post(`/admin/payments/${refundTarget.id}/refund`);
      toastSuccess('Payment refunded.');
      setRefundTarget(null);
      await refetch();
    } catch (err) {
      setRefundError(apiErrorMessage(err));
      toastError(apiErrorMessage(err));
    } finally {
      setRefunding(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Every case-submission payment, who it belongs to, and its refund status.</p>
      </div>

      <Card>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TextInput placeholder="Search by user name/phone" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
          <Select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="">All statuses</option>
            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {data && (
          <>
            <Table
              rowKey={(row) => row.id}
              emptyMessage="No payments yet."
              columns={[
                { key: 'user', header: 'User', render: (p) => (
                  <div>
                    <div className="font-medium text-slate-800">{p.user?.name || '—'}</div>
                    <div className="text-xs text-slate-400">{p.user?.phone}</div>
                  </div>
                ) },
                { key: 'amount', header: 'Amount', render: (p) => `₹${(p.amount / 100).toFixed(2)}` },
                { key: 'status', header: 'Payment', render: (p) => <StatusBadge status={p.status} /> },
                { key: 'case', header: 'Case', render: (p) => p.case ? (
                  <Link to={`/cases/${p.case.id}`} className="font-mono text-xs text-brand-teal hover:underline">
                    SKC-{p.case.id.slice(0, 6).toUpperCase()}
                  </Link>
                ) : <span className="text-xs text-slate-400">Not submitted</span> },
                { key: 'caseStatus', header: 'Case status', render: (p) => p.case ? <StatusBadge status={p.case.status} /> : '—' },
                { key: 'doctor', header: 'Doctor', render: (p) => p.case?.doctor?.name || '—' },
                { key: 'createdAt', header: 'Date', render: (p) => new Date(p.createdAt).toLocaleDateString() },
                {
                  key: 'actions',
                  header: '',
                  render: (p) => p.status === 'PAID' ? (
                    <button
                      type="button"
                      onClick={() => { setRefundTarget(p); setRefundError(null); }}
                      className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Refund
                    </button>
                  ) : null,
                },
              ]}
              rows={data.data}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>Page {data.page} of {data.totalPages || 1} · {data.total} payments</span>
              <div className="flex gap-2">
                <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="secondary" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Modal
        open={!!refundTarget}
        onClose={() => !refunding && setRefundTarget(null)}
        title="Refund this payment?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRefundTarget(null)} disabled={refunding}>Cancel</Button>
            <Button onClick={handleRefund} disabled={refunding}>{refunding ? 'Refunding…' : 'Confirm refund'}</Button>
          </>
        }
      >
        {refundTarget && (
          <div className="text-sm text-slate-600">
            <p>
              Refund ₹{(refundTarget.amount / 100).toFixed(2)} to <strong>{refundTarget.user?.name}</strong> ({refundTarget.user?.phone})?
            </p>
            <p className="mt-2 text-xs text-slate-400">This goes straight through Razorpay and cannot be undone.</p>
            {refundError && <p className="mt-3 text-sm text-red-600">{refundError}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
