import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB

export function cloudinaryConfigured() {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
}

/** Validates a form-data file is a real image under the size limit. Returns
 * an error string, or null if it's fine. */
export function validateImageFile(file: unknown): string | null {
  if (!(file instanceof File)) return 'file is required'
  if (!file.type.startsWith('image/')) return 'File must be an image'
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be under 5MB'
  return null
}

/** Signed server-side upload to Cloudinary (secret key never reaches the
 * client). Shared by every image-upload route in this app. */
export async function uploadImageToCloudinary(file: File, options: Partial<UploadApiOptions>) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const buffer = Buffer.from(await file.arrayBuffer())

  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER_NAME || 'khodz-academy',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
        overwrite: true,
        resource_type: 'image',
        ...options,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) return reject(error || new Error('Upload failed'))
        resolve(uploadResult as { secure_url: string })
      }
    )
    uploadStream.end(buffer)
  })
}
