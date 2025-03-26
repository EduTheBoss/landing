import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated for non-GET requests
  if (req.method !== 'GET' && !isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Get the project ID from the request
  const { id } = req.query;
  const projectId = parseInt(id as string, 10);
  
  // Check if the ID is valid
  if (isNaN(projectId)) {
    return res.status(400).json({ success: false, message: 'Invalid project ID' });
  }
  
  try {
    const data = readData();
    
    // Find the project
    const projectIndex = data.projects.findIndex(proj => proj.id === projectId);
    
    // Check if the project exists
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Handle GET request (fetch project)
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: data.projects[projectIndex] });
    }
    
    // Handle PUT request (update project)
    if (req.method === 'PUT') {
      const updatedProject = req.body;
      
      // Update the project
      data.projects[projectIndex] = { ...updatedProject, id: projectId };
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Project updated successfully' });
    }
    
    // Handle DELETE request (delete project)
    if (req.method === 'DELETE') {
      // Remove the project
      data.projects.splice(projectIndex, 1);
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    }
  } catch (error) {
    console.error('Project API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}