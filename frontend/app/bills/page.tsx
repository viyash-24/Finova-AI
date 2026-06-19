'use client';

import { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import { useAuth, useUser } from '@clerk/nextjs';
import { apiFetch } from '@/lib/apiFetch';
import { needsAiRefresh, readAiCache, writeAiCache } from '@/lib/smartAiCache';

interface Bill {
  id: string;
  name: string;
  provider: string;
  amount: number;
  dueDate: string;
  status: string;
  icon: string;
}

export default function BillsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [bills, setBills] = useState<Bill[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [icon, setIcon] = useState('receipt_long');
  const [aiAdvice, setAiAdvice] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchBills = async () => {
    try {
      const res = await apiFetch(getToken, 'http://localhost:8000/api/bills');
      if (res.ok) {
        const data = await res.json();
        setBills(data);
      }
    } catch (err) {
      console.warn('Could not fetch bills from backend. Using empty list fallback.', err);
    }
  };

  const AI_KEY = 'bills';

  const fetchBillAgent = async () => {
    const userId = user?.id;
    if (!userId) return;

    // Show cached result IMMEDIATELY
    const cached = readAiCache(userId, AI_KEY);
    if (cached) {
      setAiAdvice(cached.data as any);
    }

    // Fetch fingerprint in parallel with bills (bills fetch happens in useEffect)
    let incomeCount = 0;
    let expenseCount = 0;

    setAiLoading(true);
    try {
      const res = await apiFetch(getToken, 'http://localhost:8000/api/ai/agent/bills');
      if (res.ok) {
        const data = await res.json();
        setAiAdvice(data);
        if (data.summary && !data.summary.includes('Unable to analyze')) {
          writeAiCache(userId, AI_KEY, data, incomeCount, expenseCount);
        }
      }
    } catch (err) {
      console.warn('Could not fetch bill reminder agent advice.', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    if (user?.id) fetchBillAgent();
  }, [getToken, user?.id]);

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0) return;

    try {
      const res = await apiFetch(getToken, 'http://localhost:8000/api/bills', {
        method: 'POST',
        body: JSON.stringify({
          name,
          provider,
          amount: parsedAmount,
          dueDate: dueDate || 'Aug 25',
          icon
        }),
      });
      if (res.ok) {
        const newBill = await res.json();
        setBills((prev) => [...prev, newBill]);
        setName('');
        setProvider('');
        setAmount('');
        setDueDate('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to add bill:', err);
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      const res = await apiFetch(getToken, `http://localhost:8000/api/bills/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBills((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete bill:', err);
    }
  };

  const handlePayBill = async (id: string) => {
    // Dynamically mark as paid locally for demo
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'paid' } : b))
    );
  };

  const upcoming = bills.filter((b) => b.status === 'upcoming');
  const paid = bills.filter((b) => b.status === 'paid');
  const totalUpcoming = upcoming.reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = paid.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/20 via-slate-50 to-white">
      <TopHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Bills & Subscriptions</h1>
              <p className="text-[14px] text-slate-500 mt-0.5 font-medium">Manage upcoming payments and subscriptions</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="h-10 px-4 flex items-center gap-2 bg-sky-500 text-white rounded-xl text-[13px] font-bold hover:bg-sky-600 transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {showAddForm ? 'Cancel' : 'Add Bill'}
            </button>
          </div>

          {/* Add Bill Form Card */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_35px_rgba(59,130,246,0.04)] mb-8 animate-fade-in-up">
              <h3 className="text-[16px] font-bold text-slate-900 mb-6">Add New Bill</h3>
              <form onSubmit={handleAddBill} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Bill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Netflix"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. Comcast"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 25"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="h-11 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-[14px] font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                    Create Bill
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Upcoming Total</p>
              <h2 className="text-[28px] font-bold text-slate-900">Rs. {totalUpcoming.toFixed(2)}</h2>
              <p className="text-[13px] text-slate-400 mt-2 font-medium">{upcoming.length} bills due this month</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Paid This Month</p>
              <h2 className="text-[28px] font-bold text-emerald-500">Rs. {totalPaid.toFixed(2)}</h2>
              <p className="text-[13px] text-slate-400 mt-2 font-medium">{paid.length} bills paid</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Active Subscriptions</p>
              <h2 className="text-[28px] font-bold text-slate-900">{bills.length}</h2>
              <p className="text-[13px] text-slate-400 mt-2 font-medium">Rs. {(totalUpcoming + totalPaid).toFixed(2)}/month total</p>
            </div>
          </div>

          {/* Bill Reminder Agent Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-amber-500">notifications_active</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Bill Reminder Agent</h3>
                <p className="text-[12px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">AI-powered reminders</p>
              </div>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <span className="text-[13px] text-slate-500 font-medium">Bill agent scanning your payments...</span>
              </div>
            ) : aiAdvice ? (
              <div>
                <p
                  className="text-[14px] text-slate-600 font-medium leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: aiAdvice.summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                  }}
                />
                {aiAdvice.recommendations && aiAdvice.recommendations.length > 0 && (
                  <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                    {aiAdvice.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                        <span className="material-symbols-outlined text-amber-500 text-[16px] mt-0.5 shrink-0">tips_and_updates</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400 font-medium">No AI advice available. Make sure the AI service is running.</p>
            )}
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/20">
              <h3 className="text-[16px] font-bold text-slate-900">Upcoming Bills</h3>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg uppercase tracking-wider">
                {upcoming.length} Due
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {upcoming.length > 0 ? (
                upcoming.map((bill) => (
                  <div key={bill.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-sky-500">{bill.icon || 'receipt_long'}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-800">{bill.name}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5 font-medium">{bill.provider} • Due {bill.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[14px] font-bold text-slate-900">Rs. {bill.amount.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePayBill(bill.id)}
                          className="h-8 px-3 text-[12px] font-bold bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill.id)}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[13px] font-medium text-slate-400">
                  No upcoming bills due.
                </div>
              )}
            </div>
          </div>

          {/* Paid Bills */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/20">
              <h3 className="text-[16px] font-bold text-slate-900">Paid</h3>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg uppercase tracking-wider">
                Complete
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {paid.length > 0 ? (
                paid.map((bill) => (
                  <div key={bill.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors opacity-75">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-slate-400">{bill.icon || 'receipt_long'}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-800">{bill.name}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5 font-medium">{bill.provider} • Paid {bill.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[14px] font-semibold text-slate-900">Rs. {bill.amount.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
                        <button
                          onClick={() => handleDeleteBill(bill.id)}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[13px] font-medium text-slate-400">
                  No completed payments this month.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
