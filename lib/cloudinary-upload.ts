import { v2 as cloudinary } from 'cloudinary'
import { readFileSync } from 'fs'
import { basename, extname } from 'path'
import { config, requireService } from './config'

// Configure Cloudinary with centralized config
if (config.features.cloudinary && config.cloudinary) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  })
}

export interface CloudinaryUploadResult {
  public_id: string
  url: string
  secure_url: string
  width?: number
  height?: number
  format: string
  resource_type: string
}

export interface UploadOptions {
  folder?: string
  quality?: string | number
  format?: string
  transformation?: any[]
}

/**
 * Upload a file to Cloudinary with automatic optimization
 */
export async function uploadToCloudinary(
  filePath: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  // Validate Cloudinary configuration
  requireService('cloudinary')

  try {
    const fileName = basename(filePath, extname(filePath))
    const fileExtension = extname(filePath).toLowerCase()
    
    // Determine resource type
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm']
    
    let resourceType: 'image' | 'video' | 'raw' = 'raw'
    if (imageExtensions.includes(fileExtension)) {
      resourceType = 'image'
    } else if (videoExtensions.includes(fileExtension)) {
      resourceType = 'video'
    }

    // Default optimization settings
    const uploadOptions = {
      public_id: `portfolio/${fileName}`,
      folder: options.folder || 'portfolio',
      resource_type: resourceType,
      quality: options.quality || 'auto:good',
      fetch_format: 'auto',
      ...options,
    }

    // Add image-specific optimizations
    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
        ...(options.transformation || [])
      ]
    }

    console.log(`Uploading ${filePath} to Cloudinary...`)
    const result = await cloudinary.uploader.upload(filePath, uploadOptions)

    console.log(`Successfully uploaded: ${result.secure_url}`)
    return {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    }
  } catch (error) {
    console.error(`Failed to upload ${filePath} to Cloudinary:`, error)
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload file from buffer/base64 data
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer | string,
  fileName: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  requireService('cloudinary')

  try {
    const uploadOptions = {
      public_id: `portfolio/${fileName}`,
      folder: options.folder || 'portfolio',
      resource_type: 'auto' as const,
      quality: options.quality || 'auto:good',
      fetch_format: 'auto',
      ...options,
    }

    const result = await cloudinary.uploader.upload(
      `data:image/upload;base64,${buffer.toString('base64')}`,
      uploadOptions
    )

    return {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    }
  } catch (error) {
    console.error(`Failed to upload buffer to Cloudinary:`, error)
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  requireService('cloudinary')

  try {
    await cloudinary.uploader.destroy(publicId)
    console.log(`Successfully deleted ${publicId} from Cloudinary`)
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, error)
    throw new Error(`Cloudinary deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate optimized URL for existing Cloudinary asset
 */
export function generateOptimizedUrl(
  publicId: string,
  transformations: any[] = []
): string {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
      ...transformations
    ]
  })
}

/**
 * Get media info from Cloudinary
 */
export async function getMediaInfo(publicId: string) {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary API credentials are missing.')
  }

  try {
    const result = await cloudinary.api.resource(publicId)
    return {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      created_at: result.created_at,
    }
  } catch (error) {
    console.error(`Failed to get media info for ${publicId}:`, error)
    throw new Error(`Failed to get media info: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}