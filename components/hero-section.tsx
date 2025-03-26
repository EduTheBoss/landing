import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 py-16 hero-section section-container min-h-[90vh] justify-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-full border-4 border-primary/50 shadow-xl animate-float yellow-glow">
        <Image src="/placeholder.svg?height=320&width=320" alt="Profile Photo" fill className="object-cover" priority />
      </div>
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-left">
          <span className="text-primary">Hello, I'm</span> John Doe
        </h1>
        <p className="text-xl md:text-2xl text-accent animate-slide-right">Full Stack Developer & UX Designer</p>
        <p className="max-w-2xl text-muted-foreground animate-fade-in">
          I build exceptional digital experiences that combine cutting-edge technology with intuitive design. With over
          5 years of experience, I specialize in creating responsive web applications that solve real-world problems.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-in">
          <Button
            asChild
            size="lg"
            className="group transition-all duration-300 hover:pr-6 bg-primary text-primary-foreground hover:bg-dark-yellow"
          >
            <Link href="/projects">
              View My Work <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="transition-all duration-300 hover:bg-primary/10 border-primary text-primary hover:text-primary"
          >
            <Link href="#contact">Contact Me</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

