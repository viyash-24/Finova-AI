'use client';

import { useState, useEffect, useRef } from 'react';
import { UserButton, Show, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function TopHeader() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isClerkActive, setIsClerkActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Click outside listener for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
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
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
          <span className="material-symbols-outlined text-[22px]">bedtime</span>
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600 relative">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white"></span>
        </button>

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
