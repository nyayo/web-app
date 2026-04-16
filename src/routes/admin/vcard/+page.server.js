import { redirect } from '@sveltejs/kit';
import { buildRestApiUrl } from '$lib/server/rest-api-url.js';
import { createDefaultTheme, createDefaultVCard } from '$lib/defaults/data.js';

const parseCookieJSON = (cookieValue) => {
  try {
    return JSON.parse(cookieValue ?? '{}');
  } catch {
    return {};
  }
};

const getSessionOrRedirect = (cookies) => {
  const access = parseCookieJSON(cookies.get('access'));
  const user = parseCookieJSON(cookies.get('user'));
  const token = access?.data?.token;

  if (!token || !user?.data) {
    throw redirect(302, '/login');
  }

  return {
    token,
    user: user.data,
  };
};

export const load = async ({
  fetch,
  cookies,
  url,
}) => {
  const { token, user } = getSessionOrRedirect(cookies);
  const userId = url.searchParams.get('userId') || user.userId;
  const themeId = url.searchParams.get('themeId') || user.themeId;

  const fetchVcard = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(buildRestApiUrl(`/users/${userId}/vcards`), options);

    if ([400, 401, 404].includes(response.status)) {
      throw redirect(302, '/login');
    }

    if (response.status === 403) {
      throw redirect(302, '/admin');
    }

    if (!response.ok) {
      return { data: createDefaultVCard(userId) };
    }

    const payload = await response.json();
    if (!payload?.data) {
      return { data: createDefaultVCard(userId) };
    }

    return payload;
  };

  const fetchTheme = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(buildRestApiUrl(`/themes/${themeId}`), options);

    if ([400, 401].includes(response.status)) {
      throw redirect(302, '/login');
    }

    if (response.status === 403) {
      throw redirect(302, '/admin');
    }

    if (!response.ok) {
      return { data: createDefaultTheme() };
    }

    const payload = await response.json();
    if (!payload?.data) {
      return { data: createDefaultTheme() };
    }

    return payload;
  };

  const [vCard, theme] = await Promise.all([
    fetchVcard(),
    fetchTheme(),
  ]);

  return {
    vCard,
    theme,
  };
};

export const actions = {
  save: async ({
    fetch,
    request,
    cookies,
    url,
  }) => {
    const { token, user } = getSessionOrRedirect(cookies);
    const formData = await request.formData();

    const vCard = {
      person: {
        firstName: formData.get('firstName'),
        middleName: formData.get('middleName'),
        lastName: formData.get('lastName'),
        suffix: formData.get('suffix'),
        birthday: formData.get('birthday'),
        pronouns: formData.get('pronouns'),
      },
      professional: {
        title: formData.get('title'),
        company: formData.get('company'),
        role: formData.get('role'),
        bio: formData.get('bio'),
      },
      contact: {
        phone: {
          number: formData.get('number'),
          countryCode: formData.get('countryCode'),
          extension: formData.get('extension'),
        },
        email: formData.get('email'),
        web: formData.get('web'),
        file: {
          url: formData.get('fileUrl'),
          name: formData.get('fileName'),
        },
      },
      location: {
        street: formData.get('street'),
        storey: formData.get('storey'),
        city: formData.get('city'),
        state: formData.get('state'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country'),
        timeZone: formData.get('timeZone'),
        coordinates: {
          latitude: +formData.get('latitude'),
          longitude: +formData.get('longitude'),
        },
      },
      socialMedia: {
        twitter: formData.get('twitter'),
        linkedin: formData.get('linkedin'),
        facebook: formData.get('facebook'),
        instagram: formData.get('instagram'),
        pinterest: formData.get('pinterest'),
        github: formData.get('github'),
      },
    };

    const userId = url.searchParams.get('userId') || user.userId;

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vCard),
    };

    try {
      const response = await fetch(buildRestApiUrl(`/users/${userId}/vcards`), options);

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  uploadLogo: async ({
    fetch,
    request,
    cookies,
    url,
  }) => {
    const { token, user } = getSessionOrRedirect(cookies);
    const formData = await request.formData();
    const image = formData.get('image');
    const userId = formData.get('userId') || url.searchParams.get('userId') || user.userId;

    if (!image || typeof image === 'string' || image.size === 0) {
      return { success: false };
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    try {
      const response = await fetch(buildRestApiUrl(`/users/${userId}/images`), options);

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },
};
