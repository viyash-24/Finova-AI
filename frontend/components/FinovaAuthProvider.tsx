'use client';

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = !!(
  pubKey &&
  pubKey !== '' &&
  !pubKey.includes('placeholder') &&
  !pubKey.includes('d29ya2luZy1jb25ndXItODQ')
);

/**
 * Inner component that watches the signed-in userId.
 * The smart AI cache (localStorage) is already scoped by userId so no
 * explicit cleanup is needed on account switch — each user reads their
 * own isolated cache key automatically.
 *
 * This watcher is kept in place for any future cross-user cleanup needs.
 */
function UserWatcher() {
  const { userId } = useAuth();
  const prevUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (prevUserId.current === undefined) {
      prevUserId.current = userId;
      return;
    }
    // User changed — update reference (cache is already per-userId in localStorage)
    if (prevUserId.current !== userId) {
      prevUserId.current = userId;
    }
  }, [userId]);

  return null;
}

export default function FinovaAuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured) {
    return (
      <ClerkProvider>
        <UserWatcher />
        {children}
      </ClerkProvider>
    );
  }

  return <>{children}</>;
}
