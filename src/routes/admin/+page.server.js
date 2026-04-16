import { redirect } from '@sveltejs/kit';
import { buildRestApiUrl } from '$lib/server/rest-api-url.js';
import { createDefaultClickStats } from '$lib/defaults/data.js';

const parseCookieJSON = (cookieValue) => {
  try {
    return JSON.parse(cookieValue ?? '{}');
  } catch {
    return {};
  }
};

export const load = async ({
  fetch,
  cookies,
  url,
}) => {
  const accessCookie = parseCookieJSON(cookies.get('access'));
  const userCookie = parseCookieJSON(cookies.get('user'));
  const token = accessCookie?.data?.token;
  const userId = url.searchParams.get('userId') || userCookie?.data?.userId;

  if (!token || !userId) {
    throw redirect(302, '/login');
  }

  const clicks = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(buildRestApiUrl(`/users/${userId}/statistics/clicks`), options);

    if ([400, 401, 403, 404].includes(response.status)) {
      throw redirect(302, '/login');
    }

    if (!response.ok) {
      return { data: createDefaultClickStats() };
    }

    const payload = await response.json();
    if (!payload?.data) {
      return { data: createDefaultClickStats() };
    }

    return payload;
  };

  return {
    clicks: await clicks(),
  };
};
