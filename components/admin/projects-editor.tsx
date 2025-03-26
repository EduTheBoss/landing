"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, Edit, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { usePortfolioData } from "../data-provider"
import { useApi } from "@/hooks/use-api"
import { Project } from "../data-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsEditor() {
  const { projects: initialProjects, isLoading: isLoadingProjects, refreshData } = usePortfolioData();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    image: "/placeholder.svg?height=300&width=600",
    tags: [],
    liveUrl: "",
    githubUrl: "",
    featured: false,
  });
  
  const [tagInput, setTagInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  
  const api = useApi();

  // Update local state when projects data is loaded
  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewProject((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setNewProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddProject = async () => {
    if (newProject.title && newProject.shortDescription) {
      setIsSubmitting(true);
      
      try {
        const result = await api.post('/api/projects', newProject);
        
        if (result.success) {
          // Reset form
          setNewProject({
            title: "",
            shortDescription: "",
            fullDescription: "",
            image: "/placeholder.svg?height=300&width=600",
            tags: [],
            liveUrl: "",
            githubUrl: "",
            featured: false,
          });
          
          // Refresh data from API
          await refreshData();
          
          toast({
            title: "Project added",
            description: "New project has been added successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add project.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Project add error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteProject = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      const result = await api.del(`/api/projects/${id}`);
      
      if (result.success) {
        // Update local state
        setProjects((prev) => prev.filter((proj) => proj.id !== id));
        
        toast({
          title: "Project deleted",
          description: "Project has been removed successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Project delete error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = (proj: Project) => {
    setEditingId(proj.id);
    setEditTagInput("");
  };

  const handleUpdateProject = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      // Find the project to update
      const projToUpdate = projects.find(proj => proj.id === id);
      
      if (!projToUpdate) {
        toast({
          title: "Error",
          description: "Project not found.",
          variant: "destructive",
        });
        return;
      }
      
      const result = await api.put(`/api/projects/${id}`, projToUpdate);
      
      if (result.success) {
        setEditingId(null);
        
        toast({
          title: "Project updated",
          description: "Project has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Project update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditChange = (id: number, field: keyof Project, value: string | boolean) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)));
  };

  const handleAddEditTag = (id: number) => {
    if (editTagInput.trim()) {
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? { ...proj, tags: [...proj.tags, editTagInput.trim()] } : proj))
      );
      setEditTagInput("");
    }
  };

  const handleRemoveEditTag = (id: number, index: number) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, tags: proj.tags.filter((_, i) => i !== index) } : proj))
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Use fetch directly since our useApi hook doesn't support FormData
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          if (id) {
            // Editing existing project
            setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, image: data.filePath } : proj)));
          } else {
            // New project
            setNewProject((prev) => ({
              ...prev,
              image: data.filePath,
            }));
          }
          
          toast({
            title: "Image uploaded",
            description: "Project image has been uploaded successfully.",
          });
        } else {
          toast({
            title: "Upload failed",
            description: data.message || "Failed to upload image.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast({
          title: "Upload failed",
          description: "An unexpected error occurred during upload.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoadingProjects) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div className="space-y-2" key={idx}>
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          {[...Array(3)].map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <Skeleton className="w-full md:w-48 h-32" />
                  <div className="w-full">
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-md" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
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
          <Button onClick={handleAddProject} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Project"}
          </Button>
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
                  <Button onClick={() => handleUpdateProject(proj.id)} size="sm" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" /> {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={() => setEditingId(null)} variant="outline" size="sm" disabled={isSubmitting}>
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
                      <Button onClick={() => handleEditProject(proj)} variant="outline" size="icon" disabled={isSubmitting}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteProject(proj.id)} variant="destructive" size="icon" disabled={isSubmitting}>
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