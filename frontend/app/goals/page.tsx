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
