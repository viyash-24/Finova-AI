'use client';

import { useState, useEffect } from 'react';

export default function TopHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 transition-all duration-300 ${
        scrolled
          ? 'h-14 bg-white/90 backdrop-blur-md border-b border-slate-100/80 shadow-sm'
          : 'h-16 bg-transparent border-b border-transparent'
      }`}
    >
      {/* Left: Sidebar toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-700 md:hidden"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-8">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search transactions, bills, goals..."
            className="w-full h-10 pl-11 pr-4 bg-slate-100/60 hover:bg-slate-100 focus:bg-white rounded-full border-none text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark mode toggle */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
          <span className="material-symbols-outlined text-[22px]">bedtime</span>
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600 relative">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Avatar */}
        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-500 flex items-center justify-center text-white text-[13px] font-bold ml-1 hover:opacity-90 transition-opacity shadow-sm shadow-sky-500/10">
          VS
        </button>
      </div>
    </header>
  );
}
