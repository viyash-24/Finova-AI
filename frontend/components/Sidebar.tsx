'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Expenses', path: '/expenses', icon: 'payments' },
    { name: 'Analytics', path: '/analytics', icon: 'insights' },
    { name: 'Goals', path: '/goals', icon: 'flag' },
    { name: 'Investment', path: '/investment', icon: 'trending_up' },
    { name: 'Bills', path: '/bills', icon: 'receipt_long' },
    { name: 'Income Growth', path: '/income-growth', icon: 'auto_graph' },
    { name: 'Chat', path: '/', icon: 'forum' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/30 shadow-sm flex flex-col py-lg z-50 hidden md:flex">
      {/* Brand Header */}
      <div className="px-md mb-lg flex items-center gap-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary shadow-sm">
          <span className="material-symbols-outlined filled text-[24px]">network_intelligence</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-black text-primary">Finova AI</h1>
          <p className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            AI Status: Online
          </p>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 px-sm space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-sm px-md py-xs rounded-lg font-label-md text-label-md transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container translate-x-1 shadow-sm'
                  : 'text-on-surface-variant hover:bg-primary-fixed/30 hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </div>
      
      {/* Footer Navigation */}
      <div className="px-sm mt-auto space-y-1 pt-md border-t border-outline-variant/30 mx-sm">
        <Link
          href="/profile"
          className="flex items-center gap-sm text-on-surface-variant hover:bg-primary-fixed/30 transition-all px-md py-xs rounded-lg font-label-md text-label-md hover:text-primary"
        >
          <span className="material-symbols-outlined">account_circle</span> Profile
        </Link>
        <Link
          href="/help"
          className="flex items-center gap-sm text-on-surface-variant hover:bg-primary-fixed/30 transition-all px-md py-xs rounded-lg font-label-md text-label-md hover:text-primary"
        >
          <span className="material-symbols-outlined">help</span> Help
        </Link>
      </div>
    </nav>
  );
}
