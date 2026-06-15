'use client';

import { useState, useEffect, useRef } from 'react';
import { UserButton, Show, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function TopHeader() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isClerkActive, setIsClerkActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Initialize with empty array since we don't want mock data
  const [notifications, setNotifications] = useState<any[]>([]);

  // Update unread count dynamically based on state
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  useEffect(() => {
    // Scroll state listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Click outside listener for dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Check Clerk active state and load mock user info
    const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (
      pubKey &&
      pubKey !== '' &&
      !pubKey.includes('placeholder') &&
      !pubKey.includes('d29ya2luZy1jb25ndXItODQ')
    ) {
      setIsClerkActive(true);
    } else {
      const storedEmail = localStorage.getItem('finova_user_email');
      const storedName = localStorage.getItem('finova_user_name');
      if (storedEmail) setUserEmail(storedEmail);
      if (storedName) setUserName(storedName);
    }

    // Check initial dark mode state
    const savedTheme = localStorage.getItem('finova_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      applyDarkMode(true);
    }

    // Listen for profile update events from Settings page
    const handleProfileUpdate = () => {
      const updatedName = localStorage.getItem('finova_user_name') || '';
      const updatedEmail = localStorage.getItem('finova_user_email') || '';
      if (updatedName) setUserName(updatedName);
      if (updatedEmail) setUserEmail(updatedEmail);
    };
    window.addEventListener('finova-profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('finova-profile-updated', handleProfileUpdate);
    };
  }, []);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      let style = document.getElementById('finova-dark-mode');
      if (!style) {
        style = document.createElement('style');
        style.id = 'finova-dark-mode';
        style.innerHTML = `
          /* Ultra-Premium Mesh Gradient Background */
          .dark body, .dark html { 
            background-color: #09090b !important;
            background-image: 
              radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.12) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.08) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgba(236, 72, 153, 0.08) 0px, transparent 50%) !important;
            background-attachment: fixed !important;
            color: #fafafa !important; 
          }
          
          /* Advanced Frosted Glass Cards */
          .dark .bg-white { 
            background: rgba(24, 24, 27, 0.55) !important; 
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.07) !important; 
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05) !important;
            color: #fafafa !important;
            border-radius: 16px !important;
            transition: all 0.3s ease !important;
          }
          .dark .bg-white:hover {
            box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.12) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }

          /* Glowing Primary Actions */
          .dark .bg-sky-500, .dark .bg-blue-500 {
            background: linear-gradient(135deg, #0ea5e9, #6366f1) !important;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45) !important;
            border: none !important;
          }
          .dark .text-sky-600, .dark .text-blue-600, .dark .text-sky-500 { 
            color: #38bdf8 !important; 
            text-shadow: 0 0 12px rgba(56, 189, 248, 0.4) !important; 
          }

          /* Vibrant Status Colors */
          .dark .bg-rose-500 { background: #f43f5e !important; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.4) !important; }
          .dark .text-rose-500 { color: #fb7185 !important; }
          .dark .bg-emerald-500 { background: #10b981 !important; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important; }
          .dark .text-emerald-500 { color: #34d399 !important; }

          /* Sidebar Active States */
          .dark .bg-sky-50, .dark .bg-blue-50 {
            background: linear-gradient(90deg, rgba(56, 189, 248, 0.15) 0%, transparent 100%) !important;
            border-left: 3px solid #38bdf8 !important;
            border-radius: 0 12px 12px 0 !important;
          }

          /* Premium Typography */
          .dark .text-slate-900, .dark .text-slate-800, .dark .text-gray-900 { color: #ffffff !important; }
          .dark .text-slate-700, .dark .text-gray-700 { color: #f4f4f5 !important; }
          .dark .text-slate-600, .dark .text-slate-500 { color: #a1a1aa !important; }
          .dark .text-slate-400 { color: #71717a !important; }
          
          /* Borders & Secondary Surfaces */
          .dark .border-slate-100, .dark .border-slate-50, .dark .border-slate-200 { 
            border-color: rgba(255, 255, 255, 0.08) !important; 
          }
          .dark .bg-slate-50, .dark .bg-slate-100 { 
            background: rgba(39, 39, 42, 0.4) !important; 
            border: 1px solid rgba(255, 255, 255, 0.03) !important;
          }

          /* Input Fields */
          .dark input, .dark textarea, .dark select {
            background-color: rgba(9, 9, 11, 0.7) !important;
            color: #ffffff !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 9999px !important;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2) !important;
          }
          .dark input:focus {
            border-color: #38bdf8 !important;
            box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25) !important;
          }

          /* Header Glass Effect */
          .dark header.bg-white\\/90 { 
            background: rgba(9, 9, 11, 0.6) !important; 
            backdrop-filter: blur(24px) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important; 
          }

          /* Interactive elements */
          .dark .hover\\:bg-slate-100:hover { background-color: rgba(255, 255, 255, 0.1) !important; color: #fff !important; }
          .dark .hover\\:bg-slate-50\\/50:hover { background-color: rgba(255, 255, 255, 0.05) !important; }
          
          /* Custom Scrollbars */
          .dark ::-webkit-scrollbar-track { background: transparent !important; }
          .dark ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15) !important; border-radius: 10px; }
          .dark ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25) !important; }
        `;
        document.head.appendChild(style);
      }
    } else {
      document.documentElement.classList.remove('dark');
      const style = document.getElementById('finova-dark-mode');
      if (style) style.remove();
    }
  };

  const handleDarkModeToggle = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    applyDarkMode(nextMode);
    localStorage.setItem('finova_theme', nextMode ? 'dark' : 'light');
    if (nextMode) {
      toast.success('Dark mode enabled 🌙');
    } else {
      toast.info('Light mode enabled ☀️');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMockSignOut = () => {
    localStorage.removeItem('finova_auth');
    localStorage.removeItem('finova_user_email');
    localStorage.removeItem('finova_user_name');
    setShowDropdown(false);
    router.push('/sign-in');
  };

  // Get user initials for display
  const getInitials = () => {
    if (!userName) return 'DU';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
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
        <button 
          onClick={handleDarkModeToggle}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
          title="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDarkMode ? 'light_mode' : 'bedtime'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600 relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 animate-fade-in-up overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-[14px] font-bold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[12px] text-sky-500 font-semibold hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n.id)}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${!n.read ? 'bg-sky-50/30 dark:bg-sky-900/10' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-[13px] ${!n.read ? 'font-bold text-slate-800 dark:text-white' : 'font-semibold text-slate-600 dark:text-slate-300'}`}>{n.title}</h4>
                        <span className="text-[10px] font-medium text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-slate-200 mb-2">notifications_paused</span>
                    <p className="text-[13px] font-medium text-slate-500">No new notifications</p>
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-slate-50 text-center bg-slate-50/30 hover:bg-slate-100/50 transition-colors cursor-pointer">
                <span className="text-[12px] font-bold text-slate-600 hover:text-sky-500 transition-colors">View all activity</span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar - Conditional on Clerk */}
        <div className="ml-1 flex items-center justify-center relative" ref={dropdownRef}>
          {isClerkActive ? (
            <>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9 sm:w-10 sm:h-10 shadow-sm border border-slate-100",
                    }
                  }}
                />
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-[12.5px] shadow-sm cursor-pointer transition-colors">
                    Sign in
                  </button>
                </SignInButton>
              </Show>
            </>
          ) : (
            <>
              {/* Mock Avatar with Dropdown */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-[13px] font-bold hover:opacity-90 transition-opacity shadow-sm shadow-sky-500/10 cursor-pointer"
              >
                {getInitials()}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-12 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2.5 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-[13px] font-bold text-slate-800 truncate">{userName}</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{userEmail}</p>
                  </div>
                  
                  <div className="px-1.5 py-1.5">
                    <button
                      onClick={handleMockSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-[13.5px] font-bold text-rose-500 hover:bg-rose-50/50 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
