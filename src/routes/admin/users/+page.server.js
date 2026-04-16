import { redirect } from '@sveltejs/kit';
import { buildRestApiUrl } from '$lib/server/rest-api-url.js';
import { createDefaultThemesResponse, createDefaultUsersResponse } from '$lib/defaults/data.js';

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
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(buildRestApiUrl('/themes'), options);

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
    if (!payload?.data || !Array.isArray(payload.data)) {
      return createDefaultThemesResponse();
    }

    return payload;
  };

  const fetchUsers = async () => {
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

    const apiUrl = new URL(buildRestApiUrl('/users'));

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
      return createDefaultUsersResponse();
    }

    const payload = await response.json();
    if (!payload?.data || !Array.isArray(payload.data) || !payload?.pagination) {
      return createDefaultUsersResponse();
    }

    return payload;
  };

  const [themes, users] = await Promise.all([
    fetchThemes(),
    fetchUsers(),
  ]);

  return {
    themes,
    users,
  };
};

export const actions = {
  view: async ({
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
      const response = await fetch(buildRestApiUrl('/users'), options);

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  send: async ({
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
        userId: formData.get('userId'),
      }),
    };

    try {
      const response = await fetch(buildRestApiUrl('/auth/recover'), options);
      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  delete: async ({
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
        userId: formData.get('userId'),
      }),
    };

    try {
      const response = await fetch(buildRestApiUrl(`/users/${formData.get('userId')}`), options);

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  updateUser: async ({
    fetch,
    request,
    cookies,
  }) => {
    const token = getTokenOrRedirect(cookies);
    const formData = await request.formData();

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        themeId: formData.get('themeId'),
        email: formData.get('email'),
        name: formData.get('name'),
        role: formData.get('role'),
      }),
    };

    try {
      const response = await fetch(buildRestApiUrl(`/users/${formData.get('userId')}`), options);

      if (response.ok) {
        const payload = await response.json();
        if (payload?.data) {
          await cookies.set('user', JSON.stringify(payload), {
            path: '/',
            maxAge: 3600 * 60 * 60 * 24, // 1 day
            secure: false,
            sameSite: 'lax',
            httpOnly: false,
          });
        }
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  create: async ({
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
        themeId: formData.get('themeId'),
        email: formData.get('email'),
        name: formData.get('name'),
        role: formData.get('role'),
        sendMail: Boolean(formData.get('sendMail')),
      }),
    };

    try {
      const response = await fetch(buildRestApiUrl('/auth/signup'), options);

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },
};
