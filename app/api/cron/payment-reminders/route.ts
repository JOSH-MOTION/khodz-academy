import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { COURSES_MAP } from '@/lib/courses-data'
import { sendUrgentPaymentReminderEmail } from '@/lib/mail'

const REMINDER_WINDOW_DAYS = 3

interface EnrolmentDue {
  student_id: string
  course_id: string
  payment_deadline: string
}

/** Runs daily (see vercel.json crons). For every 'deposited' student whose
 * payment_deadline is within the next few days and hasn't been reminded
 * yet, sends an email + creates an in-app notification, then marks it sent
 * so it never fires twice for the same deadline. */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const windowEnd = new Date()
    windowEnd.setDate(windowEnd.getDate() + REMINDER_WINDOW_DAYS)

    const { data: dueEnrolments, error: dueErr } = await supabase
      .from('enrolments')
      .select('student_id, course_id, payment_deadline')
      .eq('tier', 'deposited')
      .is('reminder_sent_at', null)
      .not('payment_deadline', 'is', null)
      .lte('payment_deadline', windowEnd.toISOString())

    if (dueErr) throw dueErr
    if (!dueEnrolments || dueEnrolments.length === 0) {
      return NextResponse.json({ ok: true, remindersSent: 0 })
    }

    let remindersSent = 0

    for (const e of dueEnrolments as EnrolmentDue[]) {
      const course = COURSES_MAP[e.course_id]
      if (!course) continue

      const { data: { user: studentUser } } = await supabase.auth.admin.getUserById(e.student_id)
      const email = studentUser?.email
      if (!email) continue
      const name = studentUser?.user_metadata?.full_name || studentUser?.user_metadata?.name || email.split('@')[0] || 'Student'

      const { data: paymentsForCourse } = await supabase
        .from('payments')
        .select('amount')
        .eq('student_id', e.student_id)
        .eq('course_id', e.course_id)
      const amountPaid = (paymentsForCourse || []).reduce((sum, p) => sum + Number(p.amount), 0)
      const balanceGhs = Math.max(0, course.tuitionGhs - amountPaid)

      await sendUrgentPaymentReminderEmail(email, name, course.title, balanceGhs, e.payment_deadline)

      await supabase.from('notifications').insert({
        student_id: e.student_id,
        title: 'Balance payment due soon',
        body: `Your remaining balance of GHS ${balanceGhs.toFixed(2)} for ${course.title} is due by ${new Date(e.payment_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Pay now to avoid losing access to upcoming weeks.`,
      })

      await supabase
        .from('enrolments')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('student_id', e.student_id)
        .eq('course_id', e.course_id)

      remindersSent++
    }

    return NextResponse.json({ ok: true, remindersSent })
  } catch (err) {
    console.error('Cron payment-reminders failed:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 })
  }
}
