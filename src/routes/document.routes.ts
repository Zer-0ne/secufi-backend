import { Router } from 'express';
import { authenticateJWT } from '@/middlewares/auth.middleware';
import { DocumentController } from '@/controllers/document.controller';
import multer from 'multer';

const documentRouter = Router();


// Get user documents
// GET /api/documents
documentRouter.get(
  '/',
  authenticateJWT,
  DocumentController.getUserDocuments
);

// Get specific document
// GET /api/documents/:id
documentRouter.get(
  '/:id',
  authenticateJWT,
  DocumentController.getDocumentById
);

// Delete document
// DELETE /api/documents/:id
documentRouter.delete(
  '/:id',
  authenticateJWT,
  DocumentController.deleteDocument
);

export default documentRouter;