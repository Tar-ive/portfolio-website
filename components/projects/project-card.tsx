"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Globe, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Project } from "@/lib/types"
import { VideoPreview } from "@/components/video-preview"

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const isCurrentlyBuilding = project.status === 'currently-building'
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isCurrentlyBuilding ? "border-2 border-blue-500 shadow-blue-100" : ""
    } ${featured ? "md:col-span-2" : ""}`}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 space-y-1">
          <CardTitle className={`${featured ? "text-2xl" : "text-xl"}`}>
            {project.title}
          </CardTitle>
          {project.subtitle && (
            <p className="text-sm text-muted-foreground">{project.subtitle}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 self-start sm:self-center">
          <Badge 
            variant={isCurrentlyBuilding ? "default" : "secondary"}
            className={isCurrentlyBuilding ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {project.status === 'currently-building' ? 'Currently Building' : 
             project.status === 'completed' ? 'Completed' : 
             'Research'}
          </Badge>
          {project.pinned && (
            <Badge variant="outline" className="text-xs">
              📌 Pinned
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Media Section */}
        {(project.image || project.video) && (
          <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
            <div 
              className="relative w-full"
              style={{ aspectRatio: featured ? "16/9" : "16/10" }}
            >
              {project.video ? (
                <VideoPreview 
                  src={project.video} 
                  poster={project.image} 
                  aspectRatio={featured ? "16/9" : "16/9"}
                />
              ) : project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                />
              ) : null}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, featured ? 8 : 4).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > (featured ? 8 : 4) && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - (featured ? 8 : 4)} more
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(project.date).toLocaleDateString()}</span>
          </div>
          {project.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{project.readingTime} min read</span>
            </div>
          )}
          {project.category && (
            <Badge variant="outline" className="text-xs">
              {project.category}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/projects/${project.slug}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          
          <div className="flex gap-2">
            {project.github && (
              <Link href={project.github} target="_blank">
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {project.live && (
              <Link href={project.live} target="_blank">
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}