import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SIGNED_URL_TTL_SECONDS = 60 * 60 // 1 hour

export async function GET(request: Request, { params }: RouteContext<'/api/lessons/[lessonId]/slides'>) {
  const { lessonId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // RLS on lesson_slides (admin bypass, or enrolled + unlocked) does the
  // authorization here: an unauthorized lessonId simply comes back empty.
  const { data: slides, error } = await supabase
    .from('lesson_slides')
    .select('slide_index, storage_path')
    .eq('lesson_id', lessonId)
    .order('slide_index', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!slides || slides.length === 0) return NextResponse.json({ slides: [] })

  const signed = await Promise.all(
    slides.map(async (s) => {
      const { data, error: urlError } = await supabase.storage
        .from('slides')
        .createSignedUrl(s.storage_path, SIGNED_URL_TTL_SECONDS)
      if (urlError || !data) return null
      return { index: s.slide_index, url: data.signedUrl }
    })
  )

  return NextResponse.json({ slides: signed.filter((s) => s !== null) })
}
