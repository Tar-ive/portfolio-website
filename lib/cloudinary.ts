import { v2 as cloudinary } from 'cloudinary'
import { config, services } from './config'

// Configure Cloudinary if available
if (config.features.cloudinary && config.cloudinary) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  })
  console.log("✅ Cloudinary configured successfully")
} else {
  console.log("⚠️ Cloudinary not configured - using local fallbacks")
}

export interface ImageTransformation {
  width?: number
  height?: number
  quality?: string | number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'crop'
  gravity?: 'auto' | 'face' | 'center'
}

/**
 * Generate optimized Cloudinary URL with fallback
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  transformations: ImageTransformation = {}
): string {
  // If it's already a full URL, return as-is (fallback)
  if (publicIdOrUrl.startsWith('http')) {
    return publicIdOrUrl
  }

  // Skip if Cloudinary is not configured
  if (!config.features.cloudinary || !config.cloudinary) {
    return `/media/${publicIdOrUrl}` // Fallback to local media
  }

  try {
    const cloudName = config.cloudinary.cloudName
    
    // Default transformations for performance
    const defaultTransforms = {
      quality: 'auto:good',
      format: 'auto',
      ...transformations
    }

    // Build transformation string
    const transforms = Object.entries(defaultTransforms)
      .map(([key, value]) => {
        switch (key) {
          case 'width':
            return `w_${value}`
          case 'height':
            return `h_${value}`
          case 'quality':
            return `q_${value}`
          case 'format':
            return `f_${value}`
          case 'crop':
            return `c_${value}`
          case 'gravity':
            return `g_${value}`
          default:
            return null
        }
      })
      .filter(Boolean)
      .join(',')

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicIdOrUrl}`
  } catch (error) {
    console.warn('Failed to generate Cloudinary URL, falling back to local:', error)
    return `/media/${publicIdOrUrl}`
  }
}

/**
 * Get responsive image URLs for different screen sizes
 */
export function getResponsiveImageUrls(
  publicId: string,
  baseTransformations: ImageTransformation = {}
) {
  const sizes = [
    { name: 'mobile', width: 640 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1024 },
    { name: 'large', width: 1280 }
  ]

  return sizes.reduce((acc, size) => {
    acc[size.name] = getOptimizedImageUrl(publicId, {
      ...baseTransformations,
      width: size.width
    })
    return acc
  }, {} as Record<string, string>)
}

/**
 * Generate video thumbnail URL
 */
export function getVideoThumbnailUrl(
  publicId: string,
  transformations: ImageTransformation = {}
): string {
  if (!config.features.cloudinary || !config.cloudinary) {
    return `/media/thumbnails/${publicId}.jpg` // Fallback
  }

  try {
    const cloudName = config.cloudinary.cloudName
    return `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${publicId}.jpg`
  } catch (error) {
    console.warn('Failed to generate video thumbnail URL:', error)
    return `/media/thumbnails/${publicId}.jpg`
  }
}

/**
 * Check if Cloudinary is properly configured
 */
export function isCloudinaryConfigured(): boolean {
  return config.features.cloudinary && !!config.cloudinary
}

/**
 * Media asset management with fallbacks
 */
export const mediaAssets = {
  // Profile and personal images
  profile: {
    main: 'portfolio/saksham-profile',
    avatar: 'portfolio/saksham-avatar', 
    hero: 'portfolio/saksham-hero'
  },
  
  // Project assets
  projects: {
    findAndFund: {
      hero: 'portfolio/projects/find-and-fund-hero',
      demo: 'portfolio/projects/find-and-fund-demo',
      thumbnail: 'portfolio/projects/find-and-fund-thumb'
    },
    obvius: {
      hero: 'portfolio/projects/obvius-hero',
      demo: 'portfolio/projects/obvius-demo',
      thumbnail: 'portfolio/projects/obvius-thumb'
    },
    enhancedExa: {
      hero: 'portfolio/projects/enhanced-exa-hero',
      demo: 'portfolio/projects/enhanced-exa-demo',
      thumbnail: 'portfolio/projects/enhanced-exa-thumb'
    }
  },
  
  // Background and decorative assets
  backgrounds: {
    hero: 'portfolio/bg/hero-gradient',
    section: 'portfolio/bg/section-pattern'
  }
}

/**
 * Get asset URL with automatic fallback
 */
export function getAssetUrl(assetPath: string, transformations: ImageTransformation = {}): string {
  // Try Cloudinary first
  const cloudinaryUrl = getOptimizedImageUrl(assetPath, transformations)
  
  // If Cloudinary fails or isn't configured, provide local fallback
  if (!isCloudinaryConfigured() || cloudinaryUrl.includes('/media/')) {
    // Extract filename from path for fallback
    const filename = assetPath.split('/').pop() || assetPath
    return `/media/${filename}.jpg` // Default extension for fallback
  }
  
  return cloudinaryUrl
}

export default {
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  getVideoThumbnailUrl,
  isCloudinaryConfigured,
  getAssetUrl,
  mediaAssets
}