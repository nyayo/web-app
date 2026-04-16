import { buildRestApiUrl } from '$lib/server/rest-api-url.js';
import { displayWarning } from '../../js/toast.js';

export const actions = {
  login: async ({
    fetch,
    request,
    cookies,
  }) => {
    const formData = await request.formData();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    };

    try {
      const response = await fetch(buildRestApiUrl('/auth/login'), options);

      if (response.ok) {
        const user = await response.json();

        await cookies.set('access', JSON.stringify({
          data: {
            token: user.data.token,
          },
        }), {
          path: '/',
          maxAge: 3600 * 60 * 60 * 24, // 1 day
          secure: false,
          sameSite: 'lax',
          httpOnly: true,
        });

        delete user.data.token;
        await cookies.set('user', JSON.stringify(user), {
          path: '/',
          maxAge: 3600 * 60 * 60 * 24, // 1 day
          secure: false,
          sameSite: 'lax',
          httpOnly: false,
        });

        return { success: true };
      }

      displayWarning('Wrong credentials');
      return { success: false };
    } catch
    (err) {
      displayWarning('Error during login');
      return { success: false };
    }
  },
};
