"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  const experiences = [
    {
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      period: "2021 - Present",
      description:
        "Led the development of the company's flagship product, improving performance by 40%. Mentored junior developers and implemented modern frontend practices.",
      skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    },
    {
      title: "Full Stack Developer",
      company: "Digital Solutions Ltd.",
      period: "2018 - 2021",
      description:
        "Developed and maintained multiple client projects. Implemented CI/CD pipelines and improved code quality through automated testing.",
      skills: ["Node.js", "Express", "MongoDB", "React"],
    },
    {
      title: "Junior Web Developer",
      company: "WebCraft Agency",
      period: "2016 - 2018",
      description:
        "Created responsive websites for clients across various industries. Collaborated with designers to implement pixel-perfect UIs.",
      skills: ["HTML", "CSS", "JavaScript", "WordPress"],
    },
  ]

  return (
    <>
      <div className="section-divider"></div>
      <section id="experience" ref={sectionRef} className="py-16 experience-section section-container bg-dots">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="inline-block border-b-4 border-primary pb-2">Professional Experience</span>
        </h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card
              key={index}
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
          ))}
        </div>
      </section>
    </>
  )
}

