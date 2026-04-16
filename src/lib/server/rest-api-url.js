import { env as privateEnv } from '$env/dynamic/private';
import { PUBLIC_REST_API_URL } from '$env/static/public';

const API_PREFIX = '/api/v1';

const normalizeBaseUrl = (url = '') => {
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.replace(/\/api\/v1$/, '');
};

const normalizePath = (path) => (path.startsWith('/') ? path : `/${path}`);

export const buildRestApiUrl = (path) => {
  const baseUrl = normalizeBaseUrl(privateEnv.REST_API_URL || PUBLIC_REST_API_URL || '');
  return `${baseUrl}${API_PREFIX}${normalizePath(path)}`;
};
