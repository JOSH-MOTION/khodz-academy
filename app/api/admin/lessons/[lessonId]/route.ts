import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'

/** Admin-only: update a lesson's content links and/or assignment fields.
 * Writes via the service-role client because `lessons` has no client-side
 * UPDATE policy (RLS only grants enrolled students SELECT) — the same
 * trusted server-side pattern used everywhere else in this app. */
export async function PATCH(request: Request, { params }: RouteContext<'/api/admin/lessons/[lessonId]'>) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const { lessonId } = await params
  const body = await request.json()
  const { video_url, slides_url, assignment_title, assignment_description, assignment_due_at } = body || {}

  const payload: Record<string, unknown> = {}
  if (video_url !== undefined) payload.video_url = video_url || null
  if (slides_url !== undefined) payload.slides_url = slides_url || null
  if (assignment_title !== undefined) payload.assignment_title = assignment_title || null
  if (assignment_description !== undefined) payload.assignment_description = assignment_description || null
  if (assignment_due_at !== undefined) payload.assignment_due_at = assignment_due_at || null

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('lessons').update(payload).eq('id', lessonId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
