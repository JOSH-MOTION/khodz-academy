import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'

interface SubmissionRow {
  id: string
  lesson_id: string
  student_id: string
  submission_url: string
  screenshot_url: string | null
  status: string
  feedback: string | null
  submitted_at: string
  graded_at: string | null
  lessons: { title: string; assignment_title: string | null; week_id: string } | { title: string; assignment_title: string | null; week_id: string }[] | null
}

function one<T>(v: T | T[] | null): T | null {
  if (!v) return null
  return Array.isArray(v) ? v[0] ?? null : v
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const supabase = createServiceClient()

  const [{ data: submissions, error: subErr }, { data: usersData, error: usersErr }] = await Promise.all([
    supabase
      .from('assignment_submissions')
      .select('id, lesson_id, student_id, submission_url, screenshot_url, status, feedback, submitted_at, graded_at, lessons(title, assignment_title, week_id)')
      .order('submitted_at', { ascending: false }),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ])

  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 })
  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 500 })

  const userMap = new Map(usersData.users.map((u) => [u.id, u]))

  const result = ((submissions || []) as unknown as SubmissionRow[]).map((s) => {
    const lesson = one(s.lessons)
    const student = userMap.get(s.student_id)
    return {
      id: s.id,
      lessonId: s.lesson_id,
      lessonTitle: lesson?.title || s.lesson_id,
      assignmentTitle: lesson?.assignment_title || null,
      studentId: s.student_id,
      studentName: student?.user_metadata?.full_name || student?.user_metadata?.name || student?.email?.split('@')[0] || 'Student',
      studentEmail: student?.email || null,
      submissionUrl: s.submission_url,
      screenshotUrl: s.screenshot_url,
      status: s.status,
      feedback: s.feedback,
      submittedAt: s.submitted_at,
      gradedAt: s.graded_at,
    }
  })

  return NextResponse.json({ submissions: result })
}

const VALID_STATUSES = ['submitted', 'pass', 'needs_revision']

/** Admin-only: grade a submission. */
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const body = await request.json()
  const { submissionId, status, feedback } = body || {}

  if (!submissionId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `submissionId is required and status must be one of ${VALID_STATUSES.join(', ')}` }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('assignment_submissions')
    .update({ status, feedback: feedback || null, graded_at: new Date().toISOString() })
    .eq('id', submissionId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
