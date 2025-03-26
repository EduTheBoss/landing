import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData, Project } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request (fetch all projects)
  if (req.method === 'GET') {
    try {
      const data = readData();
      
      // Check if we should filter featured projects only
      const featured = req.query.featured === 'true';
      let projects = data.projects;
      
      if (featured) {
        projects = projects.filter(project => project.featured);
      }
      
      return res.status(200).json({ success: true, data: projects });
    } catch (error) {
      console.error('Projects fetch error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  // Handle POST request (add new project)
  if (req.method === 'POST') {
    // Check if the user is authenticated
    if (!isAuthenticated(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const data = readData();
      const newProject: Omit<Project, 'id'> = req.body;
      
      // Generate a new ID (find the max ID and add 1)
      const newId = data.projects.length > 0 
        ? Math.max(...data.projects.map(proj => proj.id)) + 1 
        : 1;
      
      // Add the new project
      data.projects.push({ ...newProject, id: newId });
      
      // Save the data
      writeData(data);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Project added successfully',
        data: { id: newId }
      });
    } catch (error) {
      console.error('Project add error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}