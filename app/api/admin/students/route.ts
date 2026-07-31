import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'
import { COURSES_MAP } from '@/lib/courses-data'

interface EnrolmentRow {
  id: string
  student_id: string
  course_id: string
  tier: string
  cohort: string | null
  waterline_week: number
  payment_deadline: string | null
  created_at: string
  courses: { title: string } | { title: string }[] | null
}

interface PaymentRow {
  id: string
  student_id: string
  course_id: string | null
  amount: number
  payment_type: string
  paystack_status: string
  paid_at: string
}

function courseTitleOf(courses: EnrolmentRow['courses']) {
  if (!courses) return null
  return Array.isArray(courses) ? courses[0]?.title ?? null : courses.title
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const supabase = createServiceClient()

  const [{ data: usersData, error: usersErr }, { data: profiles, error: profilesErr }, { data: enrolments, error: enrolErr }, { data: payments, error: payErr }] =
    await Promise.all([
      supabase.auth.admin.listUsers({ perPage: 1000 }),
      supabase.from('profiles').select('id, role'),
      supabase.from('enrolments').select('id, student_id, course_id, tier, cohort, waterline_week, payment_deadline, created_at, courses(title)'),
      supabase.from('payments').select('id, student_id, course_id, amount, payment_type, paystack_status, paid_at'),
    ])

  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 500 })
  if (profilesErr) return NextResponse.json({ error: profilesErr.message }, { status: 500 })
  if (enrolErr) return NextResponse.json({ error: enrolErr.message }, { status: 500 })
  if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 })

  const adminIds = new Set((profiles || []).filter((p) => p.role === 'admin').map((p) => p.id))
  const enrolmentsByStudent = new Map<string, EnrolmentRow[]>()
  for (const e of (enrolments || []) as EnrolmentRow[]) {
    const list = enrolmentsByStudent.get(e.student_id) || []
    list.push(e)
    enrolmentsByStudent.set(e.student_id, list)
  }
  const paymentsByStudent = new Map<string, PaymentRow[]>()
  for (const p of (payments || []) as PaymentRow[]) {
    const list = paymentsByStudent.get(p.student_id) || []
    list.push(p)
    paymentsByStudent.set(p.student_id, list)
  }

  const students = usersData.users
    .filter((u) => !adminIds.has(u.id))
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Student',
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
      enrolments: (enrolmentsByStudent.get(u.id) || []).map((e) => {
        const totalPriceGhs = COURSES_MAP[e.course_id]?.totalGhs ?? null
        const amountPaid = (paymentsByStudent.get(u.id) || [])
          .filter((p) => p.course_id === e.course_id)
          .reduce((sum, p) => sum + Number(p.amount), 0)
        return {
          id: e.id,
          courseId: e.course_id,
          courseTitle: courseTitleOf(e.courses),
          tier: e.tier,
          cohort: e.cohort,
          waterlineWeek: e.waterline_week,
          paymentDeadline: e.payment_deadline,
          enrolledAt: e.created_at,
          amountPaid,
          totalPriceGhs,
          remainingGhs: totalPriceGhs !== null ? Math.max(0, totalPriceGhs - amountPaid) : null,
        }
      }),
      payments: (paymentsByStudent.get(u.id) || [])
        .sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())
        .map((p) => ({
          courseId: p.course_id,
          amount: p.amount,
          paymentType: p.payment_type,
          status: p.paystack_status,
          paidAt: p.paid_at,
        })),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ students })
}
