import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // 1. Verify webhook signature from Paystack
  const body = await request.text()
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')
    
  if (hash !== request.headers.get('x-paystack-signature')) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  if (event.event !== 'charge.success') return NextResponse.json({ ok: true })

  const { reference, metadata, amount } = event.data
  const { studentId, courseId, paymentType } = metadata

  const supabase = createServiceClient() // Service role — bypasses RLS

  // 2. Log the payment
  await supabase.from('payments').insert({
    student_id: studentId,
    amount: amount,
    payment_type: paymentType,
    paystack_ref: reference,
    paystack_status: 'success',
    paid_at: new Date().toISOString(),
  })

  // 3. Upgrade enrolment tier
  if (paymentType === 'admission') {
    await supabase.from('enrolments')
      .upsert({ student_id: studentId, course_id: courseId,
                tier: 'admitted', admission_paid_at: new Date().toISOString() })
  }

  if (paymentType === 'deposit') {
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 60) // 60 day payment window
    
    // Get current week to set waterline
    const { data: weeks } = await supabase.from('weeks')
      .select('week_number').eq('course_id', courseId).order('week_number')
      
    const currentWeek = weeks?.length ?? 0
    
    await supabase.from('enrolments')
      .update({ tier: 'deposited', deposit_paid_at: new Date().toISOString(),
                payment_deadline: deadline.toISOString(), waterline_week: currentWeek })
      .eq('student_id', studentId).eq('course_id', courseId)
  }

  if (paymentType === 'balance') {
    await supabase.from('enrolments')
      .update({ tier: 'paid', full_payment_paid_at: new Date().toISOString() })
      .eq('student_id', studentId).eq('course_id', courseId)
  }

  return NextResponse.json({ ok: true })
}
