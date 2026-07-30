import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'

const VALID_TIERS = ['admitted', 'deposited', 'paid']

/** Admin-only: manually grant/adjust a student's course access (tier) and/or
 * cohort assignment. Bypasses Paystack entirely — same trusted server-side
 * write pattern as app/api/payment/verify, for cases paid outside the
 * automated flow (bank transfer, mobile money, etc). */
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const body = await request.json()
  const { studentId, courseId, tier, cohort, waterlineWeek } = body || {}

  if (!studentId || !courseId) {
    return NextResponse.json({ error: 'studentId and courseId are required' }, { status: 400 })
  }
  if (tier !== undefined && !VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: `tier must be one of ${VALID_TIERS.join(', ')}` }, { status: 400 })
  }

  const payload: Record<string, unknown> = { student_id: studentId, course_id: courseId }
  if (tier !== undefined) payload.tier = tier
  if (cohort !== undefined) payload.cohort = cohort || null
  if (waterlineWeek !== undefined) payload.waterline_week = waterlineWeek

  const supabase = createServiceClient()
  const { error } = await supabase.from('enrolments').upsert(payload, { onConflict: 'student_id,course_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
