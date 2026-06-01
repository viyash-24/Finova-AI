'use client';

import { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('shield');

  const fetchGoals = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/goals');
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.warn('Could not fetch goals from backend. Using empty list fallback.', err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(target);
    const parsedCurrent = parseFloat(current || '0');
    if (!name || isNaN(parsedTarget) || parsedTarget <= 0) return;

    try {
      const res = await fetch('http://localhost:8000/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          target: parsedTarget,
          current: parsedCurrent,
          deadline: deadline || 'Dec 2026',
          icon
        }),
      });
      if (res.ok) {
        const newGoal = await res.json();
        setGoals((prev) => [...prev, newGoal]);
        setName('');
        setTarget('');
        setCurrent('');
        setDeadline('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to add goal:', err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/goals/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const avgProgress = goals.length > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/20 via-slate-50 to-white">
      <TopHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Goals</h1>
              <p className="text-[14px] text-slate-500 mt-0.5 font-medium">Track progress toward your financial goals</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="h-10 px-4 flex items-center gap-2 bg-sky-500 text-white rounded-xl text-[13px] font-bold hover:bg-sky-600 transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {showAddForm ? 'Cancel' : 'New Goal'}
            </button>
          </div>

          {/* Add Goal Form Card */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_35px_rgba(59,130,246,0.04)] mb-8 animate-fade-in-up">
              <h3 className="text-[16px] font-bold text-slate-900 mb-6">Create New Goal</h3>
              <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dream House"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Target Amount ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Current Saved ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 2026"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                  />
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="h-11 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-[14px] font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          )}
