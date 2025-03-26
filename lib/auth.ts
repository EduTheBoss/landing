import { NextApiRequest, NextApiResponse } from 'next';
import { readData } from './db';
import { sign, verify } from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

// Secret key for JWT - in a real app, use a strong, environment-specific secret
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

// JWT token expiration (in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24 * 7; // 1 week

// Cookie name
const COOKIE_NAME = 'portfolio_auth_token';

// Function to authenticate a user
export const authenticateUser = (username: string, password: string): boolean => {
  const data = readData();
  return (
    username === data.adminCredentials.username &&
    password === data.adminCredentials.password
  );
};

// Function to create a JWT token
export const createToken = (username: string): string => {
  return sign({ username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

// Function to set the authentication cookie
export const setAuthCookie = (res: NextApiResponse, token: string): void => {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'strict', // Prevent CSRF attacks
    path: '/', // Available across the entire site
    maxAge: TOKEN_EXPIRATION,
  });
  
  res.setHeader('Set-Cookie', cookie);
};

// Function to clear the authentication cookie
export const clearAuthCookie = (res: NextApiResponse): void => {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: -1, // Expire immediately
  });
  res.setHeader('Set-Cookie', cookie);
};

// Function to verify the JWT token
export const verifyToken = (token: string): boolean => {
  try {
    verify(token, SECRET_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

// Middleware to check if the user is authenticated
export const isAuthenticated = (req: NextApiRequest): boolean => {
  // Check for Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    if (verifyToken(token)) return true;
  }
  
  // Fallback to cookies
  const cookies = req.headers.cookie;
  if (cookies) {
    const parsedCookies = parse(cookies);
    const token = parsedCookies[COOKIE_NAME];
    
    if (token && verifyToken(token)) {
      return true;
    }
  }
  
  return false;
};