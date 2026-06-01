'use client';

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  useEffect(() => {
    setMounted(true);

    const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const isClerkActive = pubKey && pubKey !== '' && !pubKey.includes('placeholder') && !pubKey.includes('d29ya2luZy1jb25ndXItODQ');

    if (!isClerkActive) {
      const isLogged = localStorage.getItem('finova_auth') === 'true';
      setAuthenticated(isLogged);
      if (!isLogged && !isAuthPage) {
        router.push('/sign-in');
      }
    } else {
      setAuthenticated(true);
    }
  }, [pathname, isAuthPage, router]);

  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkActive = pubKey && pubKey !== '' && !pubKey.includes('placeholder') && !pubKey.includes('d29ya2luZy1jb25ndXItODQ');

  if (isAuthPage) {
    return <main className="flex-1 w-full min-h-screen bg-slate-50">{children}</main>;
  }

  if (!mounted) {
    return <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
    </div>;
  }
  
  if (!isClerkActive && !authenticated && !isAuthPage) {
    return <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
    </div>;
  }


  return (
    <>
      <Sidebar />
      <div className="flex-1 md:ml-[260px] relative min-h-screen">
        {children}
      </div>
    </>
  );
}
