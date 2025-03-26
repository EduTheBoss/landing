"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ProjectsList() {
  const [expandedId, setExpandedId] = useState<number | null>(() => null)
  const [animatedItems, setAnimatedItems] = useState<number[]>([])

  useEffect(() => {
    // Animate items in sequence
    const timer = setTimeout(() => {
      const ids = projects.map((p) => p.id)
      setAnimatedItems(ids)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      shortDescription:
        "A full-featured online store with payment processing, inventory management, and analytics dashboard.",
      fullDescription:
        "This comprehensive e-commerce solution provides businesses with everything they need to sell products online. Features include secure payment processing with Stripe, real-time inventory management, customer accounts, order tracking, and an advanced analytics dashboard for business insights. The platform is built with performance and SEO in mind, ensuring fast page loads and good search engine visibility.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Next.js", "Stripe", "MongoDB", "Redux", "TailwindCSS"],
      liveUrl: "https://example.com/ecommerce",
      githubUrl: "https://github.com/yourusername/ecommerce",
    },
    {
      id: 2,
      title: "Health Tracking App",
      shortDescription:
        "Mobile-first application for tracking fitness goals, nutrition, and health metrics with data visualization.",
      fullDescription:
        "This health tracking application helps users monitor their fitness journey with comprehensive tracking tools. Users can log workouts, track nutrition intake, monitor vital health metrics, and visualize their progress over time with interactive charts. The app includes goal setting features, personalized recommendations, and social sharing capabilities to keep users motivated. Built with React Native for cross-platform compatibility and Firebase for real-time data synchronization.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["React Native", "Firebase", "D3.js", "Redux", "Expo"],
      liveUrl: "https://example.com/healthapp",
      githubUrl: "https://github.com/yourusername/health-tracker",
    },
    {
      id: 3,
      title: "AI Content Generator",
      shortDescription:
        "Web application that leverages AI to generate marketing content, blog posts, and social media captions.",
      fullDescription:
        "This AI-powered content generation tool helps marketers and content creators produce high-quality written content quickly. The application uses advanced natural language processing models to generate blog posts, marketing copy, social media captions, and product descriptions based on user inputs. Features include content customization options, tone adjustment, multiple export formats, and a user-friendly interface for non-technical users. The backend is built with Python and Flask, while the frontend uses React for a responsive user experience.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Python", "OpenAI API", "React", "Flask", "PostgreSQL"],
      liveUrl: "https://example.com/ai-content",
      githubUrl: "https://github.com/yourusername/ai-content-generator",
    },
    {
      id: 4,
      title: "Real Estate Marketplace",
      shortDescription:
        "Platform connecting property buyers, sellers, and agents with advanced search and virtual tours.",
      fullDescription:
        "This real estate marketplace revolutionizes property hunting by connecting buyers, sellers, and agents in one platform. The application features advanced property search with filters for location, price, amenities, and more. It includes virtual tour capabilities, mortgage calculators, neighborhood analytics, and direct messaging between users. The platform is built with a microservices architecture for scalability and uses geospatial indexing for efficient location-based searches.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Angular", "Node.js", "MongoDB", "Google Maps API", "Docker"],
      liveUrl: "https://example.com/realestate",
      githubUrl: "https://github.com/yourusername/real-estate",
    },
    {
      id: 5,
      title: "Project Management Tool",
      shortDescription:
        "Collaborative workspace for teams with task tracking, time management, and resource allocation.",
      fullDescription:
        "This comprehensive project management solution helps teams collaborate effectively and deliver projects on time. Features include task creation and assignment, Kanban boards, Gantt charts for timeline visualization, time tracking, document sharing, and team communication tools. The application includes role-based access control, customizable workflows, and detailed reporting capabilities. Built with a focus on user experience, the tool is intuitive enough for small teams while powerful enough for enterprise use.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Vue.js", "Express", "PostgreSQL", "Socket.io", "AWS"],
      liveUrl: "https://example.com/projectmanagement",
      githubUrl: "https://github.com/yourusername/project-management",
    },
    {
      id: 6,
      title: "Educational Platform",
      shortDescription:
        "Online learning platform with course creation, student progress tracking, and interactive assessments.",
      fullDescription:
        "This educational platform enables educators to create and deliver online courses with ease. The system includes tools for course creation, content management, student enrollment, progress tracking, and interactive assessments. Features include video lectures, downloadable resources, discussion forums, automated grading, and certificate generation. The platform supports multiple pricing models including one-time purchases, subscriptions, and free courses. Built with scalability in mind to handle thousands of concurrent users.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["React", "Django", "PostgreSQL", "Redis", "AWS S3"],
      liveUrl: "https://example.com/education",
      githubUrl: "https://github.com/yourusername/education-platform",
    },
  ]

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="flex flex-col gap-8">
      {projects.map((project) => (
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
      ))}
    </div>
  )
}

