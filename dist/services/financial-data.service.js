import { Prisma } from '@prisma/client';
import * as path from 'path';
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
export class FinancialDataService {
    prisma;
    aiService;
    /**
     * Initialize FinancialDataService with required dependencies
     *
     * @param {PrismaClient} prisma - Prisma ORM client for database operations
     * @param {AIService} aiService - AI service for content analysis and classification
     */
    constructor(prisma, aiService) {
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
    getAssetsByUserId = async (userId) => {
        const data = await this.prisma.asset.findMany({
            where: { user_id: userId },
            select: {
                // ✅ Core Identity
                id: true,
                user_id: true,
                name: true,
                // ✅ Classification
                type: true,
                sub_type: true,
                // ✅ Bank/Financial Account Details
                account_number: true,
                ifsc_code: true,
                branch_name: true,
                bank_name: true,
                // ✅ Financial Values
                balance: true,
                total_value: true,
                // ✅ Status & Tracking
                status: true,
                last_updated: true,
                // ✅ Address & Location
                address: true,
                // ✅ Nominee/Beneficiary Details
                nominee: true,
                // ✅ Insurance/Investment Specific Fields
                policy_number: true,
                fund_name: true,
                folio_number: true,
                required_fields: true,
                crn_number: true,
                // ✅ References
                transaction_id: true,
                email_id: true,
                // ✅ Issues
                issues: true,
                // ✅ Timestamps
                created_at: true,
                updated_at: true,
                // ❌ EXCLUDED - Document/Attachment Fields
                document_type: false,
                document_metadata: false,
                file_name: false,
                file_size: false,
                mime_type: false,
                file_content: false,
            },
        });
        return data;
    };
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
    getAssetById = async (assetId, userId) => {
        const asset = await this.prisma.asset.findFirst({
            where: { id: assetId, user_id: userId },
            select: {
                // ✅ Core Identity
                id: true,
                user_id: true,
                name: true,
                // ✅ Classification
                type: true,
                sub_type: true,
                // ✅ Bank/Financial Account Details
                account_number: true,
                ifsc_code: true,
                branch_name: true,
                bank_name: true,
                // ✅ Financial Values
                balance: true,
                total_value: true,
                // ✅ Status & Tracking
                status: true,
                last_updated: true,
                // ✅ Address & Location
                address: true,
                // ✅ Nominee/Beneficiary Details
                nominee: true,
                // ✅ Insurance/Investment Specific Fields
                policy_number: true,
                fund_name: true,
                folio_number: true,
                // ✅ References
                transaction_id: true,
                email_id: true,
                // ✅ Issues
                issues: true,
                crn_number: true,
                required_fields: true,
                // ✅ Timestamps
                created_at: true,
                updated_at: true,
                // ❌ EXCLUDED - Document/Attachment Fields
                document_type: false,
                document_metadata: false,
                file_name: false,
                file_size: false,
                mime_type: false,
                file_content: false,
            },
        });
        return asset;
    };
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
    approveAsset = async (assetId, userId, status) => {
        const Status = await this.prisma.asset.updateMany({
            where: { id: assetId, user_id: userId },
            data: { status: status || "needs_attention" },
        });
        const updatedAsset = await this.prisma.asset.findUnique({
            where: { id: assetId },
            select: {
                // ✅ Core Identity
                id: true,
                user_id: true,
                name: true,
                // ✅ Classification
                type: true,
                sub_type: true,
                // ✅ Bank/Financial Account Details
                account_number: true,
                ifsc_code: true,
                branch_name: true,
                bank_name: true,
                // ✅ Financial Values
                balance: true,
                total_value: true,
                // ✅ Status & Tracking
                status: true,
                last_updated: true,
                // ✅ Address & Location
                address: true,
                // ✅ Nominee/Beneficiary Details
                nominee: true,
                // ✅ Insurance/Investment Specific Fields
                policy_number: true,
                fund_name: true,
                folio_number: true,
                // ✅ References
                transaction_id: true,
                email_id: true,
                // ✅ Issues
                issues: true,
                // ✅ Timestamps
                created_at: true,
                updated_at: true,
                crn_number: true,
                // ❌ EXCLUDED - Document/Attachment Fields
                document_type: false,
                document_metadata: false,
                file_name: false,
                file_size: false,
                mime_type: false,
                file_content: false,
            },
        });
        return {
            updatedData: updatedAsset,
            status: Status,
        };
    };
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
    updateAsset = async (assetId, userId, updates) => {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
        });
        if (!asset || asset.user_id !== userId) {
            throw new Error('Asset not found or unauthorized');
        }
        // 🧩 Define allowed fields for update (EXCLUDING document fields)
        const allowedFields = [
            "name",
            "type",
            "sub_type",
            "account_number",
            "ifsc_code",
            "branch_name",
            "bank_name",
            "balance",
            "total_value",
            "status",
            "address",
            "nominee",
            "policy_number",
            "fund_name",
            "folio_number",
            "crn_number",
            "issues",
            // ❌ EXCLUDED: document_type, document_metadata, file_name, file_size, mime_type, file_content
        ];
        // ✅ Filter out unwanted fields
        const safeUpdates = {};
        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                safeUpdates[key] = updates[key];
            }
        }
        // 🛠 Update only allowed fields and return without document fields
        const updatedAsset = await this.prisma.asset.update({
            where: { id: assetId },
            data: safeUpdates,
            select: {
                // ✅ Core Identity
                id: true,
                user_id: true,
                name: true,
                // ✅ Classification
                type: true,
                sub_type: true,
                // ✅ Bank/Financial Account Details
                account_number: true,
                ifsc_code: true,
                branch_name: true,
                bank_name: true,
                // ✅ Financial Values
                balance: true,
                total_value: true,
                // ✅ Status & Tracking
                status: true,
                last_updated: true,
                // ✅ Address & Location
                address: true,
                // ✅ Nominee/Beneficiary Details
                nominee: true,
                // ✅ Insurance/Investment Specific Fields
                policy_number: true,
                fund_name: true,
                folio_number: true,
                crn_number: true,
                // ✅ References
                transaction_id: true,
                email_id: true,
                // ✅ Issues
                issues: true,
                // ✅ Timestamps
                created_at: true,
                updated_at: true,
                // ❌ EXCLUDED - Document/Attachment Fields
                document_type: false,
                document_metadata: false,
                file_name: false,
                file_size: false,
                mime_type: false,
                file_content: false,
            },
        });
        return updatedAsset;
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
    async processFinancialEmail(userId, emailData) {
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
            }, userId);
            console.log('📊 Email Analysis:', emailAnalysis);
            if (emailAnalysis.extractedData.confidence < 40) {
                console.log(`⚠️ Low confidence: ${emailAnalysis.extractedData.confidence}%`);
            }
            let attachmentAnalyses = [];
            const pdfDocumentIds = [];
            const documentIds = [];
            const assetIds = [];
            // Process attachments
            if (emailData.attachmentContents && emailData.attachmentContents.length > 0) {
                for (const attachment of emailData.attachmentContents) {
                    const attachmentAnalysis = await this.aiService.analyzePDFDocument({
                        text: attachment.content,
                        documentType: this.guessDocumentType(attachment.filename),
                    });
                    const extracted = emailAnalysis.extractedData;
                    console.log('extracted data :: ', emailAnalysis.extractedData);
                    // console.log(`Extracted Data :: ${JSON.stringify(extracted)}`)
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
                            // Priority order for balance:
                            // 1. Current value (for assets/investments)
                            // 2. Outstanding balance (for liabilities like loans/credit cards)
                            // 3. Amount (general transaction amount)
                            // 4. Fallback to email analysis balance
                            // Example: For a mutual fund statement, currentValue might be 250000
                            // Example: For a credit card bill, outstandingBalance might be 15000
                            balance: extracted.financialMetadata?.currentValue
                                ? parseFloat(String(extracted.financialMetadata.currentValue))
                                : extracted.financialMetadata?.outstandingBalance
                                    ? parseFloat(String(extracted.financialMetadata.outstandingBalance))
                                    : extracted.amount
                                        ? parseFloat(String(extracted.amount))
                                        : emailAnalysis.extractedData.balance
                                            ? parseFloat(String(emailAnalysis.extractedData.balance))
                                            : null,
                            // Priority order for total value:
                            // 1. Total value (for investments/assets with purchase history)
                            // 2. Coverage amount (for insurance policies)
                            // 3. Fallback to email analysis total_value
                            // 4. Amount (general transaction amount)
                            // Example: For an insurance policy, coverageAmount might be 10000000 (1 Crore)
                            // Example: For a mutual fund, totalValue might be 250000 (current value)
                            total_value: extracted.financialMetadata?.totalValue
                                ? parseFloat(String(extracted.financialMetadata.totalValue))
                                : extracted.financialMetadata?.coverageAmount
                                    ? parseFloat(String(extracted.financialMetadata.coverageAmount))
                                    : emailAnalysis.extractedData.total_value
                                        ? parseFloat(String(emailAnalysis.extractedData.total_value))
                                        : extracted.amount
                                            ? parseFloat(String(extracted.amount))
                                            : null,
                            // 📊 Status
                            // status: extracted.status || 'active', // Deprecated
                            status: 'inactive',
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
                            issues: emailAnalysis.issues || [],
                            required_fields: emailAnalysis.required_fields || [],
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
            console.log('transaction_date :: ', emailAnalysis?.extractedData.date
                ? new Date(emailAnalysis.extractedData.date)
                : new Date());
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
                    transaction_date: (emailAnalysis.extractedData.date)
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
        }
        catch (error) {
            console.error('❌ Error:', error);
            return {
                processed: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
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
    async updateFinancialEmail(userId, assetId, emailData) {
        try {
            console.log(`⟳ Updating financial asset: ${assetId} from email: ${emailData.subject}`);
            // Check if asset exists
            const existingAsset = await this.prisma.asset.findUnique({
                where: { id: assetId },
            });
            if (!existingAsset) {
                throw new Error(`Asset with ID ${assetId} not found`);
            }
            if (existingAsset.user_id !== userId) {
                throw new Error('Unauthorized: Asset does not belong to this user');
            }
            // Classify email content
            const classification = await this.aiService.classifyEmailContent(emailData.body);
            if (!classification.isFinancial) {
                return {
                    updated: false,
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
            }, userId);
            console.log('📊 Email Analysis:', emailAnalysis);
            if (emailAnalysis.extractedData.confidence < 40) {
                console.log(`⚠️ Low confidence: ${emailAnalysis.extractedData.confidence}%`);
            }
            let attachmentAnalyses = [];
            const updatedAssetIds = [];
            console.log(JSON.stringify(emailData));
            // Process attachments
            if (emailData.attachmentContents && emailData.attachmentContents.length > 0) {
                for (const attachment of emailData.attachmentContents) {
                    console.log('attachment.content :: ', attachment.content);
                    const attachmentAnalysis = await this.aiService.analyzePDFDocument({
                        text: attachment.content,
                        documentType: this.guessDocumentType(attachment.filename),
                    });
                    const extracted = emailAnalysis.extractedData;
                    // console.log('attachmentAnalysis :: ', attachmentAnalysis)
                    // console.log('extracted data :: ', emailAnalysis.extractedData);
                    // console.log('extracted data :: ', JSON.stringify(emailAnalysis.extracted_content));
                    // Preserve previous metadata for audit trail
                    const previousMetadata = existingAsset.document_metadata;
                    const updateHistory = previousMetadata?.updateHistory || [];
                    updateHistory.push({
                        updatedAt: new Date().toISOString(),
                        previousBalance: existingAsset.balance?.toString(),
                        previousTotalValue: existingAsset.total_value?.toString(),
                        previousStatus: existingAsset.status,
                        emailId: emailData.emailId,
                        emailSubject: emailData.subject,
                    });
                    // Convert amounts to Decimal for Prisma
                    // Priority order for balance:
                    // 1. Current value (for assets/investments)
                    // 2. Outstanding balance (for liabilities like loans/credit cards)
                    // 3. Amount (general transaction amount)
                    // 4. Fallback to email analysis balance
                    // 5. Existing asset balance (preserve previous value if no new data)
                    const balanceValue = extracted.financialMetadata?.currentValue
                        ? new Prisma.Decimal(String(extracted.financialMetadata.currentValue))
                        : extracted.financialMetadata?.outstandingBalance
                            ? new Prisma.Decimal(String(extracted.financialMetadata.outstandingBalance))
                            : extracted.amount
                                ? new Prisma.Decimal(String(extracted.amount))
                                : emailAnalysis.extractedData.balance
                                    ? new Prisma.Decimal(String(emailAnalysis.extractedData.balance))
                                    : existingAsset.balance;
                    // Priority order for total value:
                    // 1. Total value (for investments/assets with purchase history)
                    // 2. Coverage amount (for insurance policies)
                    // 3. Fallback to email analysis total_value
                    // 4. Amount (general transaction amount)
                    // 5. Existing asset total_value (preserve previous value if no new data)
                    const totalValue = extracted.financialMetadata?.totalValue
                        ? new Prisma.Decimal(String(extracted.financialMetadata.totalValue))
                        : extracted.financialMetadata?.coverageAmount
                            ? new Prisma.Decimal(String(extracted.financialMetadata.coverageAmount))
                            : emailAnalysis.extractedData.total_value
                                ? new Prisma.Decimal(String(emailAnalysis.extractedData.total_value))
                                : extracted.amount
                                    ? new Prisma.Decimal(String(extracted.amount))
                                    : existingAsset.total_value;
                    // Update Asset with new data
                    const updatedAsset = await this.prisma.asset.update({
                        where: { id: assetId },
                        data: {
                            name: `${extracted.assetCategory?.toUpperCase()}: ${extracted.merchant || attachment.filename}`,
                            // 🎯 3-Category Classification
                            type: extracted.assetCategory || existingAsset.type,
                            sub_type: extracted.assetType || existingAsset.sub_type,
                            // 🏦 Bank Details (update only if new data available)
                            account_number: extracted.accountNumber || existingAsset.account_number,
                            ifsc_code: extracted.ifscCode || existingAsset.ifsc_code,
                            branch_name: extracted.branchName || existingAsset.branch_name,
                            bank_name: extracted.bankName || existingAsset.bank_name,
                            // 💰 Financial Values (Decimal type)
                            balance: balanceValue,
                            total_value: totalValue,
                            // 📊 Status
                            status: extracted.status || existingAsset.status,
                            last_updated: new Date(),
                            // 💳 Insurance/Investment Fields
                            policy_number: extracted.policyNumber || existingAsset.policy_number,
                            folio_number: extracted.folioNumber || existingAsset.folio_number,
                            fund_name: extracted.fundName || existingAsset.fund_name,
                            // CRN Number
                            crn_number: existingAsset.crn_number,
                            // Address
                            address: existingAsset.address,
                            // 📄 Document Fields
                            document_type: extracted.assetType || existingAsset.document_type,
                            file_name: attachment.filename,
                            file_size: attachment.size,
                            mime_type: attachment.mimeType,
                            file_content: attachment.content,
                            // 📋 Complete Metadata with history
                            document_metadata: {
                                category: extracted.assetCategory,
                                type: extracted.assetType,
                                subType: extracted.assetSubType,
                                status: extracted.status,
                                aiAnalysis: extracted,
                                attachmentAnalysis: attachmentAnalysis.extracted_content,
                                confidence: extracted.confidence,
                                financialMetadata: extracted.financialMetadata,
                                merchant: extracted.merchant,
                                description: extracted.description,
                                transactionDate: extracted.date,
                                currency: extracted.currency,
                                emailId: emailData.emailId,
                                emailSubject: emailData.subject,
                                emailSender: emailData.from,
                                extractedAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                keyPoints: emailAnalysis.keyPoints,
                                updateHistory,
                                previousMetadata: previousMetadata?.aiAnalysis || null,
                            },
                            email_id: emailData.emailId,
                            issues: emailAnalysis.issues || [],
                            required_fields: emailAnalysis.required_fields || [],
                        },
                    });
                    updatedAssetIds.push(updatedAsset.id);
                    console.log(`✅ Updated: ${extracted.assetCategory} > ${extracted.assetType} [${extracted.status}]`);
                    attachmentAnalyses.push({
                        assetId: updatedAsset.id,
                        fileName: attachment.filename,
                        category: extracted.assetCategory,
                        type: extracted.assetType,
                        status: extracted.status,
                        confidence: extracted.confidence,
                        analysis: attachmentAnalysis,
                        previousBalance: existingAsset.balance?.toString(),
                        newBalance: updatedAsset.balance?.toString(),
                    });
                }
            }
            // ============================================
            // FIXED: Safe Date Parsing Helper Function
            // ============================================
            const parseTransactionDate = (dateValue) => {
                // If no date provided, return current date
                if (!dateValue) {
                    return new Date();
                }
                // If it's already a Date object, check if valid
                if (dateValue instanceof Date) {
                    return isNaN(dateValue.getTime()) ? new Date() : dateValue;
                }
                // If it's a string, try to parse it
                if (typeof dateValue === 'string') {
                    const parsedDate = new Date(dateValue);
                    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                }
                // If it's an object (like your error case), try to use email date
                if (typeof dateValue === 'object' && dateValue !== null) {
                    // If object has emailContent/subject, it's malformed data
                    // Fall back to current date
                    return new Date();
                }
                // Default fallback
                return new Date();
            };
            // Create or update transaction
            let transaction;
            const amountDecimal = emailAnalysis.extractedData.amount
                ? new Prisma.Decimal(String(emailAnalysis.extractedData.amount))
                : null;
            // ============================================
            // FIXED: Safe Transaction Date Parsing
            // ============================================
            const transactionDate = emailAnalysis.extractedData.date ? new Date(emailAnalysis.extractedData.date) : new Date();
            console.log(`📅 Transaction date parsed: ${transactionDate.toISOString()}`);
            if (existingAsset.transaction_id) {
                // Update existing transaction
                transaction = await this.prisma.transaction.update({
                    where: { id: existingAsset.transaction_id },
                    data: {
                        subject: emailData.subject,
                        sender: emailData.from,
                        amount: amountDecimal,
                        currency: emailAnalysis.extractedData.currency || 'INR',
                        transaction_type: emailAnalysis.extractedData.transactionType || 'other',
                        merchant: emailAnalysis.extractedData.merchant || 'Unknown',
                        description: emailAnalysis.extractedData.description
                            ? emailAnalysis.extractedData.description.substring(0, 500)
                            : null,
                        transaction_date: (transactionDate), // ✅ Fixed: Now using safe parsed date
                        email_date: new Date(emailData.date),
                        status: 'processed',
                        raw_data: {
                            emailContent: emailData.body.substring(0, 500),
                            classification,
                            assetIds: updatedAssetIds,
                            updateType: 'email_update',
                        },
                        extracted_data: {
                            ...emailAnalysis.extractedData,
                            assetIds: updatedAssetIds,
                            attachmentSummary: attachmentAnalyses,
                            updateTimestamp: new Date().toISOString(),
                        },
                    },
                });
                // Link transaction to asset
                await this.prisma.asset.update({
                    where: { id: assetId },
                    data: { transaction_id: transaction.id },
                });
            }
            console.log(`✅ Transaction ${existingAsset.transaction_id ? 'Updated' : 'Created'}: ${transaction?.id}`);
            console.log(`📁 Assets updated: ${updatedAssetIds.length}`);
            return {
                updated: true,
                transactionId: transaction?.id,
                emailAnalysis: {
                    summary: emailAnalysis.summary,
                    keyPoints: emailAnalysis.keyPoints,
                    extractedData: emailAnalysis.extractedData,
                },
                attachmentAnalyses,
                assetIds: updatedAssetIds,
                changes: {
                    balanceChange: attachmentAnalyses[0]?.newBalance
                        ? new Prisma.Decimal(attachmentAnalyses[0].newBalance)
                            .sub(new Prisma.Decimal(attachmentAnalyses[0].previousBalance || 0))
                            .toString()
                        : '0',
                    statusChange: existingAsset.status !== emailAnalysis.extractedData.status,
                },
            };
        }
        catch (error) {
            console.error('❌ Error updating asset:', error);
            return {
                updated: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
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
    async getFinancialData(userId, options = {}) {
        try {
            const { startDate, endDate, transactionType, limit = 50 } = options;
            // Fetch transactions with filters
            const transactions = await this.prisma.transaction.findMany({
                where: {
                    user_id: userId,
                    ...(transactionType && { transaction_type: transactionType }),
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
                averageConfidence: pdfs.length > 0
                    ? (pdfs.reduce((sum, p) => sum + (p.extracted_data?.confidence || 0), 0) / pdfs.length).toFixed(1)
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
        }
        catch (error) {
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
    async searchFinancialData(userId, query) {
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
        }
        catch (error) {
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
    async getTransactionDetails(transactionId, userId) {
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
        }
        catch (error) {
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
    async deleteTransaction(transactionId, userId) {
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
        }
        catch (error) {
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
    async getStatistics(userId, monthsBack = 6) {
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
            const totalByCurrency = {};
            transactions.forEach((t) => {
                const curr = t.currency || 'USD';
                totalByCurrency[curr] = (totalByCurrency[curr] || 0) + (t.amount?.toNumber() || 0);
            });
            // Calculate merchant statistics
            const merchantStats = {};
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
                averageTransactionAmount: transactions.length > 0
                    ? (transactions.reduce((sum, t) => sum + (t.amount?.toNumber() || 0), 0) /
                        transactions.length).toFixed(2)
                    : 0,
            };
        }
        catch (error) {
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
    guessDocumentType(fileName) {
        const lower = fileName.toLowerCase();
        if (lower.includes('invoice'))
            return 'invoice';
        if (lower.includes('receipt'))
            return 'receipt';
        if (lower.includes('statement'))
            return 'statement';
        if (lower.includes('tax') || lower.includes('1099'))
            return 'tax';
        if (lower.includes('credit card'))
            return 'credit_card';
        if (lower.includes('bill'))
            return 'bill';
        return 'other';
    }
    /**
     * Estimate page count based on text length
     *
     * @param {string} text - Text content
     * @returns {number} Estimated number of pages
     * @private
     */
    estimatePageCount(text) {
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
    groupByType(transactions) {
        return transactions.reduce((acc, t) => {
            acc[t.transaction_type] = (acc[t.transaction_type] || 0) + 1;
            return acc;
        }, {});
    }
    /**
     * Group transactions by currency
     *
     * @param {any[]} transactions - Array of transactions
     * @returns {Record<string, number>} Count by currency
     * @private
     */
    groupByCurrency(transactions) {
        return transactions.reduce((acc, t) => {
            const curr = t.currency || 'USD';
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
    }
    /**
     * Group documents by type
     *
     * @param {any[]} documents - Array of documents
     * @returns {Record<string, number>} Count by document type
     * @private
     */
    groupByDocumentType(documents) {
        return documents.reduce((acc, d) => {
            acc[d.document_type] = (acc[d.document_type] || 0) + 1;
            return acc;
        }, {});
    }
    /**
     * Get MIME type from file extension
     *
     * @param {string} filePath - File path
     * @returns {string} MIME type
     * @private
     */
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
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
//# sourceMappingURL=financial-data.service.js.map