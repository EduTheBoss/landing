"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { usePortfolioData } from "./data-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { featuredProjects, isLoading } = usePortfolioData();

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
      <section id="projects" ref={sectionRef} className="py-16 projects-section section-container bg-grid">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">
            <span className="inline-block border-b-4 border-primary pb-2">Featured Projects</span>
          </h2>
          <Button variant="ghost" asChild className="group text-primary hover:text-primary hover:bg-primary/20">
            <Link href="/projects">
              View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48 w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                  {Array(3).fill(0).map((_, idx) => (
                    <Skeleton key={idx} className="h-6 w-16" />
                  ))}
                </CardFooter>
              </Card>
            ))
          ) : (
            featuredProjects.map((project, index) => (
              <Card
                key={project.id}
                className={`overflow-hidden flex flex-col h-full card-hover-effect custom-card yellow-glow ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden group">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-white hover:bg-white/20 hover:text-white"
                    >
                      <Link href={`/projects#${project.id}`} className="flex items-center">
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-primary">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base text-foreground/80">{project.shortDescription}</CardDescription>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-blue/30 text-foreground text-xs rounded-md">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </section>
    </>
  )
}