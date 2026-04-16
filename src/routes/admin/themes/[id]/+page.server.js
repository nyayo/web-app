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
  const role = user?.data?.role;
  const userId = user?.data?.userId;

  if (!token || !user?.data) {
    throw redirect(302, '/login');
  }

  return {
    token,
    role,
    userId,
  };
};

export const load = async ({
  fetch,
  cookies,
  params,
}) => {
  const {
    role,
    token,
    userId,
  } = getSessionOrRedirect(cookies);

  const themeId = params.id;

  if (!['admin', 'editor'].includes(role)) {
    throw redirect(302, '/admin');
  }

  const fetchVcard = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(buildRestApiUrl(`/users/${userId}/vcards`), options);

    if ([400, 401].includes(response.status)) {
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

  const [vCards, theme] = await Promise.all([
    fetchVcard(),
    fetchTheme(),
  ]);

  return {
    vCards,
    theme,
  };
};

export const actions = {
  save: async ({
    fetch,
    request,
    cookies,
    params,
  }) => {
    const { token } = getSessionOrRedirect(cookies);
    const themeId = params.id;
    const formData = await request.formData();

    const data = {
      color: {
        font: {
          primary: formData.get('fontColor'),
          secondary: formData.get('secondaryFontColor'),
        },
        background: formData.get('backgroundColor'),
        socialIcons: {
          font: formData.get('socialIconFontColor'),
          background: formData.get('socialIconBackgroundColor'),
        },
        contactIcons: {
          font: formData.get('contactIconFontColor'),
          background: formData.get('contactIconBackgroundColor'),
        },
        vCardBtn: {
          font: formData.get('btnFontColor'),
          background: formData.get('btnBackgroundColor'),
        },
      },
      display: {
        logo: formData.get('displayLogo') === 'on',
        phone: formData.get('displayPhone') === 'on',
        sms: formData.get('displaySms') === 'on',
        email: formData.get('displayEmail') === 'on',
        web: formData.get('displayWeb') === 'on',
        address: formData.get('displayAddress') === 'on',
        map: formData.get('displayMap') === 'on',
        vCardBtn: formData.get('displayContactBtn') === 'on',
      },
      align: {
        logo: formData.get('alignLogo'),
        avatar: formData.get('alignAvatar'),
        heading: formData.get('alignHeading'),
        bio: formData.get('alignBio'),
        socialIcons: formData.get('alignSocialIcons'),
      },
      logo: {
        size: {
          height: formData.get('logoHeight'),
        },
      },
    };

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(buildRestApiUrl(`/themes/${themeId}`), options);

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
    params,
  }) => {
    const { token } = getSessionOrRedirect(cookies);
    const themeId = params.id;
    const formData = await request.formData();

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    try {
      const response = await fetch(buildRestApiUrl(`/themes/${themeId}/images`), options);

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
    const { token } = getSessionOrRedirect(cookies);
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
