import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('id, course_id, title, body, created_at, courses(title)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const announcements = (data || []).map((a) => {
    const courses = a.courses as { title: string } | { title: string }[] | null
    const courseTitle = Array.isArray(courses) ? courses[0]?.title : courses?.title
    return {
      id: a.id,
      courseId: a.course_id,
      courseTitle: courseTitle || null,
      title: a.title,
      body: a.body,
      createdAt: a.created_at,
    }
  })

  return NextResponse.json({ announcements })
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const body = await request.json()
  const { title, body: message, courseId } = body || {}

  if (!title || !message) {
    return NextResponse.json({ error: 'title and body are required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('announcements').insert({
    title,
    body: message,
    course_id: courseId || null,
    created_by: admin.user.id,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id query param is required' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('announcements').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
