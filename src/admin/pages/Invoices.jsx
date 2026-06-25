import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, FileText, Send, AlertCircle, X, CheckCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../lib/api';

const emptyInvoice = {
  customer_id: '',
  job_id: '',
  amount: '',
  tax: '',
  total: '',
  due_date: '',
  notes: '',
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyInvoice);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [invData, custData] = await Promise.all([
        apiGet('/api/invoices'),
        apiGet('/api/customers'),
      ]);
      setInvoices(invData);
      setCustomers(custData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm({
      ...emptyInvoice,
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.customer_id) { setError('Customer required'); return; }
    const amount = parseFloat(form.amount) || 0;
    const tax = parseFloat(form.tax) || 0;
    const total = form.total ? parseFloat(form.total) : (amount + tax);
    if (amount <= 0) { setError('Amount must be positive'); return; }
    setSaving(true); setError('');
    try {
      await apiPost('/api/invoices', {
        customer_id: parseInt(form.customer_id, 10),
        job_id: form.job_id ? parseInt(form.job_id, 10) : null,
        amount, tax, total,
        due_date: form.due_date || null,
        notes: form.notes,
      });
      setShowModal(false); load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleSend = async (inv) => {
    try {
      await apiPut(`/api/invoices/${inv.id}`, { status: 'sent' });
      load();
    } catch (e) { alert('Send failed: ' + e.message); }
  };

  const handleMarkPaid = async (inv) => {
    try {
      await apiPost(`/api/invoices/${inv.id}/payments`, {
        amount: inv.total,
        method: 'manual',
        notes: 'Marked as paid from admin',
      });
      load();
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid' && i.status !== 'voided')
    .reduce((s, i) => s + parseFloat(i.total || 0), 0);
  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((s, i) => s + parseFloat(i.total || 0), 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">{invoices.length} invoices</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">Outstanding</div>
          <div className="text-2xl font-bold text-gray-900">${totalOutstanding.toLocaleString()}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">Paid (lifetime)</div>
          <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">Total Invoices</div>
          <div className="text-2xl font-bold text-brand-copper">{invoices.length}</div>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No invoices yet. Create your first.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Issued</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{inv.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inv.issue_date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inv.due_date || '—'}</td>
                    <td className="px-4 py-3 text-sm font-medium">${parseFloat(inv.total).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        inv.status === 'paid' ? 'badge-green' :
                        inv.status === 'overdue' ? 'badge-red' :
                        inv.status === 'sent' ? 'badge-blue' :
                        inv.status === 'voided' ? 'badge-gray' :
                        'badge-yellow'
                      }`}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.status === 'draft' && (
                        <button onClick={() => handleSend(inv)} className="text-xs text-blue-600 hover:text-blue-700 mr-3 flex items-center gap-1 inline-flex">
                          <Send className="w-3 h-3" /> Send
                        </button>
                      )}
                      {inv.status !== 'paid' && inv.status !== 'voided' && (
                        <button onClick={() => handleMarkPaid(inv)} className="text-xs text-green-600 hover:text-green-700 inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">New Invoice</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Customer *</label>
                <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} className="input" required>
                  <option value="">Select customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tax</label>
                  <input type="number" step="0.01" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                  <input type="number" step="0.01" value={form.total || ((parseFloat(form.amount) || 0) + (parseFloat(form.tax) || 0))} onChange={(e) => setForm({ ...form, total: e.target.value })} className="input bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Create Invoice'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}