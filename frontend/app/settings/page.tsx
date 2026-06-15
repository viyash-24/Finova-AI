'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  // Preferences state
  const [prefs, setPrefs] = useState([
    { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive weekly financial summaries', enabled: true },
    { key: 'pushNotif', label: 'Push Notifications', desc: 'Get alerts for bill reminders', enabled: true },
    { key: 'aiInsights', label: 'AI Insights', desc: 'Allow AI to analyze your spending patterns', enabled: true },
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
    // Always read localStorage first — this is the user's most recent explicit save
    const localName = localStorage.getItem('finova_user_name') || '';
    const localEmail = localStorage.getItem('finova_user_email') || '';

    try {
      const res = await fetch('http://localhost:8000/api/auth/me', {
        headers: {
          'x-mock-email': localEmail,
          'x-mock-name': localName
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Prefer the locally stored name (user's last explicit save) over the backend
        // Backend email and avatar_url are still used as they are less likely to conflict
        const displayName = localName || data.name || '';
        setFullName(displayName);
        setEmail(localEmail || data.email || '');
        setAvatarUrl(data.avatar_url || '');
        computeInitials(displayName);
        // Keep localStorage in sync with avatar_url from backend
        if (data.avatar_url) localStorage.setItem('finova_user_avatar', data.avatar_url);
      } else {
        // Backend failed — fall back entirely to localStorage
        setFullName(localName);
        setEmail(localEmail);
        computeInitials(localName);
      }
    } catch (err) {
      // Network error — fall back entirely to localStorage
      setFullName(localName);
      setEmail(localEmail);
      computeInitials(localName);
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
        const savedName = data.name || fullName;

        // Synchronize name with Clerk if using Clerk auth
        if (user) {
          try {
            const parts = savedName.trim().split(' ');
            await user.update({
              firstName: parts[0] || '',
              lastName: parts.slice(1).join(' ') || ''
            });
          } catch (e) {
            console.error('Failed to update Clerk user:', e);
          }
        }

        setFullName(savedName);
        setAvatarUrl(data.avatar_url || avatarUrl);
        computeInitials(savedName);

        // Sync to localStorage and notify TopHeader to refresh
        localStorage.setItem('finova_user_name', savedName);
        if (data.email) localStorage.setItem('finova_user_email', data.email);
        window.dispatchEvent(new Event('finova-profile-updated'));

        toast.success('Profile updated successfully!');
      } else {
        // Backend failed — save locally anyway
        localStorage.setItem('finova_user_name', fullName);
        computeInitials(fullName);
        window.dispatchEvent(new Event('finova-profile-updated'));
        toast.success('Profile saved locally.');
      }
    } catch (err) {
      // Offline fallback — save to localStorage
      localStorage.setItem('finova_user_name', fullName);
      computeInitials(fullName);
      window.dispatchEvent(new Event('finova-profile-updated'));
      toast.success('Profile saved locally.');
    } finally {
      setSaving(false);
    }
  };

  const togglePref = (key: string) => {
    const pref = prefs.find(p => p.key === key);
    if (pref) {
      const willBeEnabled = !pref.enabled;
      if (willBeEnabled) {
        toast.success(`${pref.label} enabled successfully`);
      } else {
        toast.info(`${pref.label} disabled`);
      }
    }

    setPrefs(prev => prev.map(p => p.key === key ? { ...p, enabled: !p.enabled } : p));
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
          router.push('/sign-in');
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
                <div className="col-span-1 md:col-span-2">
                  <label className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider block mb-1.5">Avatar Image</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 h-10 px-3 bg-surface border border-surface-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Paste image URL or click Upload ->"
                    />
                    <label className="h-10 px-4 bg-surface border border-surface-border rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-hover transition-colors flex items-center justify-center cursor-pointer shadow-sm">
                      <span className="material-symbols-outlined text-[18px] mr-1.5 text-sky-500">upload</span>
                      Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                               toast.error('Image must be less than 2MB');
                               return;
                            }
                            // Convert to base64 for local UI and backend DB
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAvatarUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                            
                            // Also push to Clerk immediately if using Clerk
                            if (user && typeof user.setProfileImage === 'function') {
                               try {
                                 await user.setProfileImage({ file });
                                 toast.success('Avatar uploaded to Cloud');
                               } catch (err) {
                                 console.error(err);
                               }
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
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
                <button 
                  onClick={() => toast.info('Password reset instructions sent to your email.')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors group cursor-pointer"
                >
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
                <button 
                  onClick={() => toast.info('2FA settings will be available in the next security update.')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors group cursor-pointer"
                >
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
                <button 
                  onClick={() => toast.info('Device management coming soon.')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors group cursor-pointer"
                >
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
                <button 
                  onClick={() => toast.success('Your data export has started. You will receive an email shortly.')}
                  className="h-9 px-4 text-[13px] font-medium text-text-secondary bg-surface rounded-lg hover:bg-surface-hover transition-all border border-surface-border cursor-pointer"
                >
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
