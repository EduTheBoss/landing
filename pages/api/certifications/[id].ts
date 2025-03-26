import { NextApiRequest, NextApiResponse } from 'next';
import { readData, writeData } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated for non-GET requests
  if (req.method !== 'GET' && !isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Get the certification ID from the request
  const { id } = req.query;
  const certificationId = parseInt(id as string, 10);
  
  // Check if the ID is valid
  if (isNaN(certificationId)) {
    return res.status(400).json({ success: false, message: 'Invalid certification ID' });
  }
  
  try {
    const data = readData();
    
    // Find the certification
    const certificationIndex = data.certifications.findIndex(cert => cert.id === certificationId);
    
    // Check if the certification exists
    if (certificationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }
    
    // Handle GET request (fetch certification)
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: data.certifications[certificationIndex] });
    }
    
    // Handle PUT request (update certification)
    if (req.method === 'PUT') {
      const updatedCertification = req.body;
      
      // Update the certification
      data.certifications[certificationIndex] = { ...updatedCertification, id: certificationId };
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Certification updated successfully' });
    }
    
    // Handle DELETE request (delete certification)
    if (req.method === 'DELETE') {
      // Remove the certification
      data.certifications.splice(certificationIndex, 1);
      
      // Save the data
      writeData(data);
      
      return res.status(200).json({ success: true, message: 'Certification deleted successfully' });
    }
  } catch (error) {
    console.error('Certification API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  
  // Return method not allowed for other request types
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}