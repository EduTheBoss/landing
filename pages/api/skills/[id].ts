import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated for non-GET requests
  if (req.method !== 'GET' && !isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Get the skill group ID from the request
  const { id } = req.query;
  const skillGroupId = parseInt(id as string, 10);
  
  // Check if the ID is valid
  if (isNaN(skillGroupId)) {
    return res.status(400).json({ success: false, message: 'Invalid skill group ID' });
  }
  
  try {
    const data = readData();
    
    // Find the skill group
    const skillGroupIndex = data.skillGroups.findIndex(group => group.id === skillGroupId);
    
    // Check if the skill group exists
    if (skillGroupIndex === -1) {
      return res.status(404).json({ success: false, message: 'Skill group not found' });
    }
    
    // Handle GET request (fetch skill group)
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: data.skillGroups[skillGroupIndex] });
    }
    
    // Handle PUT request (update skill group)
    if (req.method === 'PUT') {
      const updatedSkillGroup = req.body;
      
      // Update the skill group
      data.skillGroups[skillGroupIndex] = { ...updatedSkillGroup, id: skillGroupId };
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Skill group updated successfully' });
    }
    
    // Handle DELETE request (delete skill group)
    if (req.method === 'DELETE') {
      // Remove the skill group
      data.skillGroups.splice(skillGroupIndex, 1);
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Skill group deleted successfully' });
    }
  } catch (error) {
    console.error('Skill group API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}