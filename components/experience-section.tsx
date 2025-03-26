"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePortfolioData } from "./data-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { experiences, isLoading } = usePortfolioData();

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
      <section id="experience" ref={sectionRef} className="py-16 experience-section section-container bg-dots">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="inline-block border-b-4 border-primary pb-2">Professional Experience</span>
        </h2>
        <div className="space-y-8">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="border-l-4 border-l-primary shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-24 md:text-right" />
                  </div>
                  <Skeleton className="h-6 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {Array(4).fill(0).map((_, idx) => (
                      <Skeleton key={idx} className="h-6 w-20" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            experiences.map((exp, index) => (
              <Card
                key={exp.id}
                className={`border-l-4 border-l-primary shadow-lg transition-all duration-500 card-hover-effect custom-card ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <CardTitle className="text-primary">{exp.title}</CardTitle>
                    <CardDescription className="text-sm md:text-right text-accent">{exp.period}</CardDescription>
                  </div>
                  <CardDescription className="text-base font-medium text-foreground">{exp.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-foreground/80">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="transition-all hover:bg-primary hover:text-primary-foreground bg-blue/30 text-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </>
  )
}