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
  try {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const supabase = createServiceClient()

  const [{ data: usersData, error: usersErr }, { data: profiles, error: profilesErr }, { data: enrolments, error: enrolErr }, { data: payments, error: payErr }] =
    await Promise.all([
      supabase.auth.admin.listUsers({ perPage: 1000 }),
      supabase
        .from('profiles')
        .select(
          'id, role, full_name, avatar_url, phone, date_of_birth, gender, address, education_background, occupation, emergency_contact_name, emergency_contact_phone, referral_source, motivation, profile_completed'
        ),
      supabase.from('enrolments').select('id, student_id, course_id, tier, cohort, waterline_week, payment_deadline, created_at, courses(title)'),
      supabase.from('payments').select('id, student_id, course_id, amount, payment_type, paystack_status, paid_at'),
    ])

  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 500 })
  if (profilesErr) return NextResponse.json({ error: profilesErr.message }, { status: 500 })
  if (enrolErr) return NextResponse.json({ error: enrolErr.message }, { status: 500 })
  if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 })

  const adminIds = new Set((profiles || []).filter((p) => p.role === 'admin').map((p) => p.id))
  const profileById = new Map((profiles || []).map((p) => [p.id, p]))
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
    .map((u) => {
      const profile = profileById.get(u.id)
      return {
      id: u.id,
      email: u.email,
      name: profile?.full_name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Student',
      avatarUrl: profile?.avatar_url || null,
      phone: profile?.phone || null,
      dateOfBirth: profile?.date_of_birth || null,
      gender: profile?.gender || null,
      address: profile?.address || null,
      educationBackground: profile?.education_background || null,
      occupation: profile?.occupation || null,
      emergencyContactName: profile?.emergency_contact_name || null,
      emergencyContactPhone: profile?.emergency_contact_phone || null,
      referralSource: profile?.referral_source || null,
      motivation: profile?.motivation || null,
      profileCompleted: profile?.profile_completed ?? null,
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
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ students })
  } catch (err) {
    console.error('GET /api/admin/students failed:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 })
  }
}
