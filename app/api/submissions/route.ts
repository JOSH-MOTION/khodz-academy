import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

/** Student submits (or resubmits) an assignment link. student_id always
 * comes from the caller's own session, never the request body — a student
 * can only ever write their own row. Resubmitting resets status/feedback
 * back to 'submitted' for re-review. */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { lessonId, submissionUrl } = body || {}

  if (!lessonId || !submissionUrl) {
    return NextResponse.json({ error: 'lessonId and submissionUrl are required' }, { status: 400 })
  }
  try {
    new URL(submissionUrl)
  } catch {
    return NextResponse.json({ error: 'submissionUrl must be a valid URL' }, { status: 400 })
  }

  const service = createServiceClient()
  const { error } = await service.from('assignment_submissions').upsert(
    {
      lesson_id: lessonId,
      student_id: user.id,
      submission_url: submissionUrl,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      feedback: null,
      graded_at: null,
    },
    { onConflict: 'lesson_id,student_id' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
