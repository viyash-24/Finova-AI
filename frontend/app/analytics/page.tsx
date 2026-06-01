'use client';

import { useState, useEffect, useMemo } from 'react';
import TopHeader from '@/components/TopHeader';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [updatedTime, setUpdatedTime] = useState('5 minutes ago');

  const [monthsData, setMonthsData] = useState<MonthDataPoint[]>([]);
  const [insights, setInsights] = useState<AIInsightData[]>([]);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/dashboard');
      if (res.ok) {
        const d = await res.json();
        if (d.cashFlow && d.cashFlow.length > 0) {
          const mapped = d.cashFlow.map((item: any) => ({
            label: item.month,
            // Map values to percentage height
            income: (item.income / 8000) * 80,
            expenses: (item.expenses / 8000) * 80,
          }));
          setMonthsData(mapped);
        }
      }
    } catch (err) {
      console.warn('Could not fetch chart coordinates from backend.', err);
    }

    try {
      const res = await fetch('http://localhost:8000/api/analytics/insights');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setInsights(data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch AI insights from backend.', err);
    }

    try {
      const res = await fetch('http://localhost:8000/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenseList(data);
      }
    } catch (err) {
      console.warn('Could not fetch expenses for category breakdown.', err);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Triggers simulated AI analysis on backend
  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/api/analytics/insights/rerun', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (err) {
      console.error('Failed to rerun insights on backend:', err);
    } finally {
      setIsAnalyzing(false);
      setUpdatedTime('just now');
    }
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
    return CATEGORIES.map((cat) => {
      const amount = totals[cat] || 0;
      const pct = amount / grandTotal;
      const strokeLength = pct * 377;
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
                  {[8000, 6000, 4000, 2000, 0].map((val) => (
                    <div key={val} className="flex items-center w-full">
                      <span className="text-[11px] font-bold text-slate-400 w-10 text-left">{val}</span>
                      <div className="flex-1 border-t border-dashed border-slate-200/80"></div>
                    </div>
                  ))}
                </div>

                {/* SVG Bars Container */}
                <div className="absolute left-10 right-0 top-0 bottom-8">
                  <div className="w-full h-full flex justify-between items-end px-2">
                    {monthsData.map((d) => (
                      <div key={d.label} className="flex flex-col items-center h-full justify-end flex-1 max-w-[50px] mx-1">
                        <div className="flex items-end gap-1.5 h-full w-full justify-center">
                          {/* Income Bar (Green) */}
                          <div
                            className="bg-[#10b981] w-[14px] rounded-t-full transition-all duration-500 hover:opacity-90"
                            style={{ height: `${d.income}%` }}
                          ></div>
                          {/* Expenses Bar (Blue) */}
                          <div
                            className="bg-sky-500 w-[14px] rounded-t-full transition-all duration-500 hover:opacity-90"
                            style={{ height: `${d.expenses}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* X-Axis labels */}
                <div className="absolute bottom-0 left-10 right-0 flex justify-between px-6">
                  {monthsData.map((d) => (
                    <span key={d.label} className="text-[12px] font-bold text-slate-400 w-[24px] text-center">{d.label}</span>
                  ))}
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
