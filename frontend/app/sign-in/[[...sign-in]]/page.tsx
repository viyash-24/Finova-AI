'use client';

import { SignIn } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkActive = !!(
  pubKey &&
  pubKey !== '' &&
  !pubKey.includes('placeholder') &&
  !pubKey.includes('d29ya2luZy1jb25ndXItODQ')
);

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    // Simulate network latency
    setTimeout(() => {
      localStorage.setItem('finova_auth', 'true');
      localStorage.setItem('finova_user_email', email);
      router.push('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50">
      {/* Brand Side (Left on Desktop) */}
      <div className="flex-1 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex flex-col justify-between p-8 md:p-16 text-white relative overflow-hidden min-h-[300px] md:min-h-screen">
        {/* Decorative circle glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center gap-3.5 z-10">
          <img src="/finova_logo.svg" alt="Finova AI Logo" className="w-10 h-10 object-contain rounded-xl" />
          <span className="text-[20px] font-bold tracking-tight">Finova AI</span>
        </div>

        {/* Brand Main Text */}
        <div className="my-auto max-w-lg z-10">
          <h1 className="text-[36px] md:text-[48px] font-extrabold leading-tight tracking-tight mb-6">
            Smart personal finance, simplified.
          </h1>
          <p className="text-[15px] md:text-[16px] text-sky-100 font-medium leading-relaxed">
            Take complete control of your expenses, active savings goals, and monthly cash flows with real-time AI-guided financial analytics.
          </p>
        </div>

        {/* Brand Footer */}
        <div className="text-[13px] text-sky-200/80 font-medium z-10">
          © 2026 Finova AI Inc. All rights reserved.
        </div>
      </div>

      {/* Auth Side (Right) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Mobile Header */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden">
            <img src="/finova_logo.svg" alt="Finova AI Logo" className="w-9 h-9 object-contain rounded-xl" />
            <span className="text-[18px] font-bold text-slate-800 tracking-tight">Finova AI</span>
          </div>

          <div className="w-full">
            {isClerkActive ? (
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 p-0 w-full bg-transparent",
                    headerTitle: "text-slate-900 font-bold text-[24px] tracking-tight",
                    headerSubtitle: "text-slate-400 font-medium text-[14px]",
                    socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 transition-all rounded-xl text-slate-600 font-semibold h-11 text-[13.5px]",
                    formButtonPrimary: "bg-sky-500 hover:bg-sky-600 border-0 h-11 text-[14px] font-bold rounded-xl transition-all shadow-md shadow-sky-500/10",
                    formFieldInput: "bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 rounded-xl h-11 px-4 text-[14px] transition-all focus:ring-4 focus:ring-sky-500/5",
                    formFieldLabel: "text-[12px] font-bold text-slate-600 mb-1.5",
                    footerActionLink: "text-sky-500 hover:text-sky-600 font-bold",
                    identityPreviewEditButton: "text-sky-500 font-bold hover:text-sky-600",
                  }
                }}
                signUpUrl="/sign-up"
              />
            ) : (
              /* Custom Credentials Fallback Form */
              <div className="w-full animate-fade-in-up">
                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-slate-900 font-bold text-[28px] tracking-tight">Welcome back</h2>
                  <p className="text-slate-400 font-medium text-[14px] mt-1">Please enter your details to sign in</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-[13px] font-bold text-rose-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleMockLogin} className="space-y-5">
                  <div>
                    <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[12px] font-bold text-slate-600 block">Password</label>
                      <button type="button" className="text-[12px] font-bold text-sky-500 hover:text-sky-600">
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl text-[14px] transition-all shadow-md shadow-sky-500/10 active:scale-[0.99] flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </form>

                {/* Social Login Divider */}
                <div className="relative my-8 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative bg-white px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    or
                  </span>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      localStorage.setItem('finova_auth', 'true');
                      localStorage.setItem('finova_user_email', 'google-demo@finova.ai');
                      router.push('/dashboard');
                    }}
                    className="h-11 border border-slate-200 hover:bg-slate-50 transition-all rounded-xl text-slate-600 font-bold text-[13.5px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8 12.57c0-3.3 2.685-5.97 5.99-5.97 1.62 0 3.097.643 4.192 1.693l3.203-3.204C19.26 3.06 16.79 2 13.99 2 8.163 2 3.43 6.733 3.43 12.57s4.733 10.57 10.56 10.57c6.12 0 10.158-4.303 10.158-10.337 0-.58-.063-1.127-.171-1.528H12.24Z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('finova_auth', 'true');
                      localStorage.setItem('finova_user_email', 'github-demo@finova.ai');
                      router.push('/dashboard');
                    }}
                    className="h-11 border border-slate-200 hover:bg-slate-50 transition-all rounded-xl text-slate-600 font-bold text-[13.5px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    GitHub
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-[13.5px] font-medium text-slate-400">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => router.push('/sign-up')}
                      className="text-sky-500 hover:text-sky-600 font-bold"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
