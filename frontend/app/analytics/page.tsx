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
