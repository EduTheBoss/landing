import HeroSection from "@/components/hero-section"
import ExperienceSection from "@/components/experience-section"
import FeaturedProjects from "@/components/featured-projects"
import EducationSection from "@/components/education-section"
import SocialLinks from "@/components/social-links"

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <ExperienceSection />
      <FeaturedProjects />
      <EducationSection />
      <SocialLinks />
    </div>
  )
}

