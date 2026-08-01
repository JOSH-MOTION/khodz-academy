import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'

/** Admin-only: update a course's scheduling/deposit settings.
 * Writes via the service-role client — `courses` only has a public SELECT
 * policy, no client-side UPDATE policy. */
export async function PATCH(request: Request, { params }: RouteContext<'/api/admin/courses/[courseId]'>) {
  try {
    const admin = await requireAdmin()
    if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

    const { courseId } = await params
    const body = await request.json()
    const { endDate, depositPercent, reminderLeadDays, admissionGhs, tuitionGhs, promoPriceGhs } = body || {}

    const payload: Record<string, unknown> = {}
    if (endDate !== undefined) payload.end_date = endDate || null
    if (depositPercent !== undefined) payload.deposit_percent = depositPercent
    if (reminderLeadDays !== undefined) payload.reminder_lead_days = reminderLeadDays
    if (admissionGhs !== undefined) payload.admission_ghs = admissionGhs === '' ? null : admissionGhs
    if (tuitionGhs !== undefined) payload.tuition_ghs = tuitionGhs === '' ? null : tuitionGhs
    if (promoPriceGhs !== undefined) payload.promo_price_ghs = promoPriceGhs === '' ? null : promoPriceGhs

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase.from('courses').update(payload).eq('id', courseId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PATCH /api/admin/courses/[courseId] failed:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 })
  }
}
