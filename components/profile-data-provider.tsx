"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from '@/hooks/use-api';

// Define the types for our profile data
export interface ProfileData {
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

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi<ProfileData>();

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.get('/api/profile');
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError('Failed to load profile data');
      }
    } catch (err) {
      setError('An error occurred while fetching profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}