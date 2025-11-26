// routes/fileUpload.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { FileUploadController } from '../controllers/file-upload.controller';
import multer from 'multer';
import { FileStorageService } from '../services/file-storage.service';
import { prisma } from '../config/database';

const fileUploadRouter = Router();

// Configure multer for memory storage (no disk save)
const upload = multer({
  storage: multer.memoryStorage(), // File ko memory mein rakhega, disk pe nahi
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// ✅ NEW: Check if file is locked/password protected
// POST /api/file-upload/check-lock
fileUploadRouter.post(
  '/check-lock',
  authenticateJWT,
  upload.single('file'),
  FileUploadController.checkFileLock
);

// Upload + Extract endpoint with form-data support
fileUploadRouter.post(
  '/upload-and-extract',
  authenticateJWT,
  upload.single('file'), // 'file' field se file lega
  FileUploadController.uploadAndExtract
);

// File Preview endpoint
fileUploadRouter.get(
  '/preview/:fileId',
  authenticateJWT,
  async (req: any, res: any) => {
    try {
      const fileId = req.params.fileId;
      const userId = req.user?.userId;

      if (!fileId) {
        return res.status(400).json({
          success: false,
          error: 'File ID is required'
        });
      }

      // Get document to verify access
      const document = await prisma.document.findUnique({
        where: { id: fileId }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      // Verify user access
      if (document.user_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Redirect to S3 pre-signed URL
      res.redirect(document.file_url || '/api/files/error');

    } catch (error) {
      console.error('❌ File preview error:', error);
      res.status(500).json({
        success: false,
        error: (error as Error).message
      });
    }
  }
);


export default fileUploadRouter;
