"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from '@/hooks/use-api';

// Define types for our portfolio data
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

interface PortfolioDataContextType {
  experiences: Experience[];
  projects: Project[];
  featuredProjects: Project[];
  education: Education[];
  certifications: Certification[];
  skillGroups: SkillGroup[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const experiencesApi = useApi<Experience[]>();
  const projectsApi = useApi<Project[]>();
  const featuredProjectsApi = useApi<Project[]>();
  const educationApi = useApi<Education[]>();
  const certificationsApi = useApi<Certification[]>();
  const skillGroupsApi = useApi<SkillGroup[]>();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [
        experiencesResult,
        projectsResult,
        featuredProjectsResult,
        educationResult,
        certificationsResult,
        skillGroupsResult
      ] = await Promise.all([
        experiencesApi.get('/api/experiences'),
        projectsApi.get('/api/projects'),
        featuredProjectsApi.get('/api/projects?featured=true'),
        educationApi.get('/api/education'),
        certificationsApi.get('/api/certifications'),
        skillGroupsApi.get('/api/skills')
      ]);
      
      if (experiencesResult.success && experiencesResult.data) {
        setExperiences(experiencesResult.data);
      }
      
      if (projectsResult.success && projectsResult.data) {
        setProjects(projectsResult.data);
      }
      
      if (featuredProjectsResult.success && featuredProjectsResult.data) {
        setFeaturedProjects(featuredProjectsResult.data);
      }
      
      if (educationResult.success && educationResult.data) {
        setEducation(educationResult.data);
      }
      
      if (certificationsResult.success && certificationsResult.data) {
        setCertifications(certificationsResult.data);
      }
      
      if (skillGroupsResult.success && skillGroupsResult.data) {
        setSkillGroups(skillGroupsResult.data);
      }
    } catch (err) {
        setError('An error occurred while fetching portfolio data');
      console.error('Portfolio data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <PortfolioDataContext.Provider 
      value={{ 
        experiences, 
        projects, 
        featuredProjects, 
        education, 
        certifications, 
        skillGroups, 
        isLoading, 
        error, 
        refreshData 
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}