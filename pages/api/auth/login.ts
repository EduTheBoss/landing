import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser, createToken, setAuthCookie } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    console.log("Login attempt:", username); // Debug log

    // Check if the user exists and the password is correct
    if (!authenticateUser(username, password)) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Create a JWT token
    const token = createToken(username);
    console.log("Token created:", !!token); // Debug log

    // Set the authentication cookie
    setAuthCookie(res, token);
    console.log("Cookie should be set now"); // Debug log

    // Return success
    return res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}