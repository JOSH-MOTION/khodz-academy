import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing email or name' }, { status: 400 });
    }

    await sendWelcomeEmail(email, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Welcome email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
