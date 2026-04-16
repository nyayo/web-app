import { error } from '@sveltejs/kit';
import { buildRestApiUrl } from '$lib/server/rest-api-url.js';
import { createDefaultTheme } from '$lib/defaults/data.js';

export const prerender = 'auto';

export const load = async ({
  fetch,
  params,
  url,
}) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const fetchVcard = async () => {
    const response = await fetch(buildRestApiUrl(`/users/${params.id}/vcards`), requestOptions);
    if (response.status === 404) {
      throw error(404, 'Business card not found');
    }
    if (!response.ok) {
      throw error(response.status, 'Unable to load business card');
    }

    const payload = await response.json();
    if (!payload?.data) {
      throw error(404, 'Business card not found');
    }

    return payload;
  };

  const fetchTheme = async () => {
    const response = await fetch(buildRestApiUrl(`/themes/${params.themeId}`), requestOptions);
    if (!response.ok) {
      return { data: createDefaultTheme() };
    }

    const payload = await response.json();
    if (!payload?.data) {
      return { data: createDefaultTheme() };
    }

    return payload;
  };

  const fetchClicks = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: url.searchParams.get('source') }),
    };

    try {
      await fetch(buildRestApiUrl(`/users/${params.id}/statistics/clicks`), options);
    } catch {
      // Click tracking must never block public profile rendering.
    }
  };

  const [vCard, theme] = await Promise.all([
    fetchVcard(),
    fetchTheme(),
  ]);

  await fetchClicks();

  return {
    vCard,
    theme,
  };
};
