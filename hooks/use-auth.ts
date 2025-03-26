"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from './use-api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const api = useApi();
  const router = useRouter();

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // First check if we have a token in localStorage
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setAuthToken(storedToken);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      try {
        // If no stored token, check with the API
        const response = await api.get('/api/auth/verify');
        setIsAuthenticated(response.success && response.data?.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [api]);

  // Login function
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { username, password });
      
      if (response.success) {
        // Store the token in localStorage if it's returned
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
          setAuthToken(response.data.token);
        }
        
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post('/api/auth/logout', {});
      // Clear the stored token
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setIsAuthenticated(false);
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api, router]);

  return {
    isAuthenticated,
    isLoading,
    authToken,
    login,
    logout,
  };
}