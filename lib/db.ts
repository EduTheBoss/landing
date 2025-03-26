// Database utility functions
import fs from 'fs';
import path from 'path';

// Define our data types
export interface Profile {
  name: string;
  title: string;
  bio: string;
  photo: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
    website: string;
  };
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
  description: string;
}

export interface SkillGroup {
  id: number;
  category: string;
  items: string[];
}

export interface PortfolioData {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  skillGroups: SkillGroup[];
  // Admin credentials (in a real app, this would be in a separate secure storage)
  adminCredentials: {
    username: string;
    password: string;
  };
}

// Initial demo data
const initialData: PortfolioData = {
  profile: {
    name: "John Doe",
    title: "Full Stack Developer & UX Designer",
    bio: "I build exceptional digital experiences that combine cutting-edge technology with intuitive design. With over 5 years of experience, I specialize in creating responsive web applications that solve real-world problems.",
    photo: "/placeholder.svg?height=320&width=320",
    socialLinks: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      twitter: "https://twitter.com/yourusername",
      email: "your.email@example.com",
      website: "https://yourwebsite.com",
    },
  },
  experiences: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      period: "2021 - Present",
      description:
        "Led the development of the company's flagship product, improving performance by 40%. Mentored junior developers and implemented modern frontend practices.",
      skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Solutions Ltd.",
      period: "2018 - 2021",
      description:
        "Developed and maintained multiple client projects. Implemented CI/CD pipelines and improved code quality through automated testing.",
      skills: ["Node.js", "Express", "MongoDB", "React"],
    },
    {
      id: 3,
      title: "Junior Web Developer",
      company: "WebCraft Agency",
      period: "2016 - 2018",
      description:
        "Created responsive websites for clients across various industries. Collaborated with designers to implement pixel-perfect UIs.",
      skills: ["HTML", "CSS", "JavaScript", "WordPress"],
    },
  ],
  projects: [
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
      featured: true,
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
      featured: true,
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
      featured: true,
    },
  ],
  education: [
    {
      id: 1,
      degree: "Master of Computer Science",
      institution: "Tech University",
      year: "2014 - 2016",
      description: "Specialized in Human-Computer Interaction and Software Engineering",
    },
    {
      id: 2,
      degree: "Bachelor of Science in Information Technology",
      institution: "State University",
      year: "2010 - 2014",
      description: "Graduated with honors, GPA 3.8/4.0",
    },
  ],
  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2022",
      description: "Professional level certification for designing distributed systems on AWS",
    },
    {
      id: 2,
      name: "Google Professional Cloud Developer",
      issuer: "Google Cloud",
      year: "2021",
      description: "Advanced certification for building scalable applications on GCP",
    },
    {
      id: 3,
      name: "Certified Scrum Master",
      issuer: "Scrum Alliance",
      year: "2020",
      description: "Certification in Agile project management methodologies",
    },
  ],
  skillGroups: [
    {
      id: 1,
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "TailwindCSS", "Redux", "HTML/CSS", "JavaScript"],
    },
    {
      id: 2,
      category: "Backend",
      items: ["Node.js", "Express", "Python", "Django", "GraphQL", "REST API Design"],
    },
    {
      id: 3,
      category: "Database",
      items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Redis"],
    },
    {
      id: 4,
      category: "DevOps",
      items: ["Docker", "Kubernetes", "CI/CD", "AWS", "GCP", "Vercel", "Netlify"],
    },
  ],
  adminCredentials: {
    username: "admin",
    password: "password", // In a real app, this would be hashed
  },
};

// Get the path to our data file
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

// Function to ensure the data directory exists
export const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Function to read the data file
export const readData = (): PortfolioData => {
  ensureDataDirectory();
  
  if (!fs.existsSync(DATA_FILE_PATH)) {
    // Initialize with demo data if the file doesn't exist
    writeData(initialData);
    return initialData;
  }
  
  try {
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(rawData) as PortfolioData;
  } catch (error) {
    console.error('Error reading data file:', error);
    return initialData;
  }
};

// Function to write to the data file
export const writeData = (data: PortfolioData): void => {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Create a file with initial data if it doesn't exist
export const initializeData = (): void => {
  // Only initialize if the file doesn't exist
  if (!fs.existsSync(DATA_FILE_PATH)) {
    writeData(initialData);
  }
};