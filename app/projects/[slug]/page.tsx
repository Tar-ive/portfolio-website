import { notFound } from "next/navigation"
import { getAllProjects, getProject } from "@/lib/projects"
import { compileProjectMDX } from "@/lib/mdx"
import { defaultComponents } from "@/components/mdx/default-components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Github, Globe, Calendar, Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { VideoPreview } from "@/components/video-preview"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    const project = await getProject(params.slug)
    
    // Compile the MDX content with default components
    const { content } = await compileProjectMDX(project.content, defaultComponents)
    
    const isCurrentlyBuilding = project.status === 'currently-building'
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
                {project.subtitle && (
                  <p className="text-xl text-muted-foreground">{project.subtitle}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Badge 
                  variant={isCurrentlyBuilding ? "default" : "secondary"}
                  className={`${isCurrentlyBuilding ? "bg-blue-600 hover:bg-blue-700" : ""} text-sm px-3 py-1`}
                >
                  {project.status === 'currently-building' ? 'Currently Building' : 
                   project.status === 'completed' ? 'Completed' : 
                   'Research'}
                </Badge>
                {project.pinned && (
                  <Badge variant="outline" className="text-sm">
                    📌 Pinned Project
                  </Badge>
                )}
              </div>
            </div>

            {/* Project Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.date).toLocaleDateString()}</span>
              </div>
              {project.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{project.readingTime} min read</span>
                </div>
              )}
              {project.category && (
                <Badge variant="outline" className="text-sm">
                  {project.category}
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {project.github && (
                <Link href={project.github} target="_blank">
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" />
                    View Code
                  </Button>
                </Link>
              )}
              {project.live && (
                <Link href={project.live} target="_blank">
                  <Button className="gap-2">
                    <Globe className="h-4 w-4" />
                    Live Demo
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Project Media */}
          {(project.image || project.video) && (
            <Card className="overflow-hidden mb-8">
              <CardContent className="p-0">
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  {project.video ? (
                    <VideoPreview 
                      src={project.video} 
                      poster={project.image} 
                      aspectRatio="16/9"
                    />
                  ) : project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Project Content */}
        <div className="max-w-none">
          <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
            {content}
          </article>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex justify-between items-center">
            <Link href="/projects">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex gap-3">
              {project.github && (
                <Link href={project.github} target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                </Link>
              )}
              {project.live && (
                <Link href={project.live} target="_blank">
                  <Button size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Live Demo
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading project:', error)
    notFound()
  }
}