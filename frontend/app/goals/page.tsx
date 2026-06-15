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
  const [aiAdvice, setAiAdvice] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

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

  const SESSION_KEY = 'finova_goals_ai';

  const fetchSavingsAgent = async () => {
    // Check sessionStorage first — only call Gemini if no cached result exists for this session
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try {
        setAiAdvice(JSON.parse(cached));
        return;
      } catch {}
    }

    setAiLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/ai/agent/goals');
      if (res.ok) {
        const data = await res.json();
        setAiAdvice(data);
        // Unconditionally cache results (even errors) to prevent hammering the API when quota is exhausted
        if (data.summary) {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('Could not fetch savings agent advice.', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchSavingsAgent();
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
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Target Amount (Rs.)</label>
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
                  <label className="text-[12px] font-bold text-slate-700 block mb-2">Current Saved (Rs.)</label>
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Active Goals</p>
              <h2 className="text-[28px] font-bold text-slate-900">{goals.length}</h2>
              <p className="text-[13px] text-slate-400 mt-2 font-medium">Average progress {avgProgress}%</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Total Saved</p>
              <h2 className="text-[28px] font-bold text-slate-900">Rs. {totalSaved.toLocaleString()}</h2>
              <div className="flex items-center gap-1 mt-2 text-emerald-500 text-[13px] font-semibold">
                <span className="material-symbols-outlined text-[16px]">north_east</span>
                of Rs. {totalTarget.toLocaleString()} goal target
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Monthly Contribution</p>
              <h2 className="text-[28px] font-bold text-slate-900">
                Rs. {goals.length > 0 ? '850' : '0'}
              </h2>
              <p className="text-[13px] text-slate-400 mt-2 font-medium">
                {goals.length > 0 ? 'Auto-transfers enabled' : 'Auto-transfers disabled'}
              </p>
            </div>
          </div>

          {/* Savings Planner Agent Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-emerald-500">psychology</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Savings Planner Agent</h3>
                <p className="text-[12px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">AI-powered advice</p>
              </div>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="text-[13px] text-slate-500 font-medium">Savings agent analyzing your goals...</span>
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
                        <span className="material-symbols-outlined text-emerald-500 text-[16px] mt-0.5 shrink-0">tips_and_updates</span>
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

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.length > 0 ? (
              goals.map((goal) => {
                const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                return (
                  <div key={goal.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group relative">
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[22px] text-sky-500">{goal.icon || 'shield'}</span>
                        </div>
                        <div>
                          <h3 className="text-[16px] font-bold text-slate-800">{goal.name}</h3>
                          <p className="text-[12px] text-slate-400 mt-0.5 font-medium">{pct}% complete</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-slate-800">Rs. {goal.current.toLocaleString()}</span>
                      <span className="text-[13px] text-slate-400 font-semibold">of Rs. {goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 py-12 text-center text-[14px] font-medium text-slate-400">
                No active savings goals found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
