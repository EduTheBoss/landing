import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated for non-GET requests
  if (req.method !== 'GET' && !isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Get the education ID from the request
  const { id } = req.query;
  const educationId = parseInt(id as string, 10);
  
  // Check if the ID is valid
  if (isNaN(educationId)) {
    return res.status(400).json({ success: false, message: 'Invalid education ID' });
  }
  
  try {
    const data = readData();
    
    // Find the education entry
    const educationIndex = data.education.findIndex(edu => edu.id === educationId);
    
    // Check if the education entry exists
    if (educationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Education entry not found' });
    }
    
    // Handle GET request (fetch education entry)
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: data.education[educationIndex] });
    }
    
    // Handle PUT request (update education entry)
    if (req.method === 'PUT') {
      const updatedEducation = req.body;
      
      // Update the education entry
      data.education[educationIndex] = { ...updatedEducation, id: educationId };
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Education entry updated successfully' });
    }
    
    // Handle DELETE request (delete education entry)
    if (req.method === 'DELETE') {
      // Remove the education entry
      data.education.splice(educationIndex, 1);
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Education entry deleted successfully' });
    }
  } catch (error) {
    console.error('Education API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}