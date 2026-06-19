'use client';

import { useState, useEffect, useMemo } from 'react';
import TopHeader from '@/components/TopHeader';
import { useAuth, useUser } from '@clerk/nextjs';
import { apiFetch } from '@/lib/apiFetch';
import { needsAiRefresh, readAiCache, writeAiCache } from '@/lib/smartAiCache';

interface MonthDataPoint {
  label: string;
  income: number;
  expenses: number;
}

interface AIInsightData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Expense {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#0ea5e9', // Blue
  Food: '#10b981', // Green
  Transport: '#a855f7', // Purple
  Entertainment: '#f59e0b', // Orange/Yellow
  Shopping: '#f43f5e', // Rose/Red
  Other: '#64748b', // Grey
};

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Dress', 'Other'];

export default function AnalyticsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [updatedTime, setUpdatedTime] = useState('loading...');

  const [monthsData, setMonthsData] = useState<MonthDataPoint[]>([]);
  const [insights, setInsights] = useState<AIInsightData[]>([]);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [agentExpense, setAgentExpense] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [agentSavings, setAgentSavings] = useState<{ summary: string; recommendations: string[] } | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      const res = await apiFetch(getToken, 'http://localhost:8000/api/dashboard');
      if (res.ok) {
        const d = await res.json();
        if (d.cashFlow && d.cashFlow.length > 0) {
          const mapped = d.cashFlow.map((item: any) => ({
            label: item.month,
            income: item.income,
            expenses: item.expenses,
          }));
          setMonthsData(mapped);
        }
      }
    } catch (err) {
      console.warn('Could not fetch chart coordinates from backend.', err);
    }

    try {
      const res = await apiFetch(getToken, 'http://localhost:8000/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenseList(data);
      }
    } catch (err) {
      console.warn('Could not fetch expenses for category breakdown.', err);
    }
  };

  const AI_KEY = 'analytics';

  const _applyAgentData = (data: any) => {
    setAgentExpense(data.expense || null);
    setAgentSavings(data.savings || null);
    const recs = data.recommendations || [];
    const icons = ['auto_awesome', 'restaurant', 'local_taxi', 'savings', 'trending_up'];
    const mapped: AIInsightData[] = recs.map((rec: string, idx: number) => ({
      id: String(idx),
      title: rec.length > 80 ? rec.substring(0, 77) + '...' : rec,
      description: rec,
      icon: icons[idx % icons.length],
    }));
    setInsights(mapped);
  };

  const fetchAgentInsights = async (forceRefresh = false) => {
    const userId = user?.id;
    if (!userId) return;

    // Build fingerprint from current record counts
    let incomeCount = 0;
    let expenseCount = 0;
    try {
      const [incRes, expRes] = await Promise.all([
        apiFetch(getToken, 'http://localhost:8000/api/income'),
        apiFetch(getToken, 'http://localhost:8000/api/expenses'),
      ]);
      incomeCount = incRes.ok ? (await incRes.json()).length : 0;
      expenseCount = expRes.ok ? (await expRes.json()).length : 0;
    } catch {}

    if (!forceRefresh && !needsAiRefresh(userId, AI_KEY, incomeCount, expenseCount)) {
      // Data unchanged — serve from localStorage cache
      const cached = readAiCache(userId, AI_KEY);
      if (cached) {
        _applyAgentData(cached.data);
        setUpdatedTime('cached');
        return;
      }
    }

    // Data changed or forced — call the agent
    setIsAnalyzing(true);
    try {
      const res = await apiFetch(getToken, 'http://localhost:8000/api/ai/agent/analytics');
      if (res.ok) {
        const data = await res.json();
        
      }
    } catch (err) {
      console.warn('Could not fetch agent analytics.', err);
    } finally {
      setIsAnalyzing(false);
      setUpdatedTime('just now');
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    if (user?.id) fetchAgentInsights();
  }, [getToken, user?.id]);

  // Re-run button forces a fresh Gemini analysis
  const handleTriggerAnalysis = async () => {
    await fetchAgentInsights(true);
  };

  // Group expenses by category
  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {
      Housing: 0,
      Food: 0,
      Transport: 0,
      Entertainment: 0,
      Shopping: 0,
      Other: 0
    };
    
    let grandTotal = 0;
    
    expenseList.forEach((exp) => {
      let cat = exp.category || 'Other';
      if (!totals.hasOwnProperty(cat)) {
        cat = 'Other';
      }
      totals[cat] += exp.amount;
      grandTotal += exp.amount;
    });

    return { totals, grandTotal };
  }, [expenseList]);

  const segments = useMemo(() => {
    const { totals, grandTotal } = categoryBreakdown;
    if (grandTotal === 0) return [];
    
    let accumulatedLength = 0;
    const circumference = 2 * Math.PI * 70; // ~439.82
    return CATEGORIES.map((cat) => {
      const amount = totals[cat] || 0;
      const pct = amount / grandTotal;
      const strokeLength = pct * circumference;
      const offset = -accumulatedLength;
      accumulatedLength += strokeLength;
      
      return {
        category: cat,
        amount,
        percentage: Math.round(pct * 100),
        strokeLength,
        offset,
        color: CATEGORY_COLORS[cat]
      };
    });
  }, [categoryBreakdown]);

  // Bar Chart Dynamic Scale
  const maxCashFlow = monthsData.length > 0 
    ? Math.max(...monthsData.map(d => Math.max(d.income, d.expenses))) 
    : 8000;
  const yMax = maxCashFlow > 0 ? maxCashFlow * 1.1 : 8000; // Add 10% headroom
  const yLabels = [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0];
  const formatYLabel = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
    return Math.round(val).toString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/20 via-slate-50 to-white">
      <TopHeader />

      <div className="flex-1 overflow-y-auto pb-12">
        <div className="max-w-[1400px] mx-auto px-8 py-6">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Analytics</h1>
            <p className="text-[14px] text-slate-500 mt-0.5 font-medium font-sans">
              Deep insights into your financial patterns.
            </p>
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Income vs Expenses Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_12px_40px_rgba(59,130,246,0.04)] flex flex-col justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Income vs Expenses</h3>
                <p className="text-[12px] text-slate-400 font-semibold tracking-wide mt-0.5">Monthly comparison</p>
              </div>

              {/* Bar Chart Area */}
              <div className="mt-8 relative h-[280px]">
                {/* Horizontal dotted grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                  {yLabels.map((val, idx) => (
                    <div key={idx} className="flex items-center w-full">
                      <span className="text-[11px] font-bold text-slate-400 w-10 text-left">{formatYLabel(val)}</span>
                      <div className="flex-1 border-t border-dashed border-slate-200/80"></div>
                    </div>
                  ))}
                </div>

                {/* Bars & Labels Container */}
                <div className="absolute left-10 right-0 top-0 bottom-0 flex justify-between items-end px-4">
                  {monthsData.map((d) => {
                    const incomeHeight = yMax > 0 ? (d.income / yMax) * 100 : 0;
                    const expensesHeight = yMax > 0 ? (d.expenses / yMax) * 100 : 0;
                    return (
                      <div key={d.label} className="flex flex-col items-center h-full justify-end flex-1">
                        <div className="flex items-end gap-1.5 h-[calc(100%-2rem)] w-full justify-center">
                          {/* Expenses Bar (Blue) */}
                          <div
                            className="bg-sky-500 w-[14px] sm:w-[18px] rounded-t-md transition-all duration-500 hover:opacity-90 relative group cursor-pointer"
                            style={{ height: `${expensesHeight}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity pointer-events-none">Rs. {d.expenses.toLocaleString()}</div>
                          </div>
                          {/* Income Bar (Green) */}
                          <div
                            className="bg-[#10b981] w-[14px] sm:w-[18px] rounded-t-md transition-all duration-500 hover:opacity-90 relative group cursor-pointer"
                            style={{ height: `${incomeHeight}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity pointer-events-none">Rs. {d.income.toLocaleString()}</div>
                          </div>
                        </div>
                        {/* X-Axis label perfectly aligned below the bars */}
                        <div className="h-8 flex items-end">
                          <span className="text-[12px] font-bold text-slate-400 text-center">{d.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-sky-500"></span>
                  <span className="text-[13px] font-bold text-sky-500">expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#10b981]"></span>
                  <span className="text-[13px] font-bold text-[#10b981]">income</span>
                </div>
              </div>
            </div>

            {/* Category Distribution Donut Chart Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_12px_40px_rgba(59,130,246,0.04)] flex flex-col justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Category Distribution</h3>
                <p className="text-[12px] text-slate-400 font-semibold tracking-wide mt-0.5">Where your money goes</p>
              </div>

              {categoryBreakdown.grandTotal > 0 ? (
                <>
                  {/* Donut Chart SVG */}
                  <div className="flex justify-center items-center my-6 h-[280px]">
                    <div className="relative w-[220px] h-[220px]">
                      {/* Outer glow/shadow */}
                      <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.05)]"></div>
                      
                      {/* Background track */}
                      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#f1f5f9" strokeWidth="24" />
                      </svg>
                      
                      {/* Value rings */}
                      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full transform -rotate-90 z-10 drop-shadow-md">
                        {segments.map((seg) => {
                          if (seg.strokeLength === 0) return null;
                          return (
                            <circle
                              key={seg.category}
                              cx="100"
                              cy="100"
                              r="70"
                              fill="none"
                              stroke={seg.color}
                              strokeWidth="24"
                              strokeDasharray={`${seg.strokeLength} 440`}
                              strokeDashoffset={seg.offset}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out hover:opacity-80 hover:stroke-[28px] cursor-pointer"
                            />
                          );
                        })}
                      </svg>
                      
                      {/* Center summary text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</span>
                        <span className="text-[18px] font-bold text-slate-800">
                          Rs. {categoryBreakdown.grandTotal >= 1000 ? (categoryBreakdown.grandTotal/1000).toFixed(1) + 'k' : categoryBreakdown.grandTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category Legend Grid */}
                  <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-center max-w-md mx-auto mt-4">
                    {segments.map((seg) => {
                      if (seg.amount === 0) return null;
                      return (
                        <div key={seg.category} className="flex items-center justify-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: seg.color }}></span>
                          <span className="text-[12px] font-bold" style={{ color: seg.color }}>
                            {seg.category} ({seg.percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center my-6 h-[280px] text-slate-400 text-[14px] font-medium text-center px-4">
                  <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">pie_chart</span>
                  No expenses logged to calculate category distribution.
                </div>
              )}
            </div>

          </div>

          {/* Agent Summaries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Expense Analysis Agent */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-sky-500">query_stats</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">Expense Analysis Agent</h3>
                  <p className="text-[12px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Spending patterns</p>
                </div>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-5 h-5 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                  <span className="text-[13px] text-slate-500 font-medium">Analyzing expenses...</span>
                </div>
              ) : agentExpense ? (
                <p
                  className="text-[14px] text-slate-600 font-medium leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: agentExpense.summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                  }}
                />
              ) : (
                <p className="text-[13px] text-slate-400 font-medium">Waiting for agent results...</p>
              )}
            </div>

            {/* Savings Planner Agent */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-emerald-500">psychology</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">Savings Planner Agent</h3>
                  <p className="text-[12px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Budget optimization</p>
                </div>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span className="text-[13px] text-slate-500 font-medium">Planning savings...</span>
                </div>
              ) : agentSavings ? (
                <p
                  className="text-[14px] text-slate-600 font-medium leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: agentSavings.summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                  }}
                />
              ) : (
                <p className="text-[13px] text-slate-400 font-medium">Waiting for agent results...</p>
              )}
            </div>
          </div>

          {/* Expense Analysis Agent Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_12px_40px_rgba(59,130,246,0.04)] relative overflow-hidden">
            
            {/* Background decorative glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-bold text-slate-900">AI-Generated Insights</h3>
                  <span className="bg-sky-55/60 text-sky-600 border border-sky-100 text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Beta
                  </span>
                </div>
                <p className="text-[13px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></span>
                  Updated {updatedTime}
                </p>
              </div>

              {/* Refresh trigger button */}
              <button
                onClick={handleTriggerAnalysis}
                disabled={isAnalyzing}
                className="h-10 px-4 flex items-center gap-2 bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-200 rounded-xl text-[13px] font-bold text-slate-600 hover:text-sky-700 transition-all cursor-pointer select-none active:scale-95 disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                {isAnalyzing ? 'Analyzing spending...' : 'Re-run Analysis'}
              </button>
            </div>

            {/* Analysis Loader Grid block */}
            {isAnalyzing ? (
              <div className="h-[200px] flex flex-col items-center justify-center gap-4 bg-slate-50/40 rounded-2xl border border-slate-100 border-dashed">
                <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-[13px] font-bold text-slate-500">Agent scanning transactions database...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {insights.map((insight, index) => {
                  let accentColor = 'sky';
                  let bgClass = 'bg-sky-50';
                  let textClass = 'text-[#3b82f6]';

                  if (insight.icon === 'restaurant') {
                    accentColor = 'emerald';
                    bgClass = 'bg-emerald-50';
                    textClass = 'text-[#10b981]';
                  } else if (insight.icon === 'local_taxi') {
                    accentColor = 'rose';
                    bgClass = 'bg-rose-50';
                    textClass = 'text-[#f43f5e]';
                  }

                  return (
                    <div
                      key={insight.id || index}
                      className="bg-slate-50/60 hover:bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5 group flex flex-col justify-between h-[150px]"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
                          {insight.title}
                        </h4>
                        <span className={`material-symbols-outlined ${textClass} text-[22px] ${bgClass} p-1.5 rounded-lg group-hover:scale-110 transition-transform`}>
                          {insight.icon || 'auto_awesome'}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium mt-2">
                        {insight.description}
                      </p>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
