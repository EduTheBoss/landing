"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePortfolioData } from "./data-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("education")
  const { education, certifications, skillGroups, isLoading } = usePortfolioData();

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
            {isLoading ? (
              // Loading skeletons
              Array(2).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              education.map((edu) => (
                <Card key={edu.id} className="card-hover-effect border-t-4 border-t-primary custom-card">
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
              ))
            )}
          </TabsContent>

          <TabsContent
            value="certifications"
            className={`space-y-4 transition-all duration-500 ${
              isVisible && activeTab === "certifications" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              certifications.map((cert) => (
                <Card key={cert.id} className="card-hover-effect border-t-4 border-t-primary custom-card">
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
              ))
            )}
          </TabsContent>

          <TabsContent
            value="skills"
            className={`transition-all duration-500 ${
              isVisible && activeTab === "skills" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array(4).fill(0).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-8 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {Array(6).fill(0).map((_, idx) => (
                          <Skeleton key={idx} className="h-8 w-20 rounded-full" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                skillGroups.map((skillGroup) => (
                  <Card key={skillGroup.id} className="card-hover-effect border-t-4 border-t-primary custom-card">
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
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}