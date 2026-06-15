import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canAccessLesson } from '@/lib/access'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')
  
  if (!lessonId) {
    return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 })
  }

  // 1. Verify user session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Check access using canAccessLesson()
  const access = await canAccessLesson(user.id, lessonId, supabase)
  if (!access.allowed) {
    return NextResponse.json({ error: access.reason }, { status: 403 })
  }

  // 3. Get storage path
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons').select('slide_storage_path').eq('id', lessonId).single()
    
  if (lessonError || !lesson?.slide_storage_path) {
    return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
  }

  // 4. Generate signed URL — expires in 2 hours
  const { data, error: urlError } = await supabase.storage
    .from('slides')
    .createSignedUrl(lesson.slide_storage_path, 7200)
    
  if (urlError || !data) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }

  // 5. Log access
  await supabase.from('access_log').insert({
    student_id: user.id, lesson_id: lessonId, access_type: 'slide_view'
  })

  return NextResponse.json({ url: data.signedUrl })
}
