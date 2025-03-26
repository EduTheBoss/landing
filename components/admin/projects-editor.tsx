"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, Edit, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

interface Project {
  id: number
  title: string
  shortDescription: string
  fullDescription: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "E-commerce Platform",
      shortDescription:
        "A full-featured online store with payment processing, inventory management, and analytics dashboard.",
      fullDescription:
        "This comprehensive e-commerce solution provides businesses with everything they need to sell products online. Features include secure payment processing with Stripe, real-time inventory management, customer accounts, order tracking, and an advanced analytics dashboard for business insights. The platform is built with performance and SEO in mind, ensuring fast page loads and good search engine visibility.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Next.js", "Stripe", "MongoDB", "Redux", "TailwindCSS"],
      liveUrl: "https://example.com/ecommerce",
      githubUrl: "https://github.com/yourusername/ecommerce",
      featured: true,
    },
    {
      id: 2,
      title: "Health Tracking App",
      shortDescription:
        "Mobile-first application for tracking fitness goals, nutrition, and health metrics with data visualization.",
      fullDescription:
        "This health tracking application helps users monitor their fitness journey with comprehensive tracking tools. Users can log workouts, track nutrition intake, monitor vital health metrics, and visualize their progress over time with interactive charts. The app includes goal setting features, personalized recommendations, and social sharing capabilities to keep users motivated. Built with React Native for cross-platform compatibility and Firebase for real-time data synchronization.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["React Native", "Firebase", "D3.js", "Redux", "Expo"],
      liveUrl: "https://example.com/healthapp",
      githubUrl: "https://github.com/yourusername/health-tracker",
      featured: true,
    },
    {
      id: 3,
      title: "AI Content Generator",
      shortDescription:
        "Web application that leverages AI to generate marketing content, blog posts, and social media captions.",
      fullDescription:
        "This AI-powered content generation tool helps marketers and content creators produce high-quality written content quickly. The application uses advanced natural language processing models to generate blog posts, marketing copy, social media captions, and product descriptions based on user inputs. Features include content customization options, tone adjustment, multiple export formats, and a user-friendly interface for non-technical users. The backend is built with Python and Flask, while the frontend uses React for a responsive user experience.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Python", "OpenAI API", "React", "Flask", "PostgreSQL"],
      liveUrl: "https://example.com/ai-content",
      githubUrl: "https://github.com/yourusername/ai-content-generator",
      featured: true,
    },
  ])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    image: "/placeholder.svg?height=300&width=600",
    tags: [],
    liveUrl: "",
    githubUrl: "",
    featured: false,
  })
  const [tagInput, setTagInput] = useState("")
  const [editTagInput, setEditTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewProject((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setNewProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const handleAddProject = () => {
    if (newProject.title && newProject.shortDescription) {
      const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1
      setProjects((prev) => [...prev, { ...newProject, id: newId }])
      setNewProject({
        title: "",
        shortDescription: "",
        fullDescription: "",
        image: "/placeholder.svg?height=300&width=600",
        tags: [],
        liveUrl: "",
        githubUrl: "",
        featured: false,
      })
      toast({
        title: "Project added",
        description: "New project has been added successfully.",
      })
    }
  }

  const handleDeleteProject = (id: number) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id))
    toast({
      title: "Project deleted",
      description: "Project has been removed successfully.",
    })
  }

  const handleEditProject = (proj: Project) => {
    setEditingId(proj.id)
    setEditTagInput("")
  }

  const handleUpdateProject = (id: number) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj } : proj)))
    setEditingId(null)
    toast({
      title: "Project updated",
      description: "Project has been updated successfully.",
    })
  }

  const handleEditChange = (id: number, field: keyof Project, value: string | boolean) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)))
  }

  const handleAddEditTag = (id: number) => {
    if (editTagInput.trim()) {
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? { ...proj, tags: [...proj.tags, editTagInput.trim()] } : proj)),
      )
      setEditTagInput("")
    }
  }

  const handleRemoveEditTag = (id: number, index: number) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, tags: proj.tags.filter((_, i) => i !== index) } : proj)),
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id?: number) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real application, this would upload to a storage service
      // For demo purposes, we're just creating a local URL
      const url = URL.createObjectURL(file)

      if (id) {
        // Editing existing project
        setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, image: url } : proj)))
      } else {
        // New project
        setNewProject((prev) => ({
          ...prev,
          image: url,
        }))
      }
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
          <CardDescription>Add details about your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={newProject.title}
              onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="E-commerce Platform"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={newProject.shortDescription}
              onChange={(e) => setNewProject((prev) => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="A brief description of your project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              value={newProject.fullDescription}
              onChange={(e) => setNewProject((prev) => ({ ...prev, fullDescription: e.target.value }))}
              placeholder="A detailed description of your project"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <div className="flex items-center gap-4">
              <img
                src={newProject.image || "/placeholder.svg"}
                alt="Project"
                className="w-32 h-20 object-cover rounded-md border"
              />
              <Input id="image" type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                value={newProject.liveUrl}
                onChange={(e) => setNewProject((prev) => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://example.com/project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject((prev) => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {newProject.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={newProject.featured}
              onCheckedChange={(checked) => setNewProject((prev) => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddProject}>Add Project</Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Projects</h3>
        {projects.map((proj) => (
          <Card key={proj.id}>
            {editingId === proj.id ? (
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-title-${proj.id}`}>Project Title</Label>
                  <Input
                    id={`edit-title-${proj.id}`}
                    value={proj.title}
                    onChange={(e) => handleEditChange(proj.id, "title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-shortDescription-${proj.id}`}>Short Description</Label>
                  <Input
                    id={`edit-shortDescription-${proj.id}`}
                    value={proj.shortDescription}
                    onChange={(e) => handleEditChange(proj.id, "shortDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-fullDescription-${proj.id}`}>Full Description</Label>
                  <Textarea
                    id={`edit-fullDescription-${proj.id}`}
                    value={proj.fullDescription}
                    onChange={(e) => handleEditChange(proj.id, "fullDescription", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-image-${proj.id}`}>Project Image</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={proj.image || "/placeholder.svg"}
                      alt="Project"
                      className="w-32 h-20 object-cover rounded-md border"
                    />
                    <Input
                      id={`edit-image-${proj.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, proj.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-liveUrl-${proj.id}`}>Live Demo URL</Label>
                    <Input
                      id={`edit-liveUrl-${proj.id}`}
                      value={proj.liveUrl}
                      onChange={(e) => handleEditChange(proj.id, "liveUrl", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-githubUrl-${proj.id}`}>GitHub URL</Label>
                    <Input
                      id={`edit-githubUrl-${proj.id}`}
                      value={proj.githubUrl}
                      onChange={(e) => handleEditChange(proj.id, "githubUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-tags-${proj.id}`}>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`edit-tags-${proj.id}`}
                      value={editTagInput}
                      onChange={(e) => setEditTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEditTag(proj.id))}
                    />
                    <Button type="button" onClick={() => handleAddEditTag(proj.id)} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditTag(proj.id, index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`edit-featured-${proj.id}`}
                    checked={proj.featured}
                    onCheckedChange={(checked) => handleEditChange(proj.id, "featured", checked)}
                  />
                  <Label htmlFor={`edit-featured-${proj.id}`}>Featured Project</Label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleUpdateProject(proj.id)} size="sm">
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                  <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{proj.title}</CardTitle>
                        {proj.featured && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Featured</span>
                        )}
                      </div>
                      <CardDescription className="mt-1">{proj.shortDescription}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEditProject(proj)} variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteProject(proj.id)} variant="destructive" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={proj.image || "/placeholder.svg"}
                      alt={proj.title}
                      className="w-full md:w-48 h-32 object-cover rounded-md border"
                    />
                    <div>
                      <p className="mb-4 line-clamp-3">{proj.fullDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        {proj.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-muted text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

