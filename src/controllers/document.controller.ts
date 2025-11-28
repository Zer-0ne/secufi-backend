import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { FileExtractionService } from '@/services/file-extraction.service';
import { AIService } from '@/services/ai.service';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { S3StorageService } from '@/services/s3-storage.service';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};


export const serializeBigInt = (data: any): any => {
  return JSON.parse(
    JSON.stringify(data, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};
const s3StorageService = new S3StorageService()

export class DocumentController {

  static getUserDocuments = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const user_id = req.user?.userId!;

      const documents = await prisma.document.findMany({
        where: { user_id },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          filename: true,
          original_filename: true,
          file_size: true,
          mime_type: true,
          document_type: true,
          file_url: true,
          storage_path: true,
          document_category: true,
          confidence_score: true,
          parsing_status: true,
          created_at: true,
          updated_at: true
        }
      });
      const dataD = await Promise.all(
        documents.map(async (document) => ({
          ...document,
          file_url: document.storage_path
            ? await s3StorageService.getFileUrl(document.storage_path)
            : null
        }))
      );
      return res.json({
        success: true,
        data: serializeBigInt(dataD)
      });

    } catch (error) {
      console.error('❌ Get documents error:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message
      });
    }
  };

  static getDocumentById = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const user_id = req.user?.userId!;
      const documentId = req.params.id;

      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          user_id
        },
        select: {
          id: true,
          filename: true,
          original_filename: true,
          file_size: true,
          mime_type: true,
          document_type: true,
          document_category: true,
          confidence_score: true,
          extracted_text: true,
          extracted_data: true,
          parsing_status: true,
          parsing_error: true,
          page_count: true,
          is_password_protected: true,
          processing_method: true,
          processing_duration: true,
          ai_model_used: true,
          created_at: true,
          updated_at: true
        }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }

      return res.json({
        success: true,
        data: serializeBigInt(document)
      });

    } catch (error) {
      console.error('❌ Get document error:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message
      });
    }
  };

  static deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const user_id = req.user?.userId!;
      const documentId = req.params.id;

      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          user_id
        }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }
      // delete from the s3 bucket first
      await s3StorageService.deleteFile(document.storage_path!)

      await prisma.document.delete({
        where: { id: documentId }
      });

      return res.json({
        success: true,
        message: 'Document deleted successfully'
      });

    } catch (error) {
      console.error('❌ Delete document error:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message
      });
    }
  };
}