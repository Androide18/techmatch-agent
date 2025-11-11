import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { model } = await req.json();

  const cookieStore = await cookies();
  cookieStore.set('selectedModel', model, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return Response.json({ ok: true });
}
