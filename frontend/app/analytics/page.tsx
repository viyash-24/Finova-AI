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
