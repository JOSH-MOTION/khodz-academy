import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, name, phone } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrolments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'already_enrolled', enrolmentId: existing.id }, { status: 409 });
    }

    // Update profile with name/phone if provided
    if (name || phone) {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name || user.user_metadata?.full_name,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
    }

    // Create the enrolment record (deposited tier)
    const paymentDeadline = new Date();
    paymentDeadline.setDate(paymentDeadline.getDate() + 30); // 30-day deadline to pay full amount

    const { data: enrolment, error: insertError } = await supabase
      .from('enrolments')
      .insert({
        student_id: user.id,
        course_id: courseId,
        tier: 'deposited',
        waterline_week: 4, // default: first 4 weeks unlocked
        payment_deadline: paymentDeadline.toISOString(),
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Enrolment insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, enrolment }, { status: 201 });
  } catch (err) {
    console.error('Enrol API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
