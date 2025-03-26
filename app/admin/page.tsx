"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminLogin from "@/components/admin-login"
import ProfileEditor from "@/components/admin/profile-editor"
import ExperienceEditor from "@/components/admin/experience-editor"
import ProjectsEditor from "@/components/admin/projects-editor"
import EducationEditor from "@/components/admin/education-editor"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => false)

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Manage your portfolio content</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="education">Education & Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileEditor />
        </TabsContent>

        <TabsContent value="experience">
          <ExperienceEditor />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsEditor />
        </TabsContent>

        <TabsContent value="education">
          <EducationEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}

