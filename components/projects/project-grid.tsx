"use client"

import { Project } from "@/lib/types"
import { ProjectCard } from "./project-card"

interface ProjectGridProps {
  projects: Project[]
  featured?: boolean
}

export function ProjectGrid({ projects, featured = false }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${
      featured 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }`}>
      {projects.map((project, index) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          featured={featured && index === 0}
        />
      ))}
    </div>
  )
}