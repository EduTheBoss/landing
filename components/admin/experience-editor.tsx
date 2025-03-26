"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, Edit, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Experience {
  id: number
  title: string
  company: string
  period: string
  description: string
  skills: string[]
}

export default function ExperienceEditor() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      period: "2021 - Present",
      description:
        "Led the development of the company's flagship product, improving performance by 40%. Mentored junior developers and implemented modern frontend practices.",
      skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Solutions Ltd.",
      period: "2018 - 2021",
      description:
        "Developed and maintained multiple client projects. Implemented CI/CD pipelines and improved code quality through automated testing.",
      skills: ["Node.js", "Express", "MongoDB", "React"],
    },
    {
      id: 3,
      title: "Junior Web Developer",
      company: "WebCraft Agency",
      period: "2016 - 2018",
      description:
        "Created responsive websites for clients across various industries. Collaborated with designers to implement pixel-perfect UIs.",
      skills: ["HTML", "CSS", "JavaScript", "WordPress"],
    },
  ])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [newExperience, setNewExperience] = useState<Omit<Experience, "id">>({
    title: "",
    company: "",
    period: "",
    description: "",
    skills: [],
  })
  const [skillInput, setSkillInput] = useState("")
  const [editSkillInput, setEditSkillInput] = useState("")

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setNewExperience((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (index: number) => {
    setNewExperience((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      const newId = experiences.length > 0 ? Math.max(...experiences.map((e) => e.id)) + 1 : 1
      setExperiences((prev) => [...prev, { ...newExperience, id: newId }])
      setNewExperience({
        title: "",
        company: "",
        period: "",
        description: "",
        skills: [],
      })
      toast({
        title: "Experience added",
        description: "New experience has been added successfully.",
      })
    }
  }

  const handleDeleteExperience = (id: number) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
    toast({
      title: "Experience deleted",
      description: "Experience has been removed successfully.",
    })
  }

  const handleEditExperience = (exp: Experience) => {
    setEditingId(exp.id)
    setEditSkillInput("")
  }

  const handleUpdateExperience = (id: number) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === id ? { ...exp } : exp)))
    setEditingId(null)
    toast({
      title: "Experience updated",
      description: "Experience has been updated successfully.",
    })
  }

  const handleEditChange = (id: number, field: keyof Experience, value: string) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const handleAddEditSkill = (id: number) => {
    if (editSkillInput.trim()) {
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, skills: [...exp.skills, editSkillInput.trim()] } : exp)),
      )
      setEditSkillInput("")
    }
  }

  const handleRemoveEditSkill = (id: number, index: number) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, skills: exp.skills.filter((_, i) => i !== index) } : exp)),
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Experience</CardTitle>
          <CardDescription>Add your work experience details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={newExperience.title}
                onChange={(e) => setNewExperience((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Senior Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newExperience.company}
                onChange={(e) => setNewExperience((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="Tech Company Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Time Period</Label>
            <Input
              id="period"
              value={newExperience.period}
              onChange={(e) => setNewExperience((prev) => ({ ...prev, period: e.target.value }))}
              placeholder="2020 - Present"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newExperience.description}
              onChange={(e) => setNewExperience((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your responsibilities and achievements"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              />
              <Button type="button" onClick={handleAddSkill} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {newExperience.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddExperience}>Add Experience</Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Experiences</h3>
        {experiences.map((exp) => (
          <Card key={exp.id}>
            {editingId === exp.id ? (
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-title-${exp.id}`}>Job Title</Label>
                    <Input
                      id={`edit-title-${exp.id}`}
                      value={exp.title}
                      onChange={(e) => handleEditChange(exp.id, "title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-company-${exp.id}`}>Company</Label>
                    <Input
                      id={`edit-company-${exp.id}`}
                      value={exp.company}
                      onChange={(e) => handleEditChange(exp.id, "company", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-period-${exp.id}`}>Time Period</Label>
                  <Input
                    id={`edit-period-${exp.id}`}
                    value={exp.period}
                    onChange={(e) => handleEditChange(exp.id, "period", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-description-${exp.id}`}>Description</Label>
                  <Textarea
                    id={`edit-description-${exp.id}`}
                    value={exp.description}
                    onChange={(e) => handleEditChange(exp.id, "description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-skills-${exp.id}`}>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`edit-skills-${exp.id}`}
                      value={editSkillInput}
                      onChange={(e) => setEditSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEditSkill(exp.id))}
                    />
                    <Button type="button" onClick={() => handleAddEditSkill(exp.id)} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditSkill(exp.id, index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleUpdateExperience(exp.id)} size="sm">
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
                      <CardTitle>{exp.title}</CardTitle>
                      <CardDescription>
                        {exp.company} | {exp.period}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEditExperience(exp)} variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteExperience(exp.id)} variant="destructive" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-muted text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
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

