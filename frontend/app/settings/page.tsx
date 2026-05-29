'use client';

import TopHeader from '@/components/TopHeader';

export default function SettingsPage() {
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
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-[22px] font-bold">
                  AK
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-text-primary">Alex Kingston</h4>
                  <p className="text-[13px] text-text-tertiary">alex.kingston@email.com</p>
                </div>
                <button className="ml-auto h-9 px-4 text-[13px] font-medium text-primary bg-primary-bg rounded-lg hover:bg-primary hover:text-white transition-all">
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider block mb-1.5">Full Name</label>
                  <input className="w-full h-10 px-3 bg-surface border border-surface-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" defaultValue="Alex Kingston" />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider block mb-1.5">Email</label>
                  <input className="w-full h-10 px-3 bg-surface border border-surface-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" defaultValue="alex.kingston@email.com" />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 animate-fade-in-up">
              <h3 className="text-[16px] font-semibold text-text-primary mb-5">Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive weekly financial summaries', enabled: true },
                  { label: 'Push Notifications', desc: 'Get alerts for bill reminders', enabled: true },
                  { label: 'AI Insights', desc: 'Allow AI to analyze your spending patterns', enabled: true },
                  { label: 'Dark Mode', desc: 'Switch to dark theme', enabled: false },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-[14px] font-medium text-text-primary">{pref.label}</p>
                      <p className="text-[12px] text-text-tertiary mt-0.5">{pref.desc}</p>
                    </div>
                    <button className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${pref.enabled ? 'bg-primary' : 'bg-text-muted'}`}>
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
                <button className="h-9 px-4 text-[13px] font-medium text-error bg-error-bg rounded-lg hover:bg-error hover:text-white transition-all">
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
