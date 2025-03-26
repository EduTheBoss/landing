import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Check if the user is authenticated
    const authenticated = isAuthenticated(req);

    // Return the authentication status
    return res.status(200).json({ success: true, authenticated });
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}