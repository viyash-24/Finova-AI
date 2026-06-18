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

/**
 * Write an AI result to the cache.
 */
export function writeAiCache(
  userId: string,
  cacheKey: string,
  data: unknown,
  incomeCount: number,
  expenseCount: number,
): void {
  try {
    const entry: AiCacheEntry = { data, incomeCount, expenseCount };
    localStorage.setItem(storageKey(userId, cacheKey), JSON.stringify(entry));
  } catch {
    // localStorage may be unavailable in some private-browsing configurations
  }
}

/**
 * Clear cached AI data for this user (call after sign-out or account switch).
 */
export function clearAiCache(userId: string, cacheKey: string): void {
  try {
    localStorage.removeItem(storageKey(userId, cacheKey));
  } catch {}
}

/**
 * Determine whether a fresh AI call is needed.
 *
 * Returns true when:
 *  - There is no cached entry for this user (first login / first visit)
 *  - The income count changed since the last analysis
 *  - The expense count changed since the last analysis
 */
export function needsAiRefresh(
  userId: string,
  cacheKey: string,
  currentIncomeCount: number,
  currentExpenseCount: number,
): boolean {
  const entry = readAiCache(userId, cacheKey);
  if (!entry) return true;  // No cache — first time
  if (entry.incomeCount !== currentIncomeCount) return true;
  if (entry.expenseCount !== currentExpenseCount) return true;
  return false;
}
