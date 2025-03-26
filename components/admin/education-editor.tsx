"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, Edit, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePortfolioData } from "../data-provider"
import { useApi } from "@/hooks/use-api"
import { Education, Certification, SkillGroup } from "../data-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function EducationEditor() {
  const { 
    education: initialEducation, 
    certifications: initialCertifications, 
    skillGroups: initialSkillGroups, 
    isLoading,
    refreshData 
  } = usePortfolioData();
  
  // Local state
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Education state
  const [editingEducationId, setEditingEducationId] = useState<number | null>(null);
  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    degree: "",
    institution: "",
    year: "",
    description: "",
  });

  // Certification state
  const [editingCertificationId, setEditingCertificationId] = useState<number | null>(null);
  const [newCertification, setNewCertification] = useState<Omit<Certification, "id">>({
    name: "",
    issuer: "",
    year: "",
    description: "",
  });

  // Skill group state
  const [editingSkillGroupId, setEditingSkillGroupId] = useState<number | null>(null);
  const [newSkillGroup, setNewSkillGroup] = useState<Omit<SkillGroup, "id">>({
    category: "",
    items: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [editSkillInput, setEditSkillInput] = useState("");
  
  const api = useApi();

  // Update local state when data is loaded
  useEffect(() => {
    if (initialEducation) setEducation(initialEducation);
    if (initialCertifications) setCertifications(initialCertifications);
    if (initialSkillGroups) setSkillGroups(initialSkillGroups);
  }, [initialEducation, initialCertifications, initialSkillGroups]);

  // Education handlers
  const handleAddEducation = async () => {
    if (newEducation.degree && newEducation.institution) {
      setIsSubmitting(true);
      
      try {
        const result = await api.post('/api/education', newEducation);
        
        if (result.success) {
          // Reset form
          setNewEducation({
            degree: "",
            institution: "",
            year: "",
            description: "",
          });
          
          // Refresh data
          await refreshData();
          
          toast({
            title: "Education added",
            description: "New education entry has been added successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add education entry.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Education add error:', error);
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

  const handleDeleteEducation = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      const result = await api.del(`/api/education/${id}`);
      
      if (result.success) {
        // Update local state
        setEducation((prev) => prev.filter((edu) => edu.id !== id));
        
        toast({
          title: "Education deleted",
          description: "Education entry has been removed successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete education entry.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Education delete error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducationId(edu.id);
  };

  const handleUpdateEducation = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      // Find the education to update
      const eduToUpdate = education.find(edu => edu.id === id);
      
      if (!eduToUpdate) {
        toast({
          title: "Error",
          description: "Education entry not found.",
          variant: "destructive",
        });
        return;
      }
      
      const result = await api.put(`/api/education/${id}`, eduToUpdate);
      
      if (result.success) {
        setEditingEducationId(null);
        
        toast({
          title: "Education updated",
          description: "Education entry has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update education entry.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Education update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEducationChange = (id: number, field: keyof Education, value: string) => {
    setEducation((prev) => prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  // Certification handlers
  const handleAddCertification = async () => {
    if (newCertification.name && newCertification.issuer) {
      setIsSubmitting(true);
      
      try {
        const result = await api.post('/api/certifications', newCertification);
        
        if (result.success) {
          // Reset form
          setNewCertification({
            name: "",
            issuer: "",
            year: "",
            description: "",
          });
          
          // Refresh data
          await refreshData();
          
          toast({
            title: "Certification added",
            description: "New certification has been added successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add certification.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Certification add error:', error);
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
  const handleDeleteCertification = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      const result = await api.del(`/api/certifications/${id}`);
      
      if (result.success) {
        // Update local state
        setCertifications((prev) => prev.filter((cert) => cert.id !== id));
        
        toast({
          title: "Certification deleted",
          description: "Certification has been removed successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete certification.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Certification delete error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCertification = (cert: Certification) => {
    setEditingCertificationId(cert.id);
  };

  const handleUpdateCertification = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      // Find the certification to update
      const certToUpdate = certifications.find(cert => cert.id === id);
      
      if (!certToUpdate) {
        toast({
          title: "Error",
          description: "Certification not found.",
          variant: "destructive",
        });
        return;
      }
      
      const result = await api.put(`/api/certifications/${id}`, certToUpdate);
      
      if (result.success) {
        setEditingCertificationId(null);
        
        toast({
          title: "Certification updated",
          description: "Certification has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update certification.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Certification update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertificationChange = (id: number, field: keyof Certification, value: string) => {
    setCertifications((prev) => prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)));
  };

  // Skill group handlers
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setNewSkillGroup((prev) => ({
        ...prev,
        items: [...prev.items, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setNewSkillGroup((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkillGroup = async () => {
    if (newSkillGroup.category && newSkillGroup.items.length > 0) {
      setIsSubmitting(true);
      
      try {
        const result = await api.post('/api/skills', newSkillGroup);
        
        if (result.success) {
          // Reset form
          setNewSkillGroup({
            category: "",
            items: [],
          });
          
          // Refresh data
          await refreshData();
          
          toast({
            title: "Skill group added",
            description: "New skill group has been added successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add skill group.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Skill group add error:', error);
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

  const handleDeleteSkillGroup = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      const result = await api.del(`/api/skills/${id}`);
      
      if (result.success) {
        // Update local state
        setSkillGroups((prev) => prev.filter((sg) => sg.id !== id));
        
        toast({
          title: "Skill group deleted",
          description: "Skill group has been removed successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete skill group.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Skill group delete error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSkillGroup = (sg: SkillGroup) => {
    setEditingSkillGroupId(sg.id);
    setEditSkillInput("");
  };

  const handleUpdateSkillGroup = async (id: number) => {
    setIsSubmitting(true);
    
    try {
      // Find the skill group to update
      const sgToUpdate = skillGroups.find(sg => sg.id === id);
      
      if (!sgToUpdate) {
        toast({
          title: "Error",
          description: "Skill group not found.",
          variant: "destructive",
        });
        return;
      }
      
      const result = await api.put(`/api/skills/${id}`, sgToUpdate);
      
      if (result.success) {
        setEditingSkillGroupId(null);
        
        toast({
          title: "Skill group updated",
          description: "Skill group has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update skill group.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Skill group update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillGroupChange = (id: number, field: keyof SkillGroup, value: string | string[]) => {
    setSkillGroups((prev) => prev.map((sg) => (sg.id === id ? { ...sg, [field]: value } : sg)));
  };

  const handleAddEditSkill = (id: number) => {
    if (editSkillInput.trim()) {
      setSkillGroups((prev) =>
        prev.map((sg) => (sg.id === id ? { ...sg, items: [...sg.items, editSkillInput.trim()] } : sg))
      );
      setEditSkillInput("");
    }
  };

  const handleRemoveEditSkill = (id: number, index: number) => {
    setSkillGroups((prev) =>
      prev.map((sg) => (sg.id === id ? { ...sg, items: sg.items.filter((_, i) => i !== index) } : sg))
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-full rounded-md" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, idx) => (
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
      </div>
    );
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
            <Button onClick={handleAddEducation} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Education"}
            </Button>
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
                    <Button onClick={() => handleUpdateEducation(edu.id)} size="sm" disabled={isSubmitting}>
                      <Save className="h-4 w-4 mr-2" /> {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={() => setEditingEducationId(null)} variant="outline" size="sm" disabled={isSubmitting}>
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
                        <Button onClick={() => handleEditEducation(edu)} variant="outline" size="icon" disabled={isSubmitting}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteEducation(edu.id)} variant="destructive" size="icon" disabled={isSubmitting}>
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
        {/* Similar pattern to education section */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Certification</CardTitle>
            <CardDescription>Add your professional certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Certification form fields */}
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
            <Button onClick={handleAddCertification} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Certification"}
            </Button>
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
                    <Button onClick={() => handleUpdateCertification(cert.id)} size="sm" disabled={isSubmitting}>
                      <Save className="h-4 w-4 mr-2" /> {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={() => setEditingCertificationId(null)} variant="outline" size="sm" disabled={isSubmitting}>
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
                        <Button onClick={() => handleEditCertification(cert)} variant="outline" size="icon" disabled={isSubmitting}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteCertification(cert.id)} variant="destructive" size="icon" disabled={isSubmitting}>
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
            <Button onClick={handleAddSkillGroup} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Skill Group"}
            </Button>
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
                    <Button onClick={() => handleUpdateSkillGroup(sg.id)} size="sm" disabled={isSubmitting}>
                      <Save className="h-4 w-4 mr-2" /> {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={() => setEditingSkillGroupId(null)} variant="outline" size="sm" disabled={isSubmitting}>
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
                        <Button onClick={() => handleEditSkillGroup(sg)} variant="outline" size="icon" disabled={isSubmitting}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteSkillGroup(sg.id)} variant="destructive" size="icon" disabled={isSubmitting}>
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