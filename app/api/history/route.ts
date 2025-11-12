import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    // Store the record in the database
    const records = await sql`
      SELECT * FROM record_search WHERE username = ${username}
    `;

    return new Response(JSON.stringify(records), { status: 200 });
  } catch (error) {
    console.error('Error storing record search:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
