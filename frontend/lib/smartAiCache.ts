/**
 * smartAiCache.ts
 *
 * Decides whether the AI agents need to run by comparing a "data fingerprint"
 * stored in localStorage against the current income + expense counts.
 *
 * Rules:
 *  - AI runs on first login (no cache entry exists for this user).
 *  - AI runs again only when the number of income OR expense records changes.
 *  - AI does NOT run on every page load / navigation.
 *
 * The cache is stored in localStorage (survives tab closes) and is
 * scoped per-user via the Clerk userId so different users never share data.
 */

export interface AiCacheEntry {
  data: unknown;           // The raw JSON returned by the AI agent endpoint
  incomeCount: number;     // Number of income records at the time of analysis
  expenseCount: number;    // Number of expense records at the time of analysis
}

function storageKey(userId: string, cacheKey: string): string {
  return `finova_ai_${cacheKey}_${userId}`;
}

/**
 * Read a cached AI result for this user + cache key.
 * Returns null if nothing is cached yet.
 */
export function readAiCache(userId: string, cacheKey: string): AiCacheEntry | null {
  try {
    const raw = localStorage.getItem(storageKey(userId, cacheKey));
    if (!raw) return null;
    return JSON.parse(raw) as AiCacheEntry;
  } catch {
    return null;
  }
}
