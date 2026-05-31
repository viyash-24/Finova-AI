'use client';

import { useState, useEffect } from 'react';
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

export default function AnalyticsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [updatedTime, setUpdatedTime] = useState('5 minutes ago');

  const [monthsData, setMonthsData] = useState<MonthDataPoint[]>([
    { label: 'Jan', income: 64, expenses: 38 },
    { label: 'Feb', income: 67, expenses: 41 },
    { label: 'Mar', income: 65, expenses: 36 },
    { label: 'Apr', income: 70, expenses: 45 },
    { label: 'May', income: 73, expenses: 41 },
    { label: 'Jun', income: 77, expenses: 44 },
    { label: 'Jul', income: 75, expenses: 46 },
    { label: 'Aug', income: 78, expenses: 43 },
  ]);

  const [insights, setInsights] = useState<AIInsightData[]>([
    { id: '1', title: 'Food spending down 12%', description: "Compared to your 3-month average. Keep meal-prepping on Sundays — it's working.", icon: 'restaurant' },
    { id: '2', title: 'Transport up 24% this month', description: "Mostly rideshare. Could a monthly transit pass save ~$80?", icon: 'local_taxi' },
    { id: '3', title: 'Predicted Sept spend: $3,520', description: 'Based on seasonal patterns and your recurring bills.', icon: 'online_prediction' },
  ]);

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

            {/* Category Distribution Donut Chart Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_12px_40px_rgba(59,130,246,0.04)] flex flex-col justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Category Distribution</h3>
                <p className="text-[12px] text-slate-400 font-semibold tracking-wide mt-0.5">Where your money goes</p>
              </div>

              {/* Donut Chart SVG */}
              <div className="flex justify-center items-center my-6 h-[280px]">
                <div className="relative w-56 h-56">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    {/* Concentric Segments with spacing gaps */}
                    {/* Total circumference: 376.99 (radius 60) */}
                    
                    {/* Housing - Blue (40%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="24"
                      strokeDasharray="148 377"
                      strokeDashoffset="0"
                      className="transition-all duration-500 hover:opacity-90"
                    />

                    {/* Food - Green (25%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="24"
                      strokeDasharray="91 377"
                      strokeDashoffset="-151"
                      className="transition-all duration-500 hover:opacity-90"
                    />

                    {/* Transport - Purple (12%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="24"
                      strokeDasharray="43 377"
                      strokeDashoffset="-245"
                      className="transition-all duration-500 hover:opacity-90"
                    />

                    {/* Entertainment - Orange/Yellow (8%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="24"
                      strokeDasharray="28 377"
                      strokeDashoffset="-291"
                      className="transition-all duration-500 hover:opacity-90"
                    />

                    {/* Shopping - Rose/Red (12%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="24"
                      strokeDasharray="43 377"
                      strokeDashoffset="-322"
                      className="transition-all duration-500 hover:opacity-90"
                    />

                    {/* Other - Grey (3%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="24"
                      strokeDasharray="9 377"
                      strokeDashoffset="-368"
                      className="transition-all duration-500 hover:opacity-90"
                    />
                  </svg>
                </div>
              </div>
