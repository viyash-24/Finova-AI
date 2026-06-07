'use client';

import { useState, useEffect, useMemo } from 'react';
import TopHeader from '@/components/TopHeader';
import { toast } from 'react-toastify';

interface Income {
  id: string;
  source: string;
  amount: number;
  type: string;
  date: string;
  note?: string;
}

const incomeTypes = ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Other'];

export default function IncomePage() {
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  // Form state
  const [amount, setAmount] = useState('0.00');
  const [type, setType] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All types');

  const fetchIncomes = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/income');
      if (res.ok) {
        const data = await res.json();
        setIncomeList(data);
      }
    } catch (err) {
      console.warn('Could not fetch income from backend.', err);
    }
  };

  const fetchTotal = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/income/total');
      if (res.ok) {
        const data = await res.json();
        setTotalIncome(data.total || 0);
      }
    } catch (err) {
      console.warn('Could not fetch income total.', err);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchTotal();
  }, []);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: type,
          amount: parsedAmount,
          type,
          date,
          note: note.trim() || null,
        }),
      });
      if (res.ok) {
        const newIncome = await res.json();
        setIncomeList((prev) => [newIncome, ...prev]);
        setTotalIncome((prev) => prev + parsedAmount);
        setAmount('0.00');
        setNote('');
        toast.success('Income added successfully! 🎉');
      } else {
        toast.error('Failed to add income. Please try again.');
      }
    } catch (err) {
      console.error('Failed to add income:', err);
      toast.error('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/income/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const deleted = incomeList.find((i) => i.id === id);
        setIncomeList((prev) => prev.filter((i) => i.id !== id));
        if (deleted) setTotalIncome((prev) => prev - deleted.amount);
        toast.success('Income entry removed.');
      }
    } catch (err) {
      console.error('Failed to delete income:', err);
      toast.error('Could not delete entry.');
    }
  };

  const filteredIncomes = useMemo(() => {
    return incomeList.filter((inc) => {
      const matchesSearch = inc.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (inc.note && inc.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedTypeFilter === 'All types' || inc.type === selectedTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [incomeList, searchQuery, selectedTypeFilter]);

  const filteredTotal = useMemo(() => {
    return filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  }, [filteredIncomes]);

  const typeColors: Record<string, string> = {
    Salary: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Freelance: 'bg-sky-50 text-sky-700 border-sky-100',
    Business: 'bg-violet-50 text-violet-700 border-violet-100',
    Investment: 'bg-amber-50 text-amber-700 border-amber-100',
    Rental: 'bg-orange-50 text-orange-700 border-orange-100',
    Gift: 'bg-pink-50 text-pink-700 border-pink-100',
    Other: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50/20 via-slate-50 to-white">
      <TopHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-6">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Income</h1>
              <p className="text-[14px] text-slate-500 mt-0.5 font-medium">
                Track all your income sources in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-full text-[13px] font-bold border border-emerald-100 shadow-sm">
                Total: Rs. {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              {searchQuery || selectedTypeFilter !== 'All types' ? (
                <div className="bg-slate-100/80 text-slate-700 px-4 py-2.5 rounded-full text-[13px] font-bold border border-slate-200/40 shadow-sm">
                  Filtered: Rs. {filteredTotal.toFixed(2)}
                </div>
              ) : null}
            </div>
          </div>

          {/* Add Income Form Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_35px_rgba(16,185,129,0.05)] mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">add_circle</span>
              </div>
              <h3 className="text-[16px] font-bold text-slate-900">Add Income</h3>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Amount */}
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">
                    Amount (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => { if (amount === '0.00') setAmount(''); }}
                    onBlur={() => { if (amount.trim() === '') setAmount('0.00'); }}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Type</label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all appearance-none cursor-pointer"
                    >
                      {incomeTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all cursor-pointer"
                  />
                </div>

                {/* Note */}
                <div className="lg:col-span-2">
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Note (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly salary, Q1 bonus..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-[14px] font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                  {isSubmitting ? 'Adding...' : 'Add Income'}
                </button>
              </div>
            </form>
          </div>

          {/* Income List Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_35px_rgba(16,185,129,0.04)] overflow-hidden">
            {/* Filter header */}
            <div className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between border-b border-slate-100">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search income sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                />
              </div>

              <div className="relative w-full md:w-48">
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="w-full h-10 pl-4 pr-10 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="All types">All types</option>
                  {incomeTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[16px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider bg-slate-50/40">
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredIncomes.length > 0 ? (
                    filteredIncomes.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 text-[12px] font-bold rounded-full border ${typeColors[inc.type] || typeColors['Other']}`}>
                            {inc.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] text-slate-500 font-medium">{inc.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] text-slate-400 font-medium">
                            {inc.note || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[14px] font-bold text-emerald-600">
                            +Rs. {inc.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDeleteIncome(inc.id)}
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors"
                              title="Delete income"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-14">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-400 text-[28px]">payments</span>
                          </div>
                          <p className="text-slate-400 text-[14px] font-medium">No income entries found.</p>
                          <p className="text-slate-300 text-[13px]">Add your first income source above.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
