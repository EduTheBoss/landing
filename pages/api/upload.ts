import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '../../lib/auth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure formidable options
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Check if the user is authenticated
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Parse the form data
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('File upload error:', err);
          res.status(500).json({ success: false, message: 'File upload failed' });
          return resolve(null);
        }

        // Get the file
        const file = files.file?.[0];
        if (!file) {
          res.status(400).json({ success: false, message: 'No file uploaded' });
          return resolve(null);
        }

        // Generate a unique filename
        const filename = `${uuidv4()}${path.extname(file.originalFilename || '')}`;
        const newPath = path.join(uploadsDir, filename);

        // Rename the file to use our UUID filename
        fs.renameSync(file.filepath, newPath);

        // Return the file path
        const publicPath = `/uploads/${filename}`;
        res.status(200).json({ success: true, filePath: publicPath });
        return resolve(null);
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}