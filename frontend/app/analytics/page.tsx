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
