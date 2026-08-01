import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { COURSES_MAP } from '@/lib/courses-data';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, paymentType = 'admission', name, phone } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const course = COURSES_MAP[courseId];
    if (!course) {
      return NextResponse.json({ error: 'Invalid courseId' }, { status: 400 });
    }

    // Pricing is admin-editable in the database (courses.admission_ghs /
    // tuition_ghs / promo_price_ghs / deposit_percent) — falls back to the
    // static catalog for any field admin hasn't configured yet.
    const { data: courseRow } = await supabase
      .from('courses')
      .select('admission_ghs, tuition_ghs, promo_price_ghs, deposit_percent')
      .eq('id', courseId)
      .maybeSingle();

    const admissionGhs = courseRow?.admission_ghs ?? course.admissionGhs;
    const tuitionGhs = courseRow?.tuition_ghs ?? course.tuitionGhs;
    const depositPercent = courseRow?.deposit_percent ?? 50;
    const promoPriceGhs = courseRow?.promo_price_ghs ?? null;

    // Determine the amount dynamically based on paymentType
    let amountGhs = 0;
    if (paymentType === 'admission') {
      amountGhs = admissionGhs;
    } else if (paymentType === 'deposit') {
      amountGhs = tuitionGhs * (depositPercent / 100);
    } else if (paymentType === 'balance') {
      amountGhs = tuitionGhs;
    } else if (paymentType === 'full') {
      // A promo price, when set, replaces the admission+tuition total —
      // it's a discounted all-in price, not stacked on top.
      amountGhs = promoPriceGhs ?? admissionGhs + tuitionGhs;
    } else {
      return NextResponse.json({ error: 'Invalid paymentType' }, { status: 400 });
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

    // Call Paystack API to initialize transaction
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error('PAYSTACK_SECRET_KEY is not configured');
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const callbackUrl = `${siteUrl}/student-dashboard`;

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(amountGhs * 100), // in GHS pesewas/cents
        callback_url: callbackUrl,
        metadata: {
          studentId: user.id,
          courseId,
          paymentType,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return NextResponse.json({ error: paystackData.message || 'Failed to initialize Paystack' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });
  } catch (err) {
    console.error('Enrol API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
