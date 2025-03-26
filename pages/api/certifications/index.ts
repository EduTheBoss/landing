import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData, Certification } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request (fetch all certifications)
  if (req.method === 'GET') {
    try {
      const data = readData();
      return res.status(200).json({ success: true, data: data.certifications });
    } catch (error) {
      console.error('Certifications fetch error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  // Handle POST request (add new certification)
  if (req.method === 'POST') {
    // Check if the user is authenticated
    if (!isAuthenticated(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const data = readData();
      const newCertification: Omit<Certification, 'id'> = req.body;
      
      // Generate a new ID (find the max ID and add 1)
      const newId = data.certifications.length > 0 
        ? Math.max(...data.certifications.map(cert => cert.id)) + 1 
        : 1;
      
      // Add the new certification
      data.certifications.push({ ...newCertification, id: newId });
      
      // Save the data
      writeData(data);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Certification added successfully',
        data: { id: newId }
      });
    } catch (error) {
      console.error('Certification add error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}