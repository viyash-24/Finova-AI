'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import { useUser } from '@clerk/nextjs';

interface CashFlowPoint {
  month: string;
  income: number;
  expenses: number;
}

interface DashboardData {
  income: number;
  expenses: number;
  savings: number;
  healthScore: number;
  cashFlow: CashFlowPoint[];
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const userName = user?.firstName || 'User';
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const [data, setData] = useState<DashboardData>({
    income: 0,
    expenses: 0,
    savings: 0,
    healthScore: 0,
    cashFlow: []
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [aiInsight, setAiInsight] = useState('Loading AI summary...');
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('http://localhost:8000/api/dashboard');
        if (res.ok) {
          const fetchedData = await res.json();
          setData(fetchedData);
        }
      } catch (err) {
        console.warn('Could not fetch dashboard metrics from backend. Using static fallback.', err);
      }

      try {
        const incRes = await fetch('http://localhost:8000/api/income/total');
        if (incRes.ok) {
          const incData = await incRes.json();
          setTotalIncome(incData.total || 0);
        }
      } catch {}

      // Dashboard Agent — quick summary from Expense Analysis + Savings Planner
      try {
        const res = await fetch('http://localhost:8000/api/ai/agent/dashboard');
        if (res.ok) {
          const agentData = await res.json();
          if (agentData.summary) {
            setAiInsight(agentData.summary);
          }
          if (agentData.recommendations && agentData.recommendations.length > 0) {
            setAiRecommendations(agentData.recommendations);
          }
        }
      } catch (err) {
        console.warn('Could not fetch AI dashboard summary.', err);
        setAiInsight('AI agents are currently unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  // Dynamic scale calculation
  const maxCashFlow = data.cashFlow.length > 0 
    ? Math.max(...data.cashFlow.map(f => Math.max(f.income, f.expenses))) 
    : 8000;
  const yMax = maxCashFlow > 0 ? maxCashFlow : 8000;
  const yLabels = [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0];
  const formatYLabel = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
    return val.toString();
  };

  // Helper to construct dynamic SVG path points
  const getCurvePath = (values: number[]) => {
    if (values.length === 0) return '';
    return values.map((val, idx) => {
      const x = values.length > 1 ? (idx / (values.length - 1)) * 100 : 50;
      const y = 90 - (val / yMax) * 80;
      return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };

  const incomePoints = data.cashFlow.map(f => f.income);
  const expensesPoints = data.cashFlow.map(f => f.expenses);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/20 via-slate-50 to-white">
      <TopHeader />

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-6">

          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
                Welcome back, {userName}
              </h1>
              <p className="text-[14px] text-slate-500 mt-0.5 font-medium">
                Here&apos;s your financial overview for {currentMonth}.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#f0fdf4] text-[#0f766e] px-4 py-2 rounded-full text-[13px] font-semibold border border-teal-100 shadow-sm">
              <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse"></span>
              All accounts synced
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* TOTAL INCOME */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between h-[180px]">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    TOTAL INCOME
                  </p>
                </div>
                <div className="flex justify-between items-start mt-2 gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[28px] font-bold text-slate-900 leading-none tracking-tight truncate" title={`Rs. ${totalIncome.toLocaleString()}`}>
                      Rs. {totalIncome.toLocaleString()}
                    </h2>
                    <p className="text-[13px] text-slate-400 mt-1.5 font-medium truncate">
                      {totalIncome > 0 ? 'All-time total earnings' : 'No income logged'}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#10b981] flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                    <span className="material-symbols-outlined text-white text-[20px] font-semibold">north_east</span>
                  </div>
                </div>
              </div>
              {totalIncome > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-[#f0fdf4] text-[#15803d] px-2 py-0.5 rounded-lg text-[12px] font-bold border border-emerald-100">
                    <span className="material-symbols-outlined text-[14px] font-bold">north_east</span>
                    Live
                  </div>
                  <span className="text-[13px] text-slate-400 font-medium">from income tracker</span>
                </div>
              )}
            </div>

            {/* TOTAL EXPENSES */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between h-[180px]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  TOTAL EXPENSES
                </p>
                <div className="flex justify-between items-start mt-2 gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[28px] font-bold text-slate-900 leading-none tracking-tight truncate" title={`Rs. ${data.expenses.toLocaleString()}`}>
                      Rs. {data.expenses.toLocaleString()}
                    </h2>
                    <p className="text-[13px] text-slate-400 mt-1.5 font-medium truncate">
                      {data.expenses > 0 ? 'Below avg by Rs. 260' : 'No expenses logged'}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                    <span className="material-symbols-outlined text-slate-800 text-[20px] font-semibold">trending_down</span>
                  </div>
                </div>
              </div>
              {data.expenses > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-[#fef2f2] text-[#b91c1c] px-2 py-0.5 rounded-lg text-[12px] font-bold border border-red-100">
                    <span className="material-symbols-outlined text-[14px] font-bold">south_west</span>
                    4.5%
                  </div>
                  <span className="text-[13px] text-slate-400 font-medium">vs last month</span>
                </div>
              )}
            </div>

            {/* TOTAL SAVINGS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between h-[180px]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  TOTAL SAVINGS
                </p>
                <div className="flex justify-between items-start mt-2 gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[28px] font-bold text-slate-900 leading-none tracking-tight truncate" title={`Rs. ${data.savings.toLocaleString()}`}>
                      Rs. {data.savings.toLocaleString()}
                    </h2>
                    <p className="text-[13px] text-slate-400 mt-1.5 font-medium truncate">
                      {data.savings > 0 ? "Lifetime balance" : "No savings logged"}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
                    <span className="material-symbols-outlined text-white text-[20px]">savings</span>
                  </div>
                </div>
              </div>
              {data.savings > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-[#f0fdf4] text-[#15803d] px-2 py-0.5 rounded-lg text-[12px] font-bold border border-emerald-100">
                    <span className="material-symbols-outlined text-[14px] font-bold">north_east</span>
                    8.1%
                  </div>
                  <span className="text-[13px] text-slate-400 font-medium">vs last month</span>
                </div>
              )}
            </div>

            {/* HEALTH SCORE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between h-[180px]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  HEALTH SCORE
                </p>
                <div className="flex justify-between items-start mt-2 gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[28px] font-bold text-slate-900 leading-none tracking-tight truncate" title={`${data.healthScore} / 100`}>
                      {data.healthScore} <span className="text-[18px] text-slate-300 font-medium">/ 100</span>
                    </h2>
                    <p className="text-[13px] text-slate-400 mt-1.5 font-medium truncate">
                      {data.healthScore > 0 ? "Excellent standing" : "No score available"}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                    <span className="material-symbols-outlined text-slate-700 text-[20px]">credit_card</span>
                  </div>
                </div>
              </div>
              {data.healthScore > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-[#f0fdf4] text-[#15803d] px-2 py-0.5 rounded-lg text-[12px] font-bold border border-emerald-100">
                    <span className="material-symbols-outlined text-[14px] font-bold">north_east</span>
                    2%
                  </div>
                  <span className="text-[13px] text-slate-400 font-medium">vs last month</span>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Grid: Monthly Cash Flow & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Monthly Cash Flow line chart card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900">Monthly Cash Flow</h3>
                  <p className="text-[13px] text-slate-400 mt-0.5 font-medium">Income vs expenses over time</p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    <span className="text-[12px] font-semibold text-slate-600">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span className="text-[12px] font-semibold text-slate-600">Expenses</span>
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="h-[280px] relative">
                {/* Horizontal dotted grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                  {yLabels.map((val, idx) => (
                    <div key={idx} className="flex items-center w-full">
                      <span className="text-[11px] font-semibold text-slate-400 w-10 text-left">{formatYLabel(val)}</span>
                      <div className="flex-1 border-t border-dashed border-slate-200/80"></div>
                    </div>
                  ))}
                </div>

                {/* SVG Curve lines */}
                {data.cashFlow.length > 0 && (
                  <div className="absolute left-10 right-0 top-0 bottom-8">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Income curve (Green) */}
                      <path
                        d={getCurvePath(incomePoints)}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Expenses curve (Blue) */}
                      <path
                        d={getCurvePath(expensesPoints)}
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="1 3"
                      />
                    </svg>
                  </div>
                )}

                {/* X-Axis labels */}
                <div className="absolute bottom-0 left-10 right-0 flex justify-between px-2">
                  {data.cashFlow.map((f) => (
                    <span key={f.month} className="text-[11px] font-bold text-slate-400">{f.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 shadow-sm shadow-sky-500/5">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-900">AI Insights</h3>
                    <p className="text-[12px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Expense + Savings Agents</p>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 mt-4">
                  <p
                    className="text-[14px] leading-relaxed text-slate-600 font-medium whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: aiInsight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                    }}
                  />
                </div>

                {/* Recommendations */}
                {aiRecommendations.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {aiRecommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                        <span className="material-symbols-outlined text-sky-500 text-[16px] mt-0.5 shrink-0">tips_and_updates</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Signature block */}
              <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-300">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Finova Intelligence v1.0</span>
                <span className="material-symbols-outlined text-[16px] text-slate-300 animate-pulse">lock</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}