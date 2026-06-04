'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import TopHeader from '@/components/TopHeader';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  // Profile state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [initials, setInitials] = useState('U');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Preferences state
  const [prefs, setPrefs] = useState([
    { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive weekly financial summaries', enabled: true },
    { key: 'pushNotif', label: 'Push Notifications', desc: 'Get alerts for bill reminders', enabled: true },
    { key: 'aiInsights', label: 'AI Insights', desc: 'Allow AI to analyze your spending patterns', enabled: true },
    { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme', enabled: false },
  ]);

  const { user, isLoaded } = useUser();

  // Load profile from backend or Clerk
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        setFullName(user.fullName || '');
        setEmail(user.primaryEmailAddress?.emailAddress || '');
        setAvatarUrl(user.imageUrl || '');
        computeInitials(user.fullName || '');
        setLoading(false);
      } else {
        fetchProfile();
      }
    }
  }, [isLoaded, user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const mockEmail = localStorage.getItem('finova_user_email') || '';
      const mockName = localStorage.getItem('finova_user_name') || '';
      
      const res = await fetch('http://localhost:8000/api/auth/me', {
        headers: {
          'x-mock-email': mockEmail,
          'x-mock-name': mockName
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFullName(data.name || '');
        setEmail(data.email || '');
        setAvatarUrl(data.avatar_url || '');
        computeInitials(data.name || '');
      }
    } catch (err) {
      // Fallback to localStorage for mock auth
      const storedName = localStorage.getItem('finova_user_name') || '';
      const storedEmail = localStorage.getItem('finova_user_email') || '';
      setFullName(storedName);
      setEmail(storedEmail);
      computeInitials(storedName);
    } finally {
      setLoading(false);
    }
  };

  const computeInitials = (name: string) => {
    if (!name) { setInitials('U'); return; }
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      setInitials((parts[0][0] + parts[1][0]).toUpperCase());
    } else {
      setInitials(name.substring(0, 2).toUpperCase());
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const mockEmail = localStorage.getItem('finova_user_email') || '';
      const mockName = localStorage.getItem('finova_user_name') || '';

      const res = await fetch('http://localhost:8000/api/auth/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-mock-email': mockEmail,
          'x-mock-name': mockName
        },
        body: JSON.stringify({ name: fullName, avatar_url: avatarUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setFullName(data.name || '');
        setAvatarUrl(data.avatar_url || '');
        computeInitials(data.name || '');

        // Also sync to localStorage for TopHeader display
        localStorage.setItem('finova_user_name', data.name || '');
        if (data.email) localStorage.setItem('finova_user_email', data.email);

        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (err) {
      // Offline fallback — save to localStorage
      localStorage.setItem('finova_user_name', fullName);
      computeInitials(fullName);
      toast.success('Profile saved locally.');
    } finally {
      setSaving(false);
    }
  };

  const togglePref = (key: string) => {
    setPrefs(prev =>
      prev.map(p => p.key === key ? { ...p, enabled: !p.enabled } : p)
    );
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const mockEmail = localStorage.getItem('finova_user_email') || '';
        const mockName = localStorage.getItem('finova_user_name') || '';

        const res = await fetch('http://localhost:8000/api/auth/me', {
          method: 'DELETE',
          headers: {
            'x-mock-email': mockEmail,
            'x-mock-name': mockName
          }
        });

        if (res.ok) {
          localStorage.removeItem('finova_auth');
          localStorage.removeItem('finova_user_email');
          localStorage.removeItem('finova_user_name');
          toast.success('Account deleted successfully.');
          window.location.href = '/sign-in';
        } else {
          toast.error('Failed to delete account.');
        }
      } catch (err) {
        toast.error('Error deleting account.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <TopHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-8 py-8">

          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-[28px] font-bold text-text-primary tracking-tight">Settings</h1>
            <p className="text-[15px] text-text-secondary mt-1">Manage your account and preferences</p>
          </div>

          <div className="space-y-5">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 animate-fade-in-up">
              <h3 className="text-[16px] font-semibold text-text-primary mb-5">Profile</h3>
              <div className="flex items-center gap-4 mb-6">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-[22px] font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <h4 className="text-[16px] font-semibold text-text-primary">{fullName || 'User'}</h4>
                  <p className="text-[13px] text-text-tertiary">{email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider block mb-1.5">Full Name</label>
                  <input
                    className="w-full h-10 px-3 bg-surface border border-surface-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); computeInitials(e.target.value); }}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider block mb-1.5">Email</label>
                  <input
                    className="w-full h-10 px-3 bg-surface border border-surface-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all opacity-60 cursor-not-allowed"
                    value={email}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider block mb-1.5">Avatar URL</label>
                  <input
                    className="w-full h-10 px-3 bg-surface border border-surface-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="h-9 px-6 text-[13px] font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-all shadow-sm shadow-sky-500/10 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 animate-fade-in-up">
              <h3 className="text-[16px] font-semibold text-text-primary mb-5">Preferences</h3>
              <div className="space-y-4">
                {prefs.map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-[14px] font-medium text-text-primary">{pref.label}</p>
                      <p className="text-[12px] text-text-tertiary mt-0.5">{pref.desc}</p>
                    </div>
                    <button
                      onClick={() => togglePref(pref.key)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${pref.enabled ? 'bg-primary' : 'bg-text-muted'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${pref.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 animate-fade-in-up">
              <h3 className="text-[16px] font-semibold text-text-primary mb-5">Security</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center group-hover:bg-primary-bg transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-text-secondary group-hover:text-primary transition-colors">lock</span>
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-medium text-text-primary">Change Password</p>
                      <p className="text-[12px] text-text-tertiary">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-text-tertiary">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center group-hover:bg-primary-bg transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-text-secondary group-hover:text-primary transition-colors">security</span>
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-medium text-text-primary">Two-Factor Authentication</p>
                      <p className="text-[12px] text-text-tertiary">Currently enabled</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-text-tertiary">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center group-hover:bg-primary-bg transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-text-secondary group-hover:text-primary transition-colors">devices</span>
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-medium text-text-primary">Connected Devices</p>
                      <p className="text-[12px] text-text-tertiary">3 devices active</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-text-tertiary">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-error/20 p-6 animate-fade-in-up">
              <h3 className="text-[16px] font-semibold text-error mb-2">Danger Zone</h3>
              <p className="text-[13px] text-text-tertiary mb-4">Irreversible actions for your account</p>
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} className="h-9 px-4 text-[13px] font-medium text-error bg-error-bg rounded-lg hover:bg-error hover:text-white transition-all cursor-pointer">
                  Delete Account
                </button>
                <button className="h-9 px-4 text-[13px] font-medium text-text-secondary bg-surface rounded-lg hover:bg-surface-hover transition-all border border-surface-border">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
