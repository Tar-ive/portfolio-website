'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getOptimizedImageUrl, getAssetUrl, ImageTransformation } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  transformations?: ImageTransformation
  fallbackSrc?: string
  onError?: () => void
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  transformations = {},
  fallbackSrc,
  onError,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => {
    // Try to get optimized URL, fall back to original if Cloudinary fails
    try {
      return getAssetUrl(src, transformations)
    } catch (error) {
      console.warn('Failed to generate optimized image URL:', error)
      return src.startsWith('/') ? src : `/media/${src}`
    }
  })
  
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      
      // Try fallback URL if provided
      if (fallbackSrc) {
        setCurrentSrc(fallbackSrc)
      } else {
        // Generate local fallback path
        const filename = src.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'placeholder'
        const fallback = `/media/${filename}.jpg`
        setCurrentSrc(fallback)
      }
      
      onError?.()
    }
  }

  const imageProps = {
    src: currentSrc,
    alt,
    className: cn('transition-opacity duration-200', className),
    onError: handleError,
    priority,
    sizes: sizes || (fill ? '100vw' : undefined),
    ...props
  }

  if (fill) {
    return <Image {...imageProps} fill />
  }

  return (
    <Image
      {...imageProps}
      width={width || 800}
      height={height || 600}
    />
  )
}

// Specialized components for common use cases
export function ProfileImage({
  className,
  size = 200,
  ...props
}: Omit<OptimizedImageProps, 'src' | 'alt' | 'width' | 'height'> & {
  size?: number
}) {
  return (
    <OptimizedImage
      src="portfolio/saksham-profile"
      alt="Saksham Adhikari"
      width={size}
      height={size}
      className={cn('rounded-full', className)}
      transformations={{
        width: size,
        height: size,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto:good'
      }}
      fallbackSrc="/media/profile-placeholder.jpg"
      {...props}
    />
  )
}

export function ProjectImage({
  projectId,
  variant = 'hero',
  className,
  ...props
}: Omit<OptimizedImageProps, 'src' | 'alt'> & {
  projectId: string
  variant?: 'hero' | 'thumbnail' | 'demo'
}) {
  const src = `portfolio/projects/${projectId}-${variant}`
  
  return (
    <OptimizedImage
      src={src}
      alt={`${projectId} ${variant}`}
      className={cn('object-cover', className)}
      transformations={{
        quality: 'auto:good',
        format: 'auto'
      }}
      fallbackSrc={`/media/projects/${projectId}-${variant}.jpg`}
      {...props}
    />
  )
}

export function BackgroundImage({
  pattern = 'hero',
  className,
  ...props
}: Omit<OptimizedImageProps, 'src' | 'alt'> & {
  pattern?: string
}) {
  return (
    <OptimizedImage
      src={`portfolio/bg/${pattern}`}
      alt=""
      fill
      className={cn('object-cover -z-10', className)}
      transformations={{
        quality: 'auto:eco',
        format: 'auto'
      }}
      fallbackSrc={`/media/bg/${pattern}.jpg`}
      priority={pattern === 'hero'}
      {...props}
    />
  )
}