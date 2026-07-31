import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cloudinaryConfigured, validateImageFile, uploadImageToCloudinary } from '@/lib/cloudinary'

/** Authenticated user uploads their own profile picture to Cloudinary. */
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
  const validationError = validateImageFile(file)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  try {
    const result = await uploadImageToCloudinary(file as File, {
      folder: `${process.env.CLOUDINARY_FOLDER_NAME || 'khodz-academy'}/avatars`,
      public_id: user.id,
      transformation: [{ width: 512, height: 512, crop: 'fill', gravity: 'face' }],
    })
    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error('Cloudinary upload failed:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
