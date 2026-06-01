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
