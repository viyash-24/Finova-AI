'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const overviewItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
  { name: 'Income', path: '/income', icon: 'payments' },
  { name: 'Expenses', path: '/expenses', icon: 'credit_card' },
  { name: 'Analytics', path: '/analytics', icon: 'bar_chart' },
  { name: 'Goals', path: '/goals', icon: 'adjust' },
  { name: 'Bills', path: '/bills', icon: 'receipt_long' },
];

const intelligenceItems = [
  { name: 'AI Assistant', path: '/ai-assistant', icon: 'auto_awesome' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('toggle-sidebar', handleToggle);
    window.addEventListener('close-sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('close-sidebar', handleClose);
    };
  }, []);

  // Close sidebar on path change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/' || pathname === '/dashboard';
    return pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <nav
        className={`h-screen w-[260px] fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      {/* Brand */}
      <div className="px-6 pt-6 pb-5 flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/finova_logo.svg" alt="Finova AI Logo" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
            <span>Finova </span>
            <span className="text-sky-500">AI</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 mt-0.5">
            Personal Finance
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 overflow-y-auto no-scrollbar">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 px-3 mb-2 mt-4">
          Overview
        </p>
        <div className="space-y-1">
          {overviewItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-sky-50 text-sky-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${active ? 'filled text-sky-500' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Intelligence Section */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 px-3 mb-2 mt-6">
          Intelligence
        </p>
        <div className="space-y-1">
          {intelligenceItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-sky-50 text-sky-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${active ? 'filled text-sky-500' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Settings at Bottom */}
      <div className="px-4 pb-6 pt-3 border-t border-slate-100 bg-white">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
            isActive('/settings')
              ? 'bg-sky-50 text-sky-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
          Settings
        </Link>
      </div>
    </nav>
    </>
  );
}
