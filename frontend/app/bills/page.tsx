'use client';

import TopHeader from '@/components/TopHeader';

const bills = [
  { id: 1, name: 'Internet Bill', provider: 'Comcast Xfinity', amount: 59.99, dueDate: 'Aug 20', status: 'upcoming', icon: 'wifi', iconBg: 'bg-primary-bg', iconColor: 'text-primary' },
  { id: 2, name: 'Electricity', provider: 'Con Edison', amount: 134.00, dueDate: 'Aug 22', status: 'upcoming', icon: 'bolt', iconBg: 'bg-warning-bg', iconColor: 'text-warning' },
  { id: 3, name: 'Car Insurance', provider: 'Geico', amount: 120.00, dueDate: 'Aug 25', status: 'upcoming', icon: 'directions_car', iconBg: 'bg-accent-bg', iconColor: 'text-accent' },
  { id: 4, name: 'Gym Membership', provider: 'Planet Fitness', amount: 45.00, dueDate: 'Aug 28', status: 'upcoming', icon: 'fitness_center', iconBg: 'bg-[#fdf4ff]', iconColor: 'text-[#a855f7]' },
  { id: 5, name: 'Netflix', provider: 'Netflix Inc.', amount: 15.99, dueDate: 'Aug 14', status: 'paid', icon: 'subscriptions', iconBg: 'bg-error-bg', iconColor: 'text-error' },
  { id: 6, name: 'Spotify', provider: 'Spotify AB', amount: 9.99, dueDate: 'Aug 10', status: 'paid', icon: 'music_note', iconBg: 'bg-success-bg', iconColor: 'text-success' },
  { id: 7, name: 'Cloud Storage', provider: 'Google One', amount: 2.99, dueDate: 'Aug 5', status: 'paid', icon: 'cloud', iconBg: 'bg-primary-bg', iconColor: 'text-primary' },
];
