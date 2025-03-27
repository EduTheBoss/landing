import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser, createToken } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  // Explicitly set CORS headers to allow credentials
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS Preflight');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method Not Allowed');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Check if the user exists and the password is correct
    if (!authenticateUser(username, password)) {
      console.log('Authentication Failed');
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Create a JWT token
    const token = createToken(username);

    // Set the authentication cookie with debug logging
    const cookieOptions = [
      `portfolio_auth_token=${token}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      `Max-Age=${60 * 60 * 24 * 7}`, // 1 week
      process.env.NODE_ENV === 'production' ? 'Secure' : ''
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', cookieOptions);


    // Return the token in the response body as well for API clients
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      data: { token } // Include the token in the response data
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}