"use client"

import { useRef, useEffect, useState } from "react"
import { Github, Linkedin, Twitter, Mail, Globe } from "lucide-react"
import Link from "next/link"
import { useProfile } from "./profile-data-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function SocialLinks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { profile, isLoading } = useProfile();

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

  const socialLinks = !isLoading && profile ? [
    { name: "GitHub", icon: <Github className="h-6 w-6" />, url: profile.socialLinks.github },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, url: profile.socialLinks.linkedin },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, url: profile.socialLinks.twitter },
    { name: "Email", icon: <Mail className="h-6 w-6" />, url: `mailto:${profile.socialLinks.email}` },
    { name: "Website", icon: <Globe className="h-6 w-6" />, url: profile.socialLinks.website },
  ] : [];

  return (
    <>
      <div className="section-divider"></div>
      <section id="contact" ref={sectionRef} className="py-16 social-section section-container bg-gradient">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="inline-block border-b-4 border-primary pb-2">Connect With Me</span>
        </h2>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 rounded-lg custom-card shadow-lg"
              >
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))
          ) : (
            socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={`flex flex-col items-center gap-3 p-6 rounded-lg custom-card shadow-lg transition-all duration-500 hover:bg-primary/10 hover:scale-110 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="p-4 rounded-full bg-primary/20 text-primary">{link.icon}</div>
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  )
}