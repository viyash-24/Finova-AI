'use client';

import { useState, useEffect, useMemo } from 'react';
import TopHeader from '@/components/TopHeader';
import { toast } from 'react-toastify';

interface Expense {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
}

const categories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping'];

export default function ExpensesPage() {
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('0.00');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-05-29');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All categories');

  // Fetch expenses from backend on mount
  const fetchExpenses = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenseList(data);
      }
    } catch (err) {
      console.warn('Could not fetch expenses from backend. Using empty list fallback.', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handles adding a new expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!description.trim()) return;

    try {
      const res = await fetch('http://localhost:8000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          category,
          amount: parsedAmount,
          date,
        }),
      });
      if (res.ok) {
        const newExpense = await res.json();
        setExpenseList((prev) => [newExpense, ...prev]);
        setAmount('0.00');
        setDescription('');
        toast.success('Expense added successfully');
      }
    } catch (err) {
      console.error('Failed to add expense to backend:', err);
    }
  };

  // Handles deleting an expense
  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExpenseList((prev) => prev.filter((exp) => exp.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete expense from backend:', err);
    }
  };

  // Filtered expense list based on search and category filter
  const filteredExpenses = useMemo(() => {
    return expenseList.filter((exp) => {
      const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'All categories' || exp.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [expenseList, searchQuery, selectedCategoryFilter]);

  // Dynamically calculate the filtered total sum
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/20 via-slate-50 to-white">
      <TopHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-6">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Expenses</h1>
              <p className="text-[14px] text-slate-500 mt-0.5 font-medium">Track and manage every transaction.</p>
            </div>
            <div className="bg-slate-100/80 text-slate-700 px-4 py-2.5 rounded-full text-[13px] font-bold border border-slate-200/40 shadow-sm">
              Total filtered: Rs. {filteredTotal.toFixed(2)}
            </div>
          </div>

          {/* Add Expense Form Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_35px_rgba(59,130,246,0.04)] mb-8">
            <h3 className="text-[16px] font-bold text-slate-900 mb-6">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Amount */}
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Amount</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => {
                      if (amount === '0.00') setAmount('');
                    }}
                    onBlur={() => {
                      if (amount.trim() === '') setAmount('0.00');
                    }}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="What was it for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button aligned to right */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="h-11 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-[14px] font-bold shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                  Add Expense
                </button>
              </div>
            </form>
          </div>

          {/* Transactions List Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_35px_rgba(59,130,246,0.04)] overflow-hidden">
            {/* Filter controls header */}
            <div className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between border-b border-slate-100">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                />
              </div>

              <div className="relative w-full md:w-48">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full h-10 pl-4 pr-10 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="All categories">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[16px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Table structure */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider bg-slate-50/40">
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-[14px] font-semibold text-slate-800">{exp.description}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 bg-sky-50 text-sky-700 text-[12px] font-bold rounded-full border border-sky-100/50">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] text-slate-500 font-medium">{exp.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[14px] font-bold text-slate-900">Rs. {exp.amount.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 text-[14px] font-medium">
                        No transactions found.
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
