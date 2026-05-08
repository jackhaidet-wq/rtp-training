import { next } from '@vercel/edge';

export const config = {
  matcher: '/:path*',
};

export default function middleware(request: Request): Response | undefined {
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const idx = decoded.indexOf(':');
      const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
      const pass = idx >= 0 ? decoded.slice(idx + 1) : '';
      if (pass === 'ResurgensNextGen') {
        const safe = encodeURIComponent(user || '').slice(0, 96);
        return next({
          headers: {
            'set-cookie': `rtp-user=${safe}; Path=/; Max-Age=86400; SameSite=Lax`,
          },
        });
      }
    } catch {}
  }
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="RTP Training"' },
  });
}
