export const config = {
  matcher: '/:path*',
};

export default function middleware(request: Request): Response | undefined {
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const [, pass] = atob(auth.slice(6)).split(':');
      if (pass === 'ResurgensNextGen') return;
    } catch {}
  }
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="RTP Training"' },
  });
}
