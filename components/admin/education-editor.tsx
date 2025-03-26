"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, Edit, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Education {
  id: number
  degree: string
  institution: string
  year: string
  description: string
}

interface Certification {
  id: number
  name: string
  issuer: string
  year: string
  description: string
}

interface SkillGroup {
  id: number
  category: string
  items: string[]
}

export default function EducationEditor() {
  const [education, setEducation] = useState<Education[]>([
    {
      id: 1,
      degree: "Master of Computer Science",
      institution: "Tech University",
      year: "2014 - 2016",
      description: "Specialized in Human-Computer Interaction and Software Engineering",
    },
    {
      id: 2,
      degree: "Bachelor of Science in Information Technology",
      institution: "State University",
      year: "2010 - 2014",
      description: "Graduated with honors, GPA 3.8/4.0",
    },
  ])

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2022",
      description: "Professional level certification for designing distributed systems on AWS",
    },
    {
      id: 2,
      name: "Google Professional Cloud Developer",
      issuer: "Google Cloud",
      year: "2021",
      description: "Advanced certification for building scalable applications on GCP",
    },
    {
      id: 3,
      name: "Certified Scrum Master",
      issuer: "Scrum Alliance",
      year: "2020",
      description: "Certification in Agile project management methodologies",
    },
  ])

  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([
    {
      id: 1,
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "TailwindCSS", "Redux", "HTML/CSS", "JavaScript"],
    },
    {
      id: 2,
      category: "Backend",
      items: ["Node.js", "Express", "Python", "Django", "GraphQL", "REST API Design"],
    },
    {
      id: 3,
      category: "Database",
      items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Redis"],
    },
    {
      id: 4,
      category: "DevOps",
      items: ["Docker", "Kubernetes", "CI/CD", "AWS", "GCP", "Vercel", "Netlify"],
    },
  ])

  // Education state
  const [editingEducationId, setEditingEducationId] = useState<number | null>(null)
  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    degree: "",
    institution: "",
    year: "",
    description: "",
  })

  // Certification state
  const [editingCertificationId, setEditingCertificationId] = useState<number | null>(null)
  const [newCertification, setNewCertification] = useState<Omit<Certification, "id">>({
    name: "",
    issuer: "",
    year: "",
    description: "",
  })

  // Skill group state
  const [editingSkillGroupId, setEditingSkillGroupId] = useState<number | null>(null)
  const [newSkillGroup, setNewSkillGroup] = useState<Omit<SkillGroup, "id">>({
    category: "",
    items: [],
  })
  const [skillInput, setSkillInput] = useState("")
  const [editSkillInput, setEditSkillInput] = useState("")

  // Education handlers
  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      const newId = education.length > 0 ? Math.max(...education.map((e) => e.id)) + 1 : 1
      setEducation((prev) => [...prev, { ...newEducation, id: newId }])
      setNewEducation({
        degree: "",
        institution: "",
        year: "",
        description: "",
      })
      toast({
        title: "Education added",
        description: "New education entry has been added successfully.",
      })
    }
  }

  const handleDeleteEducation = (id: number) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id))
    toast({
      title: "Education deleted",
      description: "Education entry has been removed successfully.",
    })
  }

  const handleEditEducation = (edu: Education) => {
    setEditingEducationId(edu.id)
  }

  const handleUpdateEducation = (id: number) => {
    setEducation((prev) => prev.map((edu) => (edu.id === id ? { ...edu } : edu)))
    setEditingEducationId(null)
    toast({
      title: "Education updated",
      description: "Education entry has been updated successfully.",
    })
  }

  const handleEducationChange = (id: number, field: keyof Education, value: string) => {
    setEducation((prev) => prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  // Certification handlers
  const handleAddCertification = () => {
    if (newCertification.name && newCertification.issuer) {
      const newId = certifications.length > 0 ? Math.max(...certifications.map((c) => c.id)) + 1 : 1
      setCertifications((prev) => [...prev, { ...newCertification, id: newId }])
      setNewCertification({
        name: "",
        issuer: "",
        year: "",
        description: "",
      })
      toast({
        title: "Certification added",
        description: "New certification has been added successfully.",
      })
    }
  }

  const handleDeleteCertification = (id: number) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== id))
    toast({
      title: "Certification deleted",
      description: "Certification has been removed successfully.",
    })
  }

  const handleEditCertification = (cert: Certification) => {
    setEditingCertificationId(cert.id)
  }

  const handleUpdateCertification = (id: number) => {
    setCertifications((prev) => prev.map((cert) => (cert.id === id ? { ...cert } : cert)))
    setEditingCertificationId(null)
    toast({
      title: "Certification updated",
      description: "Certification has been updated successfully.",
    })
  }

  const handleCertificationChange = (id: number, field: keyof Certification, value: string) => {
    setCertifications((prev) => prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)))
  }

  // Skill group handlers
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setNewSkillGroup((prev) => ({
        ...prev,
        items: [...prev.items, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (index: number) => {
    setNewSkillGroup((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleAddSkillGroup = () => {
    if (newSkillGroup.category && newSkillGroup.items.length > 0) {
      const newId = skillGroups.length > 0 ? Math.max(...skillGroups.map((sg) => sg.id)) + 1 : 1
      setSkillGroups((prev) => [...prev, { ...newSkillGroup, id: newId }])
      setNewSkillGroup({
        category: "",
        items: [],
      })
      toast({
        title: "Skill group added",
        description: "New skill group has been added successfully.",
      })
    }
  }

  const handleDeleteSkillGroup = (id: number) => {
    setSkillGroups((prev) => prev.filter((sg) => sg.id !== id))
    toast({
      title: "Skill group deleted",
      description: "Skill group has been removed successfully.",
    })
  }

  const handleEditSkillGroup = (sg: SkillGroup) => {
    setEditingSkillGroupId(sg.id)
    setEditSkillInput("")
  }

  const handleUpdateSkillGroup = (id: number) => {
    setSkillGroups((prev) => prev.map((sg) => (sg.id === id ? { ...sg } : sg)))
    setEditingSkillGroupId(null)
    toast({
      title: "Skill group updated",
      description: "Skill group has been updated successfully.",
    })
  }

  const handleSkillGroupChange = (id: number, field: keyof SkillGroup, value: string | string[]) => {
    setSkillGroups((prev) => prev.map((sg) => (sg.id === id ? { ...sg, [field]: value } : sg)))
  }

  const handleAddEditSkill = (id: number) => {
    if (editSkillInput.trim()) {
      setSkillGroups((prev) =>
        prev.map((sg) => (sg.id === id ? { ...sg, items: [...sg.items, editSkillInput.trim()] } : sg)),
      )
      setEditSkillInput("")
    }
  }

  const handleRemoveEditSkill = (id: number, index: number) => {
    setSkillGroups((prev) =>
      prev.map((sg) => (sg.id === id ? { ...sg, items: sg.items.filter((_, i) => i !== index) } : sg)),
    )
  }

  return (
    <Tabs defaultValue="education" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>

      <TabsContent value="education" className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Education</CardTitle>
            <CardDescription>Add your educational background</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree/Diploma</Label>
                <Input
                  id="degree"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation((prev) => ({ ...prev, degree: e.target.value }))}
                  placeholder="Master of Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation((prev) => ({ ...prev, institution: e.target.value }))}
                  placeholder="University Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Time Period</Label>
              <Input
                id="year"
                value={newEducation.year}
                onChange={(e) => setNewEducation((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="2010 - 2014"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEducation.description}
                onChange={(e) => setNewEducation((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details about your education"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddEducation}>Add Education</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Existing Education</h3>
          {education.map((edu) => (
            <Card key={edu.id}>
              {editingEducationId === edu.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-degree-${edu.id}`}>Degree/Diploma</Label>
                      <Input
                        id={`edit-degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`edit-institution-${edu.id}`}>Institution</Label>
                      <Input
                        id={`edit-institution-${edu.id}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(edu.id, "institution", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-year-${edu.id}`}>Time Period</Label>
                    <Input
                      id={`edit-year-${edu.id}`}
                      value={edu.year}
                      onChange={(e) => handleEducationChange(edu.id, "year", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-description-${edu.id}`}>Description</Label>
                    <Textarea
                      id={`edit-description-${edu.id}`}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleUpdateEducation(edu.id)} size="sm">
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button onClick={() => setEditingEducationId(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{edu.degree}</CardTitle>
                        <CardDescription>
                          {edu.institution} | {edu.year}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEditEducation(edu)} variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteEducation(edu.id)} variant="destructive" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{edu.description}</p>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="certifications" className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Certification</CardTitle>
            <CardDescription>Add your professional certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certName">Certification Name</Label>
                <Input
                  id="certName"
                  value={newCertification.name}
                  onChange={(e) => setNewCertification((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input
                  id="issuer"
                  value={newCertification.issuer}
                  onChange={(e) => setNewCertification((prev) => ({ ...prev, issuer: e.target.value }))}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certYear">Year</Label>
              <Input
                id="certYear"
                value={newCertification.year}
                onChange={(e) => setNewCertification((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="2022"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certDescription">Description</Label>
              <Textarea
                id="certDescription"
                value={newCertification.description}
                onChange={(e) => setNewCertification((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Details about the certification"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddCertification}>Add Certification</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Existing Certifications</h3>
          {certifications.map((cert) => (
            <Card key={cert.id}>
              {editingCertificationId === cert.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-name-${cert.id}`}>Certification Name</Label>
                      <Input
                        id={`edit-name-${cert.id}`}
                        value={cert.name}
                        onChange={(e) => handleCertificationChange(cert.id, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`edit-issuer-${cert.id}`}>Issuing Organization</Label>
                      <Input
                        id={`edit-issuer-${cert.id}`}
                        value={cert.issuer}
                        onChange={(e) => handleCertificationChange(cert.id, "issuer", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-cert-year-${cert.id}`}>Year</Label>
                    <Input
                      id={`edit-cert-year-${cert.id}`}
                      value={cert.year}
                      onChange={(e) => handleCertificationChange(cert.id, "year", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-cert-description-${cert.id}`}>Description</Label>
                    <Textarea
                      id={`edit-cert-description-${cert.id}`}
                      value={cert.description}
                      onChange={(e) => handleCertificationChange(cert.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleUpdateCertification(cert.id)} size="sm">
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button onClick={() => setEditingCertificationId(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{cert.name}</CardTitle>
                        <CardDescription>
                          {cert.issuer} | {cert.year}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEditCertification(cert)} variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteCertification(cert.id)} variant="destructive" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{cert.description}</p>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="skills" className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Skill Group</CardTitle>
            <CardDescription>Group your skills by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                value={newSkillGroup.category}
                onChange={(e) => setNewSkillGroup((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="Frontend"
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
                {newSkillGroup.items.map((skill, index) => (
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
            <Button onClick={handleAddSkillGroup}>Add Skill Group</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Existing Skill Groups</h3>
          {skillGroups.map((sg) => (
            <Card key={sg.id}>
              {editingSkillGroupId === sg.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-category-${sg.id}`}>Category Name</Label>
                    <Input
                      id={`edit-category-${sg.id}`}
                      value={sg.category}
                      onChange={(e) => handleSkillGroupChange(sg.id, "category", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-skills-${sg.id}`}>Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`edit-skills-${sg.id}`}
                        value={editSkillInput}
                        onChange={(e) => setEditSkillInput(e.target.value)}
                        placeholder="Add a skill"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEditSkill(sg.id))}
                      />
                      <Button type="button" onClick={() => handleAddEditSkill(sg.id)} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {sg.items.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditSkill(sg.id, index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleUpdateSkillGroup(sg.id)} size="sm">
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button onClick={() => setEditingSkillGroupId(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{sg.category}</CardTitle>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEditSkillGroup(sg)} variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteSkillGroup(sg.id)} variant="destructive" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {sg.items.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
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
      </TabsContent>
    </Tabs>
  )
}

