"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePortfolioData } from "./data-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsList() {
  const [expandedId, setExpandedId] = useState<number | null>(() => null)
  const [animatedItems, setAnimatedItems] = useState<number[]>([])
  const { projects, isLoading } = usePortfolioData();

  useEffect(() => {
    // Animate items in sequence
    if (!isLoading && projects.length > 0) {
      const timer = setTimeout(() => {
        const ids = projects.map((p) => p.id);
        setAnimatedItems(ids);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, projects]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="flex flex-col gap-8">
      {isLoading ? (
        // Loading skeletons
        Array(6).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden w-full">
            <div className="relative h-60 w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
              {Array(3).fill(0).map((_, idx) => (
                <Skeleton key={idx} className="h-6 w-16" />
              ))}
            </CardFooter>
          </Card>
        ))
      ) : (
        projects.map((project) => (
          <Card
            key={project.id}
            className={cn(
              "overflow-hidden transition-all duration-500 w-full card-hover-effect custom-card yellow-glow",
              animatedItems.includes(project.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20",
              expandedId === project.id ? "shadow-xl" : "shadow-md",
            )}
            style={{ transitionDelay: `${project.id * 100}ms` }}
          >
            <div className="cursor-pointer" onClick={() => toggleExpand(project.id)}>
              <div className="relative h-60 w-full">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700",
                    expandedId === project.id ? "scale-105" : "",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-1">{project.shortDescription}</p>
                </div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-primary">{project.title}</CardTitle>
                  <CardDescription className="text-base mt-1 text-foreground/80">
                    {project.shortDescription}
                  </CardDescription>
                </div>
                <div className="bg-primary/20 rounded-full p-2 transition-transform duration-300 hover:bg-primary/40">
                  {expandedId === project.id ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
            </div>

            <CardContent
              className={cn(
                "grid grid-rows-[0fr] transition-all duration-500",
                expandedId === project.id ? "grid-rows-[1fr] pt-4" : "",
              )}
            >
              <div className="overflow-hidden">
                {expandedId === project.id && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="text-foreground/80">{project.fullDescription}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="transition-all hover:bg-primary hover:text-primary-foreground bg-blue/30 text-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Button
                        asChild
                        size="sm"
                        className="group transition-all duration-300 hover:pr-6 bg-primary text-primary-foreground hover:bg-dark-yellow"
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /> Live
                          Demo
                        </a>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="group transition-all duration-300 border-primary text-primary hover:bg-primary/20"
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> View Code
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
              {expandedId !== project.id &&
                project.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              {expandedId !== project.id && project.tags.length > 3 && (
                <span className="px-2 py-1 bg-blue/30 text-foreground text-xs rounded-md">
                  +{project.tags.length - 3} more
                </span>
              )}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}