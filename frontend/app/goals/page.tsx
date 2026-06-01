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
