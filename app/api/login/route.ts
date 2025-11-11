import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Simple authentication logic (replace with real authentication)
    if (username === 'federico' && password === '12345') {
      const cookieStore = await cookies();
      cookieStore.set('session', `${username}-${password}`);
      return Response.json({ success: true, message: 'Login successful' });
    } else {
      return Response.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in login API:', error);
    return Response.json(
      {
        error: 'Error during login',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
