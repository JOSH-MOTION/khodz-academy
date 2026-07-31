import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cloudinaryConfigured, validateImageFile, uploadImageToCloudinary } from '@/lib/cloudinary'

/** Authenticated student uploads a screenshot of their assignment work,
 * alongside the submission link. One per lesson per student — re-uploading
 * overwrites the previous screenshot for that lesson. */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!cloudinaryConfigured()) {
    console.error('Cloudinary env vars are not configured')
    return NextResponse.json({ error: 'Image upload is not configured yet' }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const lessonId = formData.get('lessonId')
  if (typeof lessonId !== 'string' || !lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
  }
  const validationError = validateImageFile(file)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  try {
    const result = await uploadImageToCloudinary(file as File, {
      folder: `${process.env.CLOUDINARY_FOLDER_NAME || 'khodz-academy'}/submissions`,
      public_id: `${lessonId}-${user.id}`,
    })
    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error('Cloudinary upload failed:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
