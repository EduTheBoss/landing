import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request (fetch profile)
  if (req.method === 'GET') {
    try {
      const data = readData();
      return res.status(200).json({ success: true, data: data.profile });
    } catch (error) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  // Handle PUT request (update profile)
  if (req.method === 'PUT') {
    // Check if the user is authenticated
    if (!isAuthenticated(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const data = readData();
      const updatedProfile = req.body;
      
      // Update the profile
      data.profile = updatedProfile;
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}