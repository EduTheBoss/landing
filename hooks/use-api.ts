"use client"

import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: undefined,
    error: undefined,
    loading: false,
  });

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    setState({ loading: true, error: undefined, data: undefined });
    
    try {
      // Get token from localStorage if available
      const token = localStorage.getItem('authToken');
      
      // Prepare headers with existing options.headers if present
      const existingHeaders = options?.headers || {};
      const headers = new Headers(existingHeaders);
      
      // Set content type if not already set
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      
      // Add Authorization header if token exists
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for browser-based auth
      });
      
      // Try to parse JSON, but handle case where response might not be JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // For non-JSON responses
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { message: text };
        }
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
      
      setState({ loading: false, data: data.data, error: undefined });
      return { success: true, data: data.data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      setState({ loading: false, error: message, data: undefined });
      return { success: false, error: message };
    }
  }, []);

  const get = useCallback(async (url: string) => {
    return fetchData(url, { method: 'GET' });
  }, [fetchData]);

  const post = useCallback(async (url: string, body: any) => {
    return fetchData(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, [fetchData]);

  const put = useCallback(async (url: string, body: any) => {
    return fetchData(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }, [fetchData]);

  const del = useCallback(async (url: string) => {
    return fetchData(url, { method: 'DELETE' });
  }, [fetchData]);

  return {
    ...state,
    get,
    post,
    put,
    del,
  };
}