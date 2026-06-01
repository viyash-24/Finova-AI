'use client';

import { ClerkProvider } from "@clerk/nextjs";

const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = !!(
  pubKey &&
  pubKey !== '' &&
  !pubKey.includes('placeholder') &&
  !pubKey.includes('d29ya2luZy1jb25ndXItODQ')
);

export default function FinovaAuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured) {
    return (
      <ClerkProvider>
        {children}
      </ClerkProvider>
    );
  }

  return <>{children}</>;
}
