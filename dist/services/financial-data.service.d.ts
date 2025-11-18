import { Asset, Prisma, PrismaClient } from '@prisma/client';
import { AIService } from './ai.service.js';
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
    content: string;
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
 *
 * @note Fixed issue with balance and total_value extraction (Nov 2025):
 * Previously, balance and total_value fields were often null in the database even when
 * the AI analysis extracted these values. This was due to incorrect priority ordering
 * when extracting financial values from the AI analysis results. The fix ensures:
 * - Balance prioritizes currentValue > outstandingBalance > amount
 * - Total value prioritizes totalValue > coverageAmount > amount
 * This ensures proper financial data storage for all asset types including:
 * - Investments (mutual funds, stocks) with current values
 * - Liabilities (loans, credit cards) with outstanding balances
 * - Insurance policies with coverage amounts
 */
export declare class FinancialDataService {
    private prisma;
    private aiService;
    /**
     * Initialize FinancialDataService with required dependencies
     *
     * @param {PrismaClient} prisma - Prisma ORM client for database operations
     * @param {AIService} aiService - AI service for content analysis and classification
     */
    constructor(prisma: PrismaClient, aiService: AIService);
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
    getAssetsByUserId: (userId: string) => Promise<Partial<Asset[]>>;
    /**
   * Get specific asset by ID for a user (excludes document-related fields)
   * @param {string} assetId - Asset ID to fetch
   * @param {string} userId - User ID who owns the asset
   * @return {Promise<Partial<Asset> | null>} Asset record without document fields or null if not found
   * @example
   * ```
   * const asset = await service.getAssetById('asset-456', 'user-123');
   * if (asset) {
   *   console.log(`Asset Name: ${asset.name}`);
   *   // document_type, document_metadata, file_name, file_size, mime_type, file_content are excluded
   * } else {
   *   console.log('Asset not found');
   * }
   * ```
   */
    getAssetById: (assetId: string, userId: string) => Promise<Partial<Asset> | null>;
    /**
    * Approve an asset by updating its status (returns asset without document fields)
    * @param {string} assetId - Asset ID to approve
    * @param {string} userId - User ID who owns the asset
    * @param {string} status - New status to set (e.g., 'active', 'approved')
    * @return {Promise<{
    *   updatedData: Partial<Asset>;
    *   status: any;
    * }>} Updated asset record without document fields
    * @example
    * ```
    * const result = await service.approveAsset('asset-456', 'user-123', 'active');
    * console.log(`Asset ${result.updatedData.id} approved`);
    * // Document fields are excluded from response
    * ```
    */
    approveAsset: (assetId: string, userId: string, status: string) => Promise<{
        updatedData: Partial<Asset>;
        status: any;
    }>;
    /**
     * Edit the details of an existing asset (excludes document-related fields from updates)
     * @param {string} assetId - ID of the asset to edit
     * @param {string} userId - ID of the user who owns the asset
     * @param {Partial<Asset>} updates - Object containing fields to update
     * @return {Promise<Partial<Asset>>} - The updated asset record (without document fields)
     * @example
     * ```
     * const updatedAsset = await service.updateAsset('asset-456', 'user-123', {
     *   name: 'Updated Asset Name',
     *   balance: 15000.00,
     * });
     * console.log(`Asset ${updatedAsset.id} updated`);
     * // document_type, file_name, etc. are not returned
     * ```
     * @throws {Error} If the asset is not found or the user is unauthorized
     */
    updateAsset: (assetId: string, userId: string, updates: Partial<any>) => Promise<Partial<Asset>>;
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
    processFinancialEmail(userId: string, emailData: EmailData): Promise<any>;
    /**
   * Updates an existing financial asset record with new data from email
   *
   * @param {string} userId - The ID of the user who owns the asset
   * @param {string} assetId - The ID of the asset to update
   * @param {EmailData} emailData - Email data containing updated financial information
   * @returns {Promise<any>} Processing result with updated asset information
   *
   * @description
   * This method updates an existing financial asset record based on new email data.
   * It follows the same processing flow as creation but updates existing records.
   *
   * Features:
   * - Updates existing asset records with new financial data
   * - Preserves historical data in metadata
   * - Updates transaction relationships
   * - Handles attachment analysis for updated documents
   * - Maintains audit trail of changes
   *
   * @example
   * ```
   * const result = await updateFinancialEmail(
   *   'user-123',
   *   'asset-456',
   *   {
   *     subject: 'Updated Bank Statement',
   *     body: 'Your updated account balance...',
   *     from: 'bank@example.com',
   *     attachmentContents: [...]
   *   }
   * );
   * ```
   */
    /**
     * Updates an existing financial asset record with new data from email
     *
     * @param {string} userId - The UUID of the user who owns the asset
     * @param {string} assetId - The UUID of the asset to update
     * @param {EmailData} emailData - Email data containing updated financial information
     * @returns {Promise<any>} Processing result with updated asset information
     *
     * @description
     * Updates existing asset records with new financial data from emails.
     * Handles Decimal types for financial values and maintains proper relationships.
     *
     * @example
     * ```
     * const result = await updateFinancialEmail(
     *   'user-uuid-123',
     *   'asset-uuid-456',
     *   emailData
     * );
     * ```
     */
    updateFinancialEmail(userId: string, assetId: string, emailData: EmailData): Promise<any>;
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
    getFinancialData(userId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        transactionType?: string;
        limit?: number;
    }): Promise<{
        transactions: ({
            pdf_documents: {
                id: string;
                created_at: Date;
                filename: string;
                file_size: bigint;
                mime_type: string;
                extracted_data: Prisma.JsonValue;
                original_filename: string;
            }[];
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            status: import(".prisma/client").$Enums.TransactionStatus;
            user_id: string;
            description: string | null;
            currency: string | null;
            email_id: string;
            merchant: string | null;
            amount: Prisma.Decimal | null;
            subject: string | null;
            sender: string;
            recipient: string;
            transaction_type: import(".prisma/client").$Enums.TransactionType;
            transaction_date: Date | null;
            email_date: Date;
            raw_data: Prisma.JsonValue | null;
            extracted_data: Prisma.JsonValue | null;
        })[];
        documents: {
            id: string;
            created_at: Date;
            filename: string;
            file_size: bigint;
            mime_type: string;
            extracted_data: Prisma.JsonValue;
            original_filename: string;
            parsing_status: import(".prisma/client").$Enums.ParsingStatus;
            page_count: number | null;
        }[];
        allDocuments: {
            id: string;
            created_at: Date;
            filename: string;
            document_type: string | null;
            extracted_data: Prisma.JsonValue;
            original_filename: string;
            parsing_status: import(".prisma/client").$Enums.ParsingStatus;
            page_count: number | null;
            document_category: string | null;
            confidence_score: number | null;
        }[];
        summary: {
            totalTransactions: number;
            totalPDFs: number;
            totalDocuments: number;
            totalAmount: number;
            averageConfidence: string | number;
            byType: Record<string, number>;
            byDocumentType: Record<string, number>;
        };
    }>;
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
    searchFinancialData(userId: string, query: string): Promise<any>;
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
    getTransactionDetails(transactionId: string, userId: string): Promise<any>;
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
    deleteTransaction(transactionId: string, userId: string): Promise<boolean>;
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
    getStatistics(userId: string, monthsBack?: number): Promise<any>;
    /**
     * Guess document type from filename
     *
     * @param {string} fileName - File name to analyze
     * @returns {string} Document type classification
     * @private
     */
    private guessDocumentType;
    /**
     * Estimate page count based on text length
     *
     * @param {string} text - Text content
     * @returns {number} Estimated number of pages
     * @private
     */
    private estimatePageCount;
    /**
     * Group transactions by type
     *
     * @param {any[]} transactions - Array of transactions
     * @returns {Record<string, number>} Count by transaction type
     * @private
     */
    private groupByType;
    /**
     * Group transactions by currency
     *
     * @param {any[]} transactions - Array of transactions
     * @returns {Record<string, number>} Count by currency
     * @private
     */
    private groupByCurrency;
    /**
     * Group documents by type
     *
     * @param {any[]} documents - Array of documents
     * @returns {Record<string, number>} Count by document type
     * @private
     */
    private groupByDocumentType;
    /**
     * Get MIME type from file extension
     *
     * @param {string} filePath - File path
     * @returns {string} MIME type
     * @private
     */
    private getMimeType;
}
//# sourceMappingURL=financial-data.service.d.ts.map