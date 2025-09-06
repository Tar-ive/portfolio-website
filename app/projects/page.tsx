import { getAllProjects } from "@/lib/projects"
import { ProjectGrid } from "@/components/projects/project-grid"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  
  // Separate projects by status
  const currentlyBuilding = projects.filter(p => p.status === 'currently-building')
  const completed = projects.filter(p => p.status === 'completed')
  const research = projects.filter(p => p.status === 'research')
  
  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)))
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of my work spanning AI/ML applications, web development, 
          and research projects. From hackathon wins to production applications.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentlyBuilding.length}</div>
            <div className="text-sm text-muted-foreground">Currently Building</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completed.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{allTags.length}</div>
            <div className="text-sm text-muted-foreground">Technologies</div>
          </CardContent>
        </Card>
      </div>

      {/* Currently Building Projects */}
      {currentlyBuilding.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">Currently Building</h2>
            <Badge className="bg-blue-600 hover:bg-blue-700">
              {currentlyBuilding.length} project{currentlyBuilding.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <ProjectGrid projects={currentlyBuilding} featured />
        </section>
      )}

      {currentlyBuilding.length > 0 && (completed.length > 0 || research.length > 0) && (
        <Separator className="my-12" />
      )}

      {/* Completed Projects */}
      {completed.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">Completed Projects</h2>
            <Badge variant="secondary">
              {completed.length} project{completed.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <ProjectGrid projects={completed} />
        </section>
      )}

      {completed.length > 0 && research.length > 0 && (
        <Separator className="my-12" />
      )}

      {/* Research Projects */}
      {research.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">Research Projects</h2>
            <Badge variant="outline">
              {research.length} project{research.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <ProjectGrid projects={research} />
        </section>
      )}

      {/* All Technologies */}
      <section className="mt-16">
        <h3 className="text-xl font-semibold mb-4">Technologies Used</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.sort().map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  )
}