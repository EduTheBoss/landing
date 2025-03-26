import { NextApiRequest, NextApiResponse } from 'next';
import { readData } from './db';
import { sign, verify } from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

// Secret key for JWT
const SECRET_KEY = 'your_jwt_secret_key';

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
    httpOnly: false, // Allow JavaScript access for debugging
    secure: false, // False for HTTP in development
    sameSite: 'lax', // Lax is more permissive than strict
    path: '/',
    maxAge: TOKEN_EXPIRATION,
  });
  
  console.log("Setting cookie:", cookie);
  res.setHeader('Set-Cookie', cookie);
};

// Function to clear the authentication cookie
export const clearAuthCookie = (res: NextApiResponse): void => {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
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
  console.log("Checking authentication");
  
  // Check for Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log("Found token in Authorization header");
    if (verifyToken(token)) {
      console.log("Token is valid");
      return true;
    }
  }
  
  // Fallback to cookies
  const cookies = req.headers.cookie;
  if (cookies) {
    const parsedCookies = parse(cookies);
    const token = parsedCookies[COOKIE_NAME];
    
    if (token && verifyToken(token)) {
      console.log("Token from cookie is valid");
      return true;
    }
  }
  
  console.log("Authentication failed");
  return false;
};