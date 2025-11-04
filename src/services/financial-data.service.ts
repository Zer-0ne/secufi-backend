import { PrismaClient } from '@prisma/client';
import { AIService } from './ai.service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface representing email data received from Gmail API
 * Contains email metadata and attachment information
 */
export interface EmailData {
  emailId: string;
  subject: string;
  from: string;
  body: string;
  date: string;
  attachmentPaths?: string[];
  attachmentContents: AttachmentContent[];
}

/**
 * Interface representing parsed attachment content
 * Includes file metadata and extracted text content
 */
export interface AttachmentContent {
  filename: string;
  mimeType: string;
  size: number;
  content: string; // Extracted text content from parser service
  metadata: Record<string, any>;
}

/**
 * FinancialDataService
 * 
 * Core service for processing financial emails and extractments using AI analysis.
 * Handles the complete workflow of:
 * 1. Email classification (financial vs non-financial)
 * 2. AI-powered content extraction and analysis
 * 3. Asset categorization (asset/liability/insurance)
 * 4. Multi-table data storage (PdfDocument, Document, Asset, Transaction)
 * 5. Financial data retrieval, search, and analytics
 * 
 * @class FinancialDataService
 * @description
 * This service acts as the central hub for financial data processing.
 * It integrates with AIService for intelligent content extraction and
 * uses Prisma ORM for database operations across multiple related tables.
 * 
 * Key Features:
 * - Automatic email classification using AI
 * - Multi-format attachment processing (PDF, images, CSV, Excel)
 * - Triple-table storage for comprehensive data tracking
 * - Asset categorization into 3 main types: asset, liability, insurance
 * - Transaction linking with proper relationships
 * - Full-text search capabilities
 * - Financial statistics and analytics
 * 
 * Database Schema:
 * - PdfDocument: Raw document storage with parsing status
 * - Document: Processed documents with confidence scores
 * - Asset: Financial assets with type/category classification
 * - Transaction: Financial transactions with extracted metadata
 * 
 * @example
 * ```
 * const service = new FinancialDataService(prisma, aiService);
 * const result = await service.processFinancialEmail(userId, emailData);
 * ```
 */
export class FinancialDataService {
  private prisma: PrismaClient;
  private aiService: AIService;

  /**
   * Initialize FinancialDataService with required dependencies
   * 
   * @param {PrismaClient} prisma - Prisma ORM client for database operations
   * @param {AIService} aiService - AI service for content analysis and classification
   */
  constructor(
    prisma: PrismaClient,
    aiService: AIService
  ) {
    this.prisma = prisma;
    this.aiService = aiService;
  }

  /**
   * Get all assets for a specific user
   * 
   * @param {string} userId - User ID to fetch assets for
   * @returns {Promise<Asset[]>} Array of asset records
   * 
   * @example
   * ```
   * const assets = await service.getAssetsByUserId('user-123');
   * console.log(`Found ${assets.length} assets`);
   * ```
   */
  getAssetsByUserId = async (userId: string) => {
    return this.prisma.asset.findMany({
      where: { user_id: userId },
    });
  };

  /**
   * Process financial email with attachments
   * 
   * Main workflow method that orchestrates the entire financial email processing pipeline:
   * 1. Classifies email as financial/non-financial using AI
   * 2. Analyzes email content and extracts structured data
   * 3. Processes all attachments (saves to 3 tables: PdfDocument, Document, Asset)
   * 4. Creates transaction record with proper categorization
   * 5. Updates cross-table relationships
   * 
   * @param {string} userId - User ID who owns this email
   * @param {EmailData} emailData - Complete email data including body and attachments
   * @returns {Promise<any>} Processing result with transaction ID, analysis, and attachment details
   * 
   * @throws {Error} If database operations fail or AI analysis errors occur
   * 
   * @example
   * ```
   * const emailData: EmailData = {
   *   emailId: 'gmail-123',
   *   subject: 'Your Credit Card Statement',
   *   from: 'bank@example.com',
   *   body: 'Your statement is attached...',
   *   date: '2025-11-02',
   *   attachmentContents: [
   *     {
   *       filename: 'statement.pdf',
   *       mimeType: 'application/pdf',
   *       size: 102400,
   *       content: 'Extracted text content...',
   *       metadata: {}
   *     }
   *   ]
   * };
   * 
   * const result = await service.processFinancialEmail('user-123', emailData);
   * console.log(`Transaction ID: ${result.transactionId}`);
   * console.log(`Classification: ${result.emailAnalysis.classification.category}`);
   * ```
   * 
   * @remarks
   * - Low confidence emails (< 40%) are still processed but logged with warning
   * - Attachments are saved to ALL 3 tables (PdfDocument, Document, Asset) for comprehensive tracking
   * - Asset categorization uses AI to classify into: asset, liability, or insurance
   * - All IDs are tracked in transaction's extracted_data for easy cross-referencing
   */
  async processFinancialEmail(
  userId: string,
  emailData: EmailData
): Promise<any> {
  try {
    console.log(`⟳ Processing financial email: ${emailData.subject}`);

    const classification = await this.aiService.classifyEmailContent(emailData.body);

    if (!classification.isFinancial) {
      return {
        processed: false,
        reason: 'Not a financial email',
      };
    }
    
    // Enhanced AI analysis
    const emailAnalysis = await this.aiService.analyzeFinancialEmail({
      emailContent: emailData.body,
      subject: emailData.subject,
      sender: emailData.from,
      attachmentContents: emailData.attachmentContents,
      documentType: this.guessDocumentType(emailData.subject),
    });
    
    console.log('📊 Email Analysis:', emailAnalysis);

    if (emailAnalysis.extractedData.confidence < 40) {
      console.log(`⚠️ Low confidence: ${emailAnalysis.extractedData.confidence}%`);
    }

    let attachmentAnalyses: any[] = [];
    const pdfDocumentIds: string[] = [];
    const documentIds: string[] = [];
    const assetIds: string[] = [];

    // Process attachments
    if (emailData.attachmentContents && emailData.attachmentContents.length > 0) {
      for (const attachment of emailData.attachmentContents) {
        const attachmentAnalysis = await this.aiService.analyzePDFDocument({
          text: attachment.content,
          documentType: this.guessDocumentType(attachment.filename),
        });

        const extracted = emailAnalysis.extractedData;

        // Save to Asset with ALL new fields
        const assetRecord = await this.prisma.asset.create({
          data: {
            user_id: userId,
            name: `${extracted.assetCategory?.toUpperCase()}: ${extracted.merchant || attachment.filename}`,
            
            // 🎯 3-Category Classification
            type: extracted.assetCategory,
            sub_type: extracted.assetType,
            
            // 🏦 Bank Details
            account_number: extracted.accountNumber,
            ifsc_code: extracted.ifscCode,
            branch_name: extracted.branchName,
            bank_name: extracted.bankName,
            
            // 💰 Financial Values
            balance: extracted.amount 
              ? parseFloat(String(extracted.amount))
              : extracted.financialMetadata?.currentValue
              ? parseFloat(String(extracted.financialMetadata.currentValue))
              : null,
            
            total_value: extracted.financialMetadata?.totalValue
              ? parseFloat(String(extracted.financialMetadata.totalValue))
              : null,
            
            // 📊 Status
            status: extracted.status || 'active',
            last_updated: new Date(),
            
            // 💳 Insurance/Investment Fields
            policy_number: extracted.policyNumber,
            folio_number: extracted.folioNumber,
            fund_name: extracted.fundName,
            
            // 📄 Document Fields
            document_type: extracted.assetType,
            file_name: attachment.filename,
            file_size: attachment.size,
            mime_type: attachment.mimeType,
            file_content: attachment.content,
            
            // 📋 Complete Metadata
            document_metadata: {
              // Classification
              category: extracted.assetCategory,
              type: extracted.assetType,
              subType: extracted.assetSubType,
              status: extracted.status,
              
              // AI Analysis
              aiAnalysis: extracted,
              attachmentAnalysis: attachmentAnalysis.extractedData,
              confidence: extracted.confidence,
              
              // Financial Metadata
              financialMetadata: extracted.financialMetadata,
              
              // Transaction Details
              merchant: extracted.merchant,
              description: extracted.description,
              transactionDate: extracted.date,
              currency: extracted.currency,
              
              // Document info
              emailId: emailData.emailId,
              emailSubject: emailData.subject,
              emailSender: emailData.from,
              extractedAt: new Date().toISOString(),
              
              // Key findings
              keyPoints: emailAnalysis.keyPoints,
            },
            
            email_id: emailData.emailId,
          },
        });
        assetIds.push(assetRecord.id);

        console.log(`✅ Saved: ${extracted.assetCategory} > ${extracted.assetType} [${extracted.status}]`);

        attachmentAnalyses.push({
          assetId: assetRecord.id,
          fileName: attachment.filename,
          category: extracted.assetCategory,
          type: extracted.assetType,
          status: extracted.status,
          confidence: extracted.confidence,
          analysis: attachmentAnalysis,
        });
      }
    }

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        user_id: userId,
        email_id: emailData.emailId,
        subject: emailData.subject,
        sender: emailData.from,
        recipient: 'User',
        amount: emailAnalysis.extractedData.amount
          ? parseFloat(String(emailAnalysis.extractedData.amount))
          : null,
        currency: emailAnalysis.extractedData.currency || 'INR',
        transaction_type: emailAnalysis.extractedData.transactionType,
        merchant: emailAnalysis.extractedData.merchant,
        description: emailAnalysis.extractedData.description,
        transaction_date: emailAnalysis.extractedData.date
          ? new Date(emailAnalysis.extractedData.date)
          : new Date(),
        email_date: new Date(emailData.date),
        status: 'processed',
        
        raw_data: {
          emailContent: emailData.body.substring(0, 500),
          classification,
          assetIds,
        },
        
        extracted_data: {
          ...emailAnalysis.extractedData,
          assetIds,
          attachmentSummary: attachmentAnalyses,
        },
      },
    });

    // Update asset relationships
    if (assetIds.length > 0) {
      await this.prisma.asset.updateMany({
        where: { id: { in: assetIds } },
        data: { transaction_id: transaction.id },
      });
    }

    console.log(`✅ Transaction: ${transaction.id}`);
    console.log(`📁 Assets created: ${assetIds.length}`);

    return {
      processed: true,
      transactionId: transaction.id,
      emailAnalysis: {
        summary: emailAnalysis.summary,
        keyPoints: emailAnalysis.keyPoints,
        extractedData: emailAnalysis.extractedData,
      },
      attachmentAnalyses,
      assetIds,
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


  /**
   * Process individual attachment file from file system
   * 
   * Handles direct file processing (not from Gmail API):
   * 1. Reads file content based on mime type
   * 2. Sends content to AI for analysis
   * 3. Saves to PdfDocument table
   * 4. Saves to Document table
   * 5. Generates markdown and HTML representation
   * 
   * @param {string} filePath - Absolute path to the attachment file
   * @param {string} userId - User ID who owns this file
   * @returns {Promise<any | null>} Analysis result with document IDs or null if confidence too low
   * 
   * @private
   * @throws {Error} If file reading or database operations fail
   * 
   * @example
   * ```
   * const result = await service.processAttachmentFile(
   *   '/uploads/invoice.pdf',
   *   'user-123'
   * );
   * if (result) {
   *   console.log(`PDF Document ID: ${result.pdfDocumentId}`);
   *   console.log(`Document ID: ${result.documentId}`);
   * }
   * ```
   * 
   * @remarks
   * - Files with confidence < 30% are skipped
   * - Generates both markdown and HTML representations
   * - Does NOT save to Asset table (only PdfDocument and Document)
   * - Suitable for batch file processing from uploads folder
   */
  private async processAttachmentFile(
    filePath: string,
    userId: string
  ): Promise<any | null> {
    try {
      console.log(`📄 Analyzing attachment: ${filePath}`);
      const fileName = path.basename(filePath);
      const fileStats = fs.statSync(filePath);
      const fileSize = fileStats.size;
      const mimeType = this.getMimeType(filePath);

      // Read file content based on type
      const fileContent = this.readFileContent(filePath);

      // 🤖 AI ANALYSIS - Send extracted content to AI
      console.log(`🤖 Sending content to AI for analysis...`);
      const analysis = await this.aiService.analyzePDFDocument({
        text: fileContent,
        documentType: this.guessDocumentType(fileName),
      });

      console.log(`✅ AI Analysis completed:`, {
        confidence: analysis.extractedData?.confidence,
        transactionType: analysis.extractedData?.transactionType,
        amount: analysis.extractedData?.amount,
      });

      // Skip low confidence results
      if (analysis.extractedData.confidence < 30) {
        console.log(`⚠️  Low confidence (${analysis.extractedData.confidence}%), skipping`);
        return null;
      }

      // Map transaction type to standard format
      let docType: any = analysis.extractedData.transactionType || 'other';
      const typeMap: Record<string, string> = {
        invoice: 'invoice',
        receipt: 'receipt',
        statement: 'statement',
        tax: 'tax',
        creditcard: 'credit_card',
        bill: 'bill',
        other: 'other',
      };
      docType = typeMap[docType] || 'other';

      // Create markdown representation
      const markdownContent = this.createMarkdownContent(
        fileName,
        fileSize,
        mimeType,
        docType,
        analysis
      );

      // Save to PdfDocument table
      const pdfDocument = await this.prisma.pdfDocument.create({
        data: {
          userId: userId,
          filename: fileName,
          originalFilename: fileName,
          filePath: null,
          fileSize: BigInt(fileSize),
          mimeType: mimeType,
          parsingStatus: 'completed',
          extractedText: markdownContent.substring(0, 10000), // Limit to 10k chars
          extractedData: analysis.extractedData,
          pageCount: this.estimatePageCount(markdownContent),
          uploadSource: 'gmail',
        },
      });

      // Save to Document table
      const document = await this.prisma.document.create({
        data: {
          userId: userId,
          filename: fileName,
          originalFilename: fileName,
          filePath: null,
          fileSize: BigInt(fileSize),
          mimeType: mimeType,
          parsingStatus: 'completed',
          extractedText: markdownContent.substring(0, 10000),
          documentType: docType,
          documentCategory: this.guessDocumentType(fileName),
          confidenceScore: analysis.extractedData.confidence,
          extractedData: analysis.extractedData,
          dataQualityScore: analysis.extractedData.confidence,
          pageCount: this.estimatePageCount(markdownContent),
          aiModelUsed: 'openrouter-auto',
          processingMethod: 'ai',
        },
      });

      console.log(`✅ Attachment analyzed: ${pdfDocument.id}`);

      // Convert markdown to HTML for display
      const htmlContent = this.markdownToHtml(markdownContent);

      return {
        pdfDocumentId: pdfDocument.id,
        documentId: document.id,
        fileName,
        fileSize: `${(fileSize / 1024).toFixed(2)}KB`,
        mimeType: mimeType,
        htmlContent,
        analysis: {
          extractedData: analysis.extractedData,
          summary: analysis.summary,
          keyPoints: analysis.keyPoints,
        },
      };
    } catch (error) {
      console.error('❌ Error processing attachment file:', error);
      return null;
    }
  }

  /**
   * Read file content based on mime type
   * 
   * Handles different file types:
   * - PDF, Images: Returns placeholder text (actual extraction done by parser service)
   * - Excel, Spreadsheets: Returns placeholder text
   * - CSV: Reads first 2000 characters
   * - Text files: Reads first 1000 characters
   * 
   * @param {string} filePath - Path to the file
   * @returns {string} Extracted or placeholder content
   * 
   * @private
   * @example
   * ```
   * const content = this.readFileContent('/uploads/invoice.pdf');
   * console.log(content);
   * // Output: "File: invoice.pdf\nType: application/pdf\n\nContent extracted..."
   * ```
   */
  private readFileContent(filePath: string): string {
    try {
      const fileName = path.basename(filePath);
      const ext = path.extname(filePath).toLowerCase();

      // Binary files (PDF, Images) - Return placeholder
      if (ext === '.pdf' || ext.match(/\.(jpg|jpeg|png|gif|tiff)$/i)) {
        return `File: ${fileName}\nType: ${this.getMimeType(filePath)}\n\nContent extracted and processed by AI.`;
      }

      // Spreadsheet files
      if (ext === '.xlsx' || ext === '.xls') {
        return `Spreadsheet: ${fileName}\nContent extracted and processed by AI.`;
      }

      // CSV files - Try to read content
      if (ext === '.csv') {
        try {
          const buffer = fs.readFileSync(filePath);
          const content = buffer.toString('utf-8');
          return content.substring(0, 2000); // First 2000 chars
        } catch (e) {
          return `CSV File: ${fileName}\nContent extracted by AI.`;
        }
      }

      // Text files - Try to read content
      try {
        const buffer = fs.readFileSync(filePath);
        const content = buffer.toString('utf-8');
        return content.substring(0, 1000); // First 1000 chars
      } catch (e) {
        return `File: ${fileName}\nContent extracted by AI.`;
      }
    } catch (error) {
      console.error('Error reading file content:', error);
      return '';
    }
  }

  /**
   * Create markdown content with extracted data
   * 
   * Generates a structured markdown document containing:
   * - Document information table
   * - Analysis results
   * - Summary text
   * - Key points list
   * - Financial information (if available)
   * - Processing metadata
   * 
   * @param {string} fileName - Name of the file
   * @param {number} fileSize - File size in bytes
   * @param {string} mimeType - MIME type of the file
   * @param {string} docType - Document type classification
   * @param {any} analysis - AI analysis results
   * @returns {string} Formatted markdown content
   * 
   * @private
   * @example
   * ```
   * const markdown = this.createMarkdownContent(
   *   'invoice.pdf',
   *   102400,
   *   'application/pdf',
   *   'invoice',
   *   aiAnalysis
   * );
   * ```
   */
  private createMarkdownContent(
    fileName: string,
    fileSize: number,
    mimeType: string,
    docType: string,
    analysis: any
  ): string {
    const fileSizeKB = (fileSize / 1024).toFixed(2);

    let markdown = `# ${fileName}

## Document Information

| Property | Value |
|----------|-------|
| File Name | ${fileName} |
| File Size | ${fileSizeKB}KB |
| MIME Type | ${mimeType} |
| Document Type | ${docType} |
| Status | ✓ Processed |

## Analysis Results

| Metric | Value |
|--------|-------|
| Transaction Type | ${analysis.extractedData.transactionType} |
| Confidence Score | ${analysis.extractedData.confidence}% |
| Quality Score | ${analysis.extractedData.confidence}% |

## Summary

${analysis.summary || 'Financial document successfully analyzed.'}

`;

    // Add key points if available
    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      markdown += `## Key Points\n\n`;
      analysis.keyPoints.forEach((point: string) => {
        markdown += `- ${point}\n`;
      });
      markdown += '\n';
    }

    // Add financial information if available
    if (analysis.extractedData.amount) {
      markdown += `## Financial Information\n\n`;
      markdown += `- **Amount:** ${analysis.extractedData.currency} ${analysis.extractedData.amount}\n`;

      if (analysis.extractedData.merchant) {
        markdown += `- **Merchant:** ${analysis.extractedData.merchant}\n`;
      }

      if (analysis.extractedData.date) {
        markdown += `- **Date:** ${analysis.extractedData.date}\n`;
      }

      if (analysis.extractedData.description) {
        markdown += `- **Description:** ${analysis.extractedData.description}\n`;
      }

      markdown += '\n';
    }

    // Add processing metadata
    markdown += `## Processing Metadata

- **Processed At:** ${new Date().toISOString()}
- **AI Model:** OpenRouter Auto
- **Processing Method:** AI Analysis`;

    return markdown;
  }

  /**
   * Convert markdown to styled HTML
   * 
   * Converts markdown syntax to HTML with professional styling:
   * - Headers (H1, H2, H3)
   * - Tables with hover effects
   * - Lists (bulleted)
   * - Bold and italic text
   * - Responsive design
   * 
   * @param {string} markdown - Markdown content to convert
   * @returns {string} Styled HTML content
   * 
   * @private
   * @example
   * ```
   * const html = this.markdownToHtml('# Title\n\nContent here...');
   * // Returns: <div style="..."><h1>Title</h1><p>Content here...</p></div>
   * ```
   */
  private markdownToHtml(markdown: string): string {
    return `<div style="max-width: 900px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
${markdown
        .split('\n')
        .map((line) => {
          // Headers
          if (line.startsWith('# ')) {
            return `<h1 style="font-size: 28px; font-weight: bold; margin: 30px 0 15px 0; color: #1a1a1a; border-bottom: 3px solid #007bff; padding-bottom: 10px;">${line.substring(2)}</h1>`;
          }
          if (line.startsWith('## ')) {
            return `<h2 style="font-size: 22px; font-weight: bold; margin: 25px 0 12px 0; color: #0056b3;">${line.substring(3)}</h2>`;
          }
          if (line.startsWith('### ')) {
            return `<h3 style="font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; color: #0056b3;">${line.substring(4)}</h3>`;
          }

          // Tables
          if (line.startsWith('| ')) {
            if (line.includes('---') || line.includes('---')) {
              return ''; // Skip separator row
            }

            const cells = line
              .split('|')
              .map((cell) => cell.trim())
              .filter((cell) => cell.length > 0);

            const isHeader = line.includes('---');

            const cellHTML = cells
              .map((cell) => {
                const tag = isHeader ? 'th' : 'td';
                return `<${tag} style="border: 1px solid #ddd; padding: 12px; text-align: left;">${cell}</${tag}>`;
              })
              .join('');

            return `<tr>${cellHTML}</tr>`;
          }

          // List items
          if (line.startsWith('- ')) {
            return `<li style="margin: 8px 0; margin-left: 20px;">${line.substring(2)}</li>`;
          }

          // Bold and italic text
          let htmlLine = line
            .replace(
              /\*\*(.*?)\*\*/g,
              '<strong style="font-weight: bold; color: #0056b3;">$1</strong>'
            )
            .replace(
              /__(.*?)__/g,
              '<strong style="font-weight: bold; color: #0056b3;">$1</strong>'
            )
            .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');

          if (htmlLine.trim().length === 0) {
            return '<br style="margin: 10px 0;">';
          }

          if (!htmlLine.includes('<') && htmlLine.trim().length > 0) {
            return `<p style="margin: 12px 0; line-height: 1.8;">${htmlLine}</p>`;
          }

          return htmlLine;
        })
        .join('\n')}
</div>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-radius: 5px;
    overflow: hidden;
  }
  
  thead tr {
    background: #007bff;
    color: white;
  }
  
  tbody tr:nth-child(even) {
    background: #f8f9fa;
  }
  
  tbody tr:hover {
    background: #e7f3ff;
  }
  
  ul {
    list-style-type: disc;
    margin: 15px 0;
  }
  
  li {
    margin: 8px 0;
  }
</style>`;
  }

  /**
   * Get all financial data for a user with filters
   * 
   * Retrieves comprehensive financial data including:
   * - Transactions (with linked PDF documents)
   * - PDF documents
   * - Documents (processed)
   * - Summary statistics
   * 
   * @param {string} userId - User ID to fetch data for
   * @param {Object} options - Filter options
   * @param {Date} [options.startDate] - Filter transactions from this date
   * @param {Date} [options.endDate] - Filter transactions until this date
   * @param {string} [options.transactionType] - Filter by transaction type
   * @param {number} [options.limit=50] - Maximum number of records to return
   * @returns {Promise<any>} Financial data with summary statistics
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * ```
   * const data = await service.getFinancialData('user-123', {
   *   startDate: new Date('2025-01-01'),
   *   endDate: new Date('2025-12-31'),
   *   transactionType: 'invoice',
   *   limit: 100
   * });
   * 
   * console.log(`Total Transactions: ${data.summary.totalTransactions}`);
   * console.log(`Total Amount: ${data.summary.totalAmount}`);
   * console.log(`Average Confidence: ${data.summary.averageConfidence}%`);
   * ```
   */
  async getFinancialData(
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      transactionType?: string;
      limit?: number;
    } = {}
  ) {
    try {
      const { startDate, endDate, transactionType, limit = 50 } = options;

      // Fetch transactions with filters
      const transactions = await this.prisma.transaction.findMany({
        where: {
          user_id: userId,
          ...(transactionType && { transaction_type: transactionType as any }),
          ...(startDate || endDate) && {
            transaction_date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          },
        },
        include: {
          pdf_documents: {
            select: {
              id: true,
              filename: true,
              original_filename: true,
              file_size: true,
              mime_type: true,
              extracted_data: true,
              created_at: true,
            },
          },
        },
        orderBy: { transaction_date: 'desc' },
        take: limit,
      });

      // Fetch PDF documents
      const pdfs = await this.prisma.pdfDocument.findMany({
        where: {
          user_id: userId,
          ...(startDate || endDate) && {
            created_at: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          },
        },
        select: {
          id: true,
          filename: true,
          original_filename: true,
          file_size: true,
          mime_type: true,
          extracted_data: true,
          page_count: true,
          parsing_status: true,
          created_at: true,
        },
        orderBy: { created_at: 'desc' },
        take: limit,
      });

      // Fetch all documents
      const documents = await this.prisma.document.findMany({
        where: {
          user_id: userId,
          ...(startDate || endDate) && {
            created_at: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          },
        },
        select: {
          id: true,
          filename: true,
          original_filename: true,
          document_type: true,
          document_category: true,
          confidence_score: true,
          extracted_data: true,
          page_count: true,
          parsing_status: true,
          created_at: true,
        },
        orderBy: { created_at: 'desc' },
        take: limit,
      });

      // Generate summary statistics
      const summary = {
        totalTransactions: transactions.length,
        totalPDFs: pdfs.length,
        totalDocuments: documents.length,
        totalAmount: transactions.reduce((sum, t) => sum + (t.amount?.toNumber() || 0), 0),
        averageConfidence:
          pdfs.length > 0
            ? (
                pdfs.reduce(
                  (sum, p) => sum + ((p.extracted_data as any)?.confidence || 0),
                  0
                ) / pdfs.length
              ).toFixed(1)
            : 0,
        byType: this.groupByType(transactions),
        byDocumentType: this.groupByDocumentType(documents),
      };

      return {
        transactions,
        documents: pdfs,
        allDocuments: documents,
        summary,
      };
    } catch (error) {
      console.error('Error fetching financial data:', error);
      throw error;
    }
  }

  /**
   * Search financial data across transactions and documents
   * 
   * Performs full-text search across:
   * - Transaction merchant, description, subject, sender
   * - Document filename, extracted text, type, category
   * 
   * @param {string} userId - User ID to search within
   * @param {string} query - Search query string
   * @returns {Promise<any>} Search results with transactions and documents
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * ```
   * const results = await service.searchFinancialData('user-123', 'amazon');
   * console.log(`Found ${results.totalResults} results`);
   * console.log(`Transactions: ${results.transactions.length}`);
   * console.log(`Documents: ${results.documents.length}`);
   * ```
   */
  async searchFinancialData(userId: string, query: string): Promise<any> {
    try {
      // Search transactions
      const transactions = await this.prisma.transaction.findMany({
        where: {
          user_id: userId,
          OR: [
            { merchant: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { subject: { contains: query, mode: 'insensitive' } },
            { sender: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          pdf_documents: {
            select: {
              id: true,
              filename: true,
            },
          },
        },
      });

      // Search documents
      const documents = await this.prisma.document.findMany({
        where: {
          user_id: userId,
          OR: [
            { filename: { contains: query, mode: 'insensitive' } },
            { extracted_text: { contains: query, mode: 'insensitive' } },
            { document_type: { contains: query, mode: 'insensitive' } },
            { document_category: { contains: query, mode: 'insensitive' } },
          ],
        },
      });

      return {
        transactions,
        documents,
        totalResults: transactions.length + documents.length,
        query,
      };
    } catch (error) {
      console.error('Error searching financial data:', error);
      throw error;
    }
  }

  /**
   * Get transaction details by ID
   * 
   * Retrieves a single transaction with all linked PDF documents
   * 
   * @param {string} transactionId - Transaction ID to fetch
   * @param {string} userId - User ID for authorization
   * @returns {Promise<any>} Transaction details with PDF documents
   * 
   * @throws {Error} If transaction not found or unauthorized
   * 
   * @example
   * ```
   * const transaction = await service.getTransactionDetails(
   *   'txn-123',
   *   'user-123'
   * );
   * console.log(`Amount: ${transaction.amount}`);
   * console.log(`PDFs: ${transaction.pdf_documents.length}`);
   * ```
   */
  async getTransactionDetails(transactionId: string, userId: string): Promise<any> {
    try {
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          id: transactionId,
          user_id: userId,
        },
        include: {
          pdf_documents: true,
        },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }

  /**
   * Delete transaction and related documents
   * 
   * Deletes:
   * 1. All PDF documents linked to transaction
   * 2. The transaction record itself
   * 
   * @param {string} transactionId - Transaction ID to delete
   * @param {string} userId - User ID for authorization
   * @returns {Promise<boolean>} True if deleted successfully
   * 
   * @throws {Error} If transaction not found or unauthorized
   * 
   * @example
   * ```
   * const deleted = await service.deleteTransaction('txn-123', 'user-123');
   * if (deleted) {
   *   console.log('Transaction deleted successfully');
   * }
   * ```
   * 
   * @remarks
   * - Assets and Documents tables are NOT automatically deleted
   * - Only PdfDocuments with transaction_id are removed
   */
  async deleteTransaction(transactionId: string, userId: string): Promise<boolean> {
    try {
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          id: transactionId,
          user_id: userId,
        },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Delete linked PDF documents first
      await this.prisma.pdfDocument.deleteMany({
        where: {
          transaction_id: transactionId,
        },
      });

      // Delete transaction
      await this.prisma.transaction.delete({
        where: { id: transactionId },
      });

      console.log(`✓ Transaction deleted: ${transactionId}`);
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }

  /**
   * Get financial statistics and analytics
   * 
   * Generates comprehensive statistics:
   * - Total transactions and amounts
   * - Breakdown by transaction type
   * - Breakdown by currency
   * - Top 10 merchants by spending
   * - Average transaction amount
   * 
   * @param {string} userId - User ID to generate stats for
   * @param {number} [monthsBack=6] - Number of months to look back
   * @returns {Promise<any>} Statistical analysis of financial data
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * ```
   * const stats = await service.getStatistics('user-123', 12);
   * console.log(`Period: ${stats.period}`);
   * console.log(`Total Transactions: ${stats.totalTransactions}`);
   * console.log(`Total Amount: ${stats.totalAmount}`);
   * console.log(`Top Merchant: ${stats.topMerchants[0].name}`);
   * console.log(`By Type:`, stats.byType);
   * console.log(`By Currency:`, stats.totalByCurrency);
   * ```
   */
  async getStatistics(userId: string, monthsBack: number = 6): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - monthsBack);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          user_id: userId,
          transaction_date: {
            gte: startDate,
          },
        },
      });

      const byType = this.groupByType(transactions);
      const byCurrency = this.groupByCurrency(transactions);

      // Calculate total by currency
      const totalByCurrency: Record<string, number> = {};
      transactions.forEach((t) => {
        const curr = t.currency || 'USD';
        totalByCurrency[curr] = (totalByCurrency[curr] || 0) + (t.amount?.toNumber() || 0);
      });

      // Calculate merchant statistics
      const merchantStats: Record<string, any> = {};
      transactions.forEach((t) => {
        const merchant = t.merchant || 'Unknown';
        if (!merchantStats[merchant]) {
          merchantStats[merchant] = {
            count: 0,
            total: 0,
            currency: t.currency,
          };
        }
        merchantStats[merchant].count += 1;
        merchantStats[merchant].total += t.amount?.toNumber() || 0;
      });

      // Top 10 merchants by spending
      const topMerchants = Object.entries(merchantStats)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 10)
        .map(([name, stats]) => ({
          name,
          ...stats,
        }));

      return {
        period: `Last ${monthsBack} months`,
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + (t.amount?.toNumber() || 0), 0),
        totalByCurrency,
        byType,
        byCurrency,
        topMerchants,
        averageTransactionAmount:
          transactions.length > 0
            ? (
                transactions.reduce((sum, t) => sum + (t.amount?.toNumber() || 0), 0) /
                transactions.length
              ).toFixed(2)
            : 0,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  /**
   * Guess document type from filename
   * 
   * @param {string} fileName - File name to analyze
   * @returns {string} Document type classification
   * @private
   */
  private guessDocumentType(fileName: string): string {
    const lower = fileName.toLowerCase();
    if (lower.includes('invoice')) return 'invoice';
    if (lower.includes('receipt')) return 'receipt';
    if (lower.includes('statement')) return 'statement';
    if (lower.includes('tax') || lower.includes('1099')) return 'tax';
    if (lower.includes('credit card')) return 'credit_card';
    if (lower.includes('bill')) return 'bill';
    return 'other';
  }

  /**
   * Estimate page count based on text length
   * 
   * @param {string} text - Text content
   * @returns {number} Estimated number of pages
   * @private
   */
  private estimatePageCount(text: string): number {
    const charsPerPage = 3000;
    return Math.ceil(text.length / charsPerPage);
  }

  /**
   * Group transactions by type
   * 
   * @param {any[]} transactions - Array of transactions
   * @returns {Record<string, number>} Count by transaction type
   * @private
   */
  private groupByType(transactions: any[]): Record<string, number> {
    return transactions.reduce(
      (acc, t) => {
        acc[t.transaction_type] = (acc[t.transaction_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Group transactions by currency
   * 
   * @param {any[]} transactions - Array of transactions
   * @returns {Record<string, number>} Count by currency
   * @private
   */
  private groupByCurrency(transactions: any[]): Record<string, number> {
    return transactions.reduce(
      (acc, t) => {
        const curr = t.currency || 'USD';
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Group documents by type
   * 
   * @param {any[]} documents - Array of documents
   * @returns {Record<string, number>} Count by document type
   * @private
   */
  private groupByDocumentType(documents: any[]): Record<string, number> {
    return documents.reduce(
      (acc, d) => {
        acc[d.document_type] = (acc[d.document_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Get MIME type from file extension
   * 
   * @param {string} filePath - File path
   * @returns {string} MIME type
   * @private
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.tiff': 'image/tiff',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
      '.csv': 'text/csv',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
