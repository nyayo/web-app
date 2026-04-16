import { redirect } from '@sveltejs/kit';

const parseCookieJSON = (cookieValue) => {
  try {
    return JSON.parse(cookieValue ?? '{}');
  } catch {
    return {};
  }
};

export async function handle({ event, resolve }) {
  const userRaw = event.cookies.get('user');
  const userCookie = parseCookieJSON(userRaw);

  if (!userCookie?.data) {
    event.cookies.delete('user', { path: '/' });
    event.cookies.delete('access', { path: '/' });
  }

  const accessCookie = parseCookieJSON(event.cookies.get('access'));
  if (event.url.pathname.startsWith('/admin') && (!accessCookie?.data?.token || !userCookie?.data)) {
    throw redirect(302, '/login');
  }

  const theme = userCookie?.data?.theme || 'dark';

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('data-bs-theme="auto"', `data-bs-theme="${theme}"`),
  });
}
