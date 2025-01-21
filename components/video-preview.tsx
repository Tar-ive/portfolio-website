"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'

interface VideoPreviewProps {
  src: string
  poster?: string
  aspectRatio?: "16/9" | "1/1"
}

export function VideoPreview({ src, poster, aspectRatio = "16/9" }: VideoPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const togglePlay = async () => {
    if (!videoRef.current) return

    setIsLoading(true)
    try {
      if (isPlaying) {
        await videoRef.current.pause()
      } else {
        await videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error('Video playback error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetVideo = () => {
    if (!videoRef.current) return
    videoRef.current.pause()
    videoRef.current.currentTime = 0
    setIsPlaying(false)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-black"
    >
      {/* Center container for square videos */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          maxWidth: aspectRatio === "1/1" ? "calc(100vh * 9/16)" : "100%",
          margin: "0 auto"
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={poster}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Controls - fixed position at bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={togglePlay}
            disabled={isLoading}
            className="bg-black/50 hover:bg-black/70 disabled:opacity-50"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={resetVideo}
            disabled={isLoading}
            className="bg-black/50 hover:bg-black/70 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4 text-white" />
          </Button>
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-black/50 hover:bg-black/70"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 text-white" />
          ) : (
            <Maximize2 className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
    </div>
  )
}
