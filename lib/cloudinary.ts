const CLOUDINARY_CLOUD_NAME = 'dvjrzkbnx'

export const getCloudinaryUrl = (publicId: string): string => {
  if (!publicId) return ''
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
}

export const getCloudinaryVideoUrl = (publicId: string): string => {
  if (!publicId) return ''
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}`
}

export interface CloudinaryResponse {
  secure_url: string;
  // Add other properties you need
} 