/**
 * @fileoverview Video Compression Service
 * @description This service handles video compression using cloud-based APIs
 * as an alternative to FFmpeg for simpler deployment
 * 
 * @module services/video-compression
 * @requires @aws-sdk/client-s3 - AWS S3 client for file operations
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

import { S3StorageService } from './s3-storage.service';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs'
import { tmpdir } from 'os';
import { createWriteStream, readFile } from 'fs';
import { join } from 'path';

ffmpeg.setFfmpegPath(ffmpegPath as string);

interface CompressionOptions {
  targetSize?: number; // Target file size in MB
  quality?: number; // Quality percentage (1-100)
  resolution?: string; // Target resolution (e.g., "720p", "480p")
  format?: string; // Output format (mp4, webm)
}

interface CompressionResult {
  success: boolean;
  compressedBuffer?: Buffer;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  error?: string;
}

export class VideoCompressionService {
  private s3Service: S3StorageService;

  constructor() {
    this.s3Service = new S3StorageService();
  }

  /**
   * Compress video using cloud-based compression service
   * For now, this is a placeholder that returns the original file
   * In production, integrate with a cloud compression API
   */
  async compressVideo(
    fileBuffer: Buffer,
    filename: string,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    try {
      const originalSize = fileBuffer.length;

      // Default compression options
      const defaultOptions: CompressionOptions = {
        targetSize: 10, // 10MB target
        quality: 70, // 70% quality
        resolution: '720p', // 720p resolution
        format: 'mp4'
      };

      const finalOptions = { ...defaultOptions, ...options };

      console.log(`🎬 Starting video compression: ${filename}`);
      console.log(`📊 Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`⚙️ Compression options:`, finalOptions);

      // Placeholder for cloud compression API integration
      // For now, return the original file with simulated compression info
      const compressedBuffer = await this.simulateCompression(fileBuffer, finalOptions);

      const compressedSize = compressedBuffer.length;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

      console.log(`✅ Video compression completed`);
      console.log(`📊 Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`📈 Compression ratio: ${compressionRatio.toFixed(2)}%`);

      return {
        success: true,
        compressedBuffer,
        originalSize,
        compressedSize,
        compressionRatio
      };

    } catch (error) {
      console.error('❌ Video compression error:', error);
      return {
        success: false,
        originalSize: fileBuffer.length,
        error: error instanceof Error ? error.message : 'Unknown compression error'
      };
    }
  }

  /**
   * Simulate compression for development/testing
   * In production, replace with actual cloud compression API call
   */
  private async simulateCompression(
    buffer: Buffer,
    options: CompressionOptions
  ): Promise<Buffer> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, return the original buffer (no actual compression)
    // In production, integrate with:
    // - AWS MediaConvert
    // - Cloudinary Video API
    // - Vimeo Compression API
    // - Custom FFmpeg microservice

    return buffer;

    // const inputPath = join(tmpdir(), `input-${Date.now()}.mp4`);
    // const outputPath = join(tmpdir(), `output-${Date.now()}.mp4`);

    // await fs.promises.writeFile(inputPath, buffer);

    // await new Promise<void>((resolve, reject) => {
    //   let cmd = ffmpeg(inputPath)
    //     .outputOptions([
    //       '-vcodec libx264',
    //       '-preset fast',
    //       `-crf ${options.quality ? Math.round((100 - options.quality) / 4) : 23}`,
    //     ])
    //     .size(options.resolution === '480p' ? '854x480' : '1280x720')
    //     .on('end', () => resolve())
    //     .on('error', reject)
    //     .save(outputPath);
    // });

    // const compressedBuffer = await fs.promises.readFile(outputPath);
    // return compressedBuffer;
  }

  /**
   * Compress and upload video to S3 in one operation
   */
  async compressAndUploadVideo(
    fileBuffer: Buffer,
    filename: string,
    userId: string,
    options: CompressionOptions = {}
  ): Promise<{ success: boolean; key?: string; url?: string; error?: string }> {
    try {
      // Compress the video
      const compressionResult = await this.compressVideo(fileBuffer, filename, options);

      if (!compressionResult.success) {
        return {
          success: false,
          error: compressionResult.error!
        };
      }

      // Upload compressed video to S3
      const uploadResult = await this.s3Service.uploadFile({
        buffer: compressionResult.compressedBuffer!,
        filename: `compressed_${filename}`,
        mimeType: 'video/mp4',
        userId
      });

      // Generate pre-signed URL
      const videoUrl = await this.s3Service.generatePresignedUrl(uploadResult.key);

      return {
        success: true,
        key: uploadResult.key,
        url: videoUrl
      };

    } catch (error) {
      console.error('❌ Compress and upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get compression statistics for monitoring
   */
  getCompressionStats(originalSize: number, compressedSize: number) {
    const sizeReduction = originalSize - compressedSize;
    const compressionRatio = (sizeReduction / originalSize) * 100;

    return {
      originalSizeMB: (originalSize / 1024 / 1024).toFixed(2),
      compressedSizeMB: (compressedSize / 1024 / 1024).toFixed(2),
      sizeReductionMB: (sizeReduction / 1024 / 1024).toFixed(2),
      compressionRatio: compressionRatio.toFixed(2)
    };
  }
}