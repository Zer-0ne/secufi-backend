/**
 * @fileoverview S3 Storage Service for file handling
 * @description This service handles file storage and retrieval from AWS S3
 * 
 * @module services/s3-storage
 * @requires aws-sdk - AWS SDK for S3 operations
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

import { S3 } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface S3UploadOptions {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  userId: string;
}

interface S3UploadResult {
  key: string;
  url: string;
  etag: string | undefined;
}

export class S3StorageService {
  private s3: S3;
  private bucketName: string;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION || 'ap-southeast-2', // Bucket ka correct region
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'secufi-bucket';
  }

  /**
   * Upload file to S3
   */
  async uploadFile(options: S3UploadOptions): Promise<S3UploadResult> {
    try {
      const { buffer, filename, mimeType, userId } = options;

      console.log(`📤 Uploading file to S3: ${filename} for user ${userId}`);

      // Generate S3 key
      const key = this.generateS3Key(filename, userId);

      // Upload to S3
      const result = await this.s3.putObject({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ContentDisposition: `inline; filename="${filename}"`,
        Metadata: {
          userId,
          originalFilename: filename
        }
      });

      // Use access point alias URL format
      // const url = `https://${this.bucketName}.s3-accesspoint.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com/${key}`;
      const url = await this.getFileUrl(key)

      console.log(`✅ File uploaded to S3: ${key}`);

      return {
        key,
        url,
        etag: result.ETag
      };

    } catch (error) {
      console.error('❌ S3 upload error:', error);
      throw new Error(`Failed to upload file to S3: ${(error as Error).message}`);
    }
  }

  async getFileUrl(key: string) {
    // const s3Client = new S3Client({
    //   region: process.env.AWS_REGION,
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    //   }
    // });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME, // 'secufi-app' (without access point)
      Key: key, // 'documents/...'
    });

    // Signed URL generate karo - 1 hour valid
    const url = await getSignedUrl(this.s3, command, {
      // expiresIn: 3600  // 1 hour
    });

    return url;
  }

  /**
   * Download file from S3
   */
  async downloadFile(key: string): Promise<{ buffer: Buffer; mimeType: string }> {
    try {
      console.log(`📥 Downloading file from S3: ${key}`);

      const result = await this.s3.getObject({
        Bucket: this.bucketName,
        Key: key
      });

      if (!result.Body) {
        throw new Error('File not found in S3');
      }

      // Convert stream to buffer
      const buffer = await result.Body.transformToByteArray();
      const mimeType = result.ContentType || 'application/octet-stream';

      console.log(`✅ File downloaded from S3: ${key}`);

      return {
        buffer: Buffer.from(buffer),
        mimeType
      };

    } catch (error) {
      console.error('❌ S3 download error:', error);
      throw new Error(`Failed to download file from S3: ${(error as Error).message}`);
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting file from S3: ${key}`);

      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: key
      });

      console.log(`✅ File deleted from S3: ${key}`);

    } catch (error) {
      console.error('❌ S3 delete error:', error);
      throw new Error(`Failed to delete file from S3: ${(error as Error).message}`);
    }
  }

  /**
   * Generate S3 key for file storage
   */
  private generateS3Key(filename: string, userId: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `documents/${userId}/${timestamp}_${randomStr}_${safeFilename}`;
  }

  /**
   * Generate pre-signed URL for temporary access
   */
  async generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const url = await getSignedUrl(this.s3, command, { expiresIn });

      console.log(`🔗 Generated pre-signed URL for: ${key}`);

      return url;

    } catch (error) {
      console.error('❌ Pre-signed URL generation error:', error);
      throw new Error(`Failed to generate pre-signed URL: ${(error as Error).message}`);
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3.headObject({
        Bucket: this.bucketName,
        Key: key
      });
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}