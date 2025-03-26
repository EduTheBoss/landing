"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("education")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const education = [
    {
      degree: "Master of Computer Science",
      institution: "Tech University",
      year: "2014 - 2016",
      description: "Specialized in Human-Computer Interaction and Software Engineering",
    },
    {
      degree: "Bachelor of Science in Information Technology",
      institution: "State University",
      year: "2010 - 2014",
      description: "Graduated with honors, GPA 3.8/4.0",
    },
  ]

  const certifications = [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2022",
      description: "Professional level certification for designing distributed systems on AWS",
    },
    {
      name: "Google Professional Cloud Developer",
      issuer: "Google Cloud",
      year: "2021",
      description: "Advanced certification for building scalable applications on GCP",
    },
    {
      name: "Certified Scrum Master",
      issuer: "Scrum Alliance",
      year: "2020",
      description: "Certification in Agile project management methodologies",
    },
  ]

  const skills = [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "TailwindCSS", "Redux", "HTML/CSS", "JavaScript"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "Python", "Django", "GraphQL", "REST API Design"],
    },
    {
      category: "Database",
      items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Redis"],
    },
    {
      category: "DevOps",
      items: ["Docker", "Kubernetes", "CI/CD", "AWS", "GCP", "Vercel", "Netlify"],
    },
  ]

  return (
    <>
      <div className="section-divider"></div>
      <section id="education" ref={sectionRef} className="py-16 education-section section-container">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="inline-block border-b-4 border-primary pb-2">Education & Skills</span>
        </h2>

        <Tabs defaultValue="education" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-blue/30 backdrop-blur">
            <TabsTrigger
              value="education"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Certifications
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="education"
            className={`space-y-4 transition-all duration-500 ${
              isVisible && activeTab === "education" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {education.map((edu, index) => (
              <Card key={index} className="card-hover-effect border-t-4 border-t-primary custom-card">
                <CardHeader>
                  <CardTitle className="text-primary">{edu.degree}</CardTitle>
                  <CardDescription className="text-accent">
                    {edu.institution} | {edu.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{edu.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent
            value="certifications"
            className={`space-y-4 transition-all duration-500 ${
              isVisible && activeTab === "certifications" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {certifications.map((cert, index) => (
              <Card key={index} className="card-hover-effect border-t-4 border-t-primary custom-card">
                <CardHeader>
                  <CardTitle className="text-primary">{cert.name}</CardTitle>
                  <CardDescription className="text-accent">
                    {cert.issuer} | {cert.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent
            value="skills"
            className={`transition-all duration-500 ${
              isVisible && activeTab === "skills" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skillGroup, index) => (
                <Card key={index} className="card-hover-effect border-t-4 border-t-primary custom-card">
                  <CardHeader>
                    <CardTitle className="text-primary">{skillGroup.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}

