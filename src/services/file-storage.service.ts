/**
 * @fileoverview File Storage Service for encrypted file handling
 * @description This service handles encrypted file storage and retrieval
 * for general documents. Files are encrypted and stored in S3 with secure access.
 * 
 * @module services/file-storage
 * @requires @/services/encryption.service - Encryption service
 * @requires @/config/database - Database client
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

import { EncryptionService } from './encryption.service';
import { S3StorageService } from './s3-storage.service';
import { prisma } from '../config/database';

interface FileStorageOptions {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  userId: string;
}

interface StoredFileResult {
  fileId?: string;
  previewUrl?: string;
  s3Key?: string;
  url?: string
}

export class FileStorageService {
  private encryptionService: EncryptionService;
  private s3StorageService: S3StorageService;

  constructor() {
    this.encryptionService = new EncryptionService();
    this.s3StorageService = new S3StorageService();
  }

  /**
   * Store encrypted file and return preview URL
   */
  async storeFile(options: FileStorageOptions): Promise<StoredFileResult> {
    try {
      const { buffer, filename, mimeType, userId } = options;

      console.log(`💾 Storing file in S3: ${filename} for user ${userId}`);

      // Upload original file to S3 (not encrypted)
      const s3Result = await this.s3StorageService.uploadFile({
        buffer,
        filename,
        mimeType,
        userId
      });

      // Encrypt file content for database storage (optional)
      const encryptedContent = this.encryptionService.encrypt(buffer.toString('base64'));

      // // Create document record in database
      // const document = await prisma.document.create({
      //   data: {
      //     user_id: userId,
      //     filename: filename,
      //     original_filename: filename,
      //     file_size: buffer.length,
      //     mime_type: mimeType,
      //     upload_source: 'manual',
      //     // encrypted_content: buffer.toString('utf-8'), // Optional: store encrypted content
      //     // file_url: `/api/files/preview/${this.generateFileId()}`, // Temporary URL, will update after save
      //     storage_path: s3Result.key, // Store S3 key
      //     parsing_status: 'completed',
      //     document_type: 'general',
      //     confidence_score: 100,
      //     processing_method: 'file_storage' as any
      //   }
      // });

      // // Generate pre-signed URL for direct S3 access
      // const presignedUrl = await this.s3StorageService.generatePresignedUrl(s3Result.key);

      // // Update file_url with pre-signed URL
      // const updatedDocument = await prisma.document.update({
      //   where: { id: document.id },
      //   data: {
      //     file_url: presignedUrl
      //   }
      // });

      // console.log(`✅ File stored successfully in S3: ${document.id}`);
      // console.log(s3Result)
      return {
        // fileId: document.id,
        // previewUrl: updatedDocument.file_url!,
        s3Key: s3Result.key,
        url: s3Result.url
      };

    } catch (error) {
      console.error('❌ File storage error:', error);
      throw new Error(`Failed to store file: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieve and decrypt file for preview
   */
  async getFileForPreview(fileId: string, userId: string): Promise<{
    buffer: Buffer;
    mimeType: string;
    filename: string;
  }> {
    try {
      console.log(`🔍 Retrieving file for preview: ${fileId}`);

      // Get document from database
      const document = await prisma.document.findUnique({
        where: { id: fileId }
      });

      if (!document) {
        throw new Error('File not found');
      }

      // Verify user access
      if (document.user_id !== userId) {
        throw new Error('Access denied');
      }

      // Download file directly from S3
      if (!document.storage_path) {
        throw new Error('S3 key not available');
      }

      const fileData = await this.s3StorageService.downloadFile(document.storage_path);
      const buffer = fileData.buffer;

      console.log(`✅ File retrieved for preview: ${document.filename}`);

      return {
        buffer,
        mimeType: document.mime_type,
        filename: document.filename
      };

    } catch (error) {
      console.error('❌ File retrieval error:', error);
      throw new Error(`Failed to retrieve file: ${(error as Error).message}`);
    }
  }

  /**
   * Generate unique file ID
   */
  private generateFileId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate S3 key for file storage
   */
  private generateS3Key(filename: string, userId: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `documents/${userId}/${timestamp}_${randomStr}_${filename}`;
  }

  /**
   * Extract IV from encrypted content (first 32 chars)
   */
  private getIVFromEncryptedContent(encryptedContent: string): string {
    return encryptedContent.substring(0, 32);
  }

  /**
   * Delete stored file
   */
  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting file: ${fileId}`);

      // Verify user access
      const document = await prisma.document.findUnique({
        where: { id: fileId }
      });

      if (!document) {
        throw new Error('File not found');
      }

      if (document.user_id !== userId) {
        throw new Error('Access denied');
      }

      // Delete from S3
      if (document.storage_path) {
        await this.s3StorageService.deleteFile(document.storage_path);
      }

      // Delete from database
      await prisma.document.delete({
        where: { id: fileId }
      });

      console.log(`✅ File deleted successfully: ${fileId}`);

    } catch (error) {
      console.error('❌ File deletion error:', error);
      throw new Error(`Failed to delete file: ${(error as Error).message}`);
    }
  }


}