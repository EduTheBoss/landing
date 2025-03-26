import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated for non-GET requests
  if (req.method !== 'GET' && !isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Get the experience ID from the request
  const { id } = req.query;
  const experienceId = parseInt(id as string, 10);
  
  // Check if the ID is valid
  if (isNaN(experienceId)) {
    return res.status(400).json({ success: false, message: 'Invalid experience ID' });
  }
  
  try {
    const data = readData();
    
    // Find the experience
    const experienceIndex = data.experiences.findIndex(exp => exp.id === experienceId);
    
    // Check if the experience exists
    if (experienceIndex === -1) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }
    
    // Handle GET request (fetch experience)
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: data.experiences[experienceIndex] });
    }
    
    // Handle PUT request (update experience)
    if (req.method === 'PUT') {
      const updatedExperience = req.body;
      
      // Update the experience
      data.experiences[experienceIndex] = { ...updatedExperience, id: experienceId };
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Experience updated successfully' });
    }
    
    // Handle DELETE request (delete experience)
    if (req.method === 'DELETE') {
      // Remove the experience
      data.experiences.splice(experienceIndex, 1);
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Experience deleted successfully' });
    }
  } catch (error) {
    console.error('Experience API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}