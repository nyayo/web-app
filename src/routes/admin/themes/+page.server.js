import { redirect } from '@sveltejs/kit';
import { buildRestApiUrl } from '$lib/server/rest-api-url.js';
import { createDefaultThemesResponse } from '$lib/defaults/data.js';

const parseCookieJSON = (cookieValue) => {
  try {
    return JSON.parse(cookieValue ?? '{}');
  } catch {
    return {};
  }
};

const getTokenOrRedirect = (cookies) => {
  const token = parseCookieJSON(cookies.get('access'))?.data?.token;
  if (!token) {
    throw redirect(302, '/login');
  }
  return token;
};

export const load = async ({
  fetch,
  cookies,
  url,
}) => {
  const token = getTokenOrRedirect(cookies);

  const fetchThemes = async () => {
    const params = new URLSearchParams(url.search);
    const page = params.get('page');
    const limit = params.get('limit') ?? 5;
    const search = params.get('search');

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const apiUrl = new URL(buildRestApiUrl('/themes'));

    if (page) {
      apiUrl.searchParams.append('page', page);
    }
    if (limit) {
      apiUrl.searchParams.append('limit', limit);
    }
    if (search) {
      apiUrl.searchParams.append('search', search);
    }

    const response = await fetch(apiUrl.toString(), options);

    if ([400, 401, 404].includes(response.status)) {
      throw redirect(302, '/login');
    }

    if (response.status === 403) {
      throw redirect(302, '/admin');
    }

    if (!response.ok) {
      return createDefaultThemesResponse();
    }

    const payload = await response.json();
    if (!payload?.data || !Array.isArray(payload.data) || !payload?.pagination) {
      return createDefaultThemesResponse();
    }

    return payload;
  };

  return {
    themes: await fetchThemes(),
  };
};

export const actions = {
  view: async ({
    fetch,
    request,
    cookies,
  }) => {
    const token = getTokenOrRedirect(cookies);
    const formData = await request.formData();
    const data = Object.fromEntries(Array.from(formData.entries()));

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(buildRestApiUrl('/themes'), options);

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  delete: async ({
    fetch,
    request,
    cookies,
  }) => {
    const token = getTokenOrRedirect(cookies);
    const formData = await request.formData();

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        themeId: formData.get('themeId'),
      }),
    };

    try {
      const response = await fetch(buildRestApiUrl(`/themes/${formData.get('themeId')}`), options);

      if (response.status === 400) {
        const data = await response.json();
        return {
          success: false,
          ...data,
        };
      }

      if (response.ok) {
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  createTheme: async ({
    fetch,
    request,
    cookies,
  }) => {
    const token = getTokenOrRedirect(cookies);
    const formData = await request.formData();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.get('name'),
      }),
    };

    try {
      const response = await fetch(buildRestApiUrl('/themes'), options);

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },
};
