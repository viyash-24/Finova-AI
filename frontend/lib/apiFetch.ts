/**
 * apiFetch – a drop-in replacement for fetch() that automatically attaches
 * the current Clerk session token as a Bearer Authorization header.
 *
 * Usage (inside a component):
 *   const { getToken } = useAuth();
 *   const res = await apiFetch(getToken, 'http://localhost:8000/api/income');
 */
export async function apiFetch(
  getToken: () => Promise<string | null>,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getToken();

  const headers = new Headers(options.headers ?? {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

