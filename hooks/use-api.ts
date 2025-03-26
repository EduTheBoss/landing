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
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Add this to include cookies with all requests
        ...options,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
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