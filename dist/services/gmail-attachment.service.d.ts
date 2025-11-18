import { gmail_v1 } from 'googleapis';
/**
 * Interface representing an attachment from Gmail
 * Contains metadata and the actual binary data
 */
interface Attachment {
    id: string;
    filename: string;
    mimeType: string;
    data: Buffer;
    size: number;
}
/**
 * GmailAttachmentService
 *
 * Comprehensive service for processing Gmail attachments with advanced content extraction.
 * Handles downloading, analyzing, and extracting data from multiple file types including
 * PDFs, images, spreadsheets, and documents.
 *
 * @class GmailAttachmentService
 * @description
 * This service provides the complete workflow for:
 * 1. Extracting attachment metadata from Gmail messages
 * 2. Streaming downloads from Gmail API
 * 3. Multi-format content extraction (PDF, CSV, Excel, DOCX, Images)
 * 4. Python integration for advanced OCR and PDF parsing
 * 5. Password-protected PDF detection and handling
 * 6. Content quality assessment
 * 7. Financial document classification
 *
 * File Formats Supported:
 * - PDF (including password-protected)
 * - Images (JPG, PNG, GIF, TIFF) with OCR capabilities
 * - CSV with table formatting
 * - Excel (XLSX, XLS) with data extraction
 * - DOCX with text extraction
 * - Plain text files
 *
 * Key Features:
 * - Fallback extraction methods (Python -> Buffer-based)
 * - Automatic password detection for PDFs
 * - Quality scoring for extracted content
 * - Financial document recognition
 * - Streaming for memory efficiency
 *
 * @example
 * ```
 * const service = new GmailAttachmentService('./uploads/attachments');
 * const attachments = await service.extractAttachmentMetadata(emailMessage);
 * const processed = await service.downloadAndProcessAttachments(
 *   gmail,
 *   emailId,
 *   attachments,
 *   userId,
 *   password
 * );
 * ```
 *
 * @remarks
 * - Requires Python 3 with required libraries for advanced extraction
 * - Falls back to built-in extraction if Python unavailable
 * - Temporary files are automatically cleaned up
 * - 30-second timeout for Python processes
 */
export declare class GmailAttachmentService {
    private uploadDir;
    private userId;
    /**
     * Initialize GmailAttachmentService
     *
     * Creates the upload directory if it doesn't exist
     *
     * @param {string} [uploadDir='./uploads/attachments'] - Directory to store uploaded files
     *
     * @example
     * ```
     * const service = new GmailAttachmentService('./uploads/attachments');
     * const service2 = new GmailAttachmentService(); // Uses default directory
     * ```
     */
    constructor(uploadDir?: string);
    /**
     * Extract attachment metadata from Gmail email message
     *
     * Parses the Gmail message payload to identify attachments.
     * Returns array of attachment objects with basic metadata.
     * Does NOT download the actual attachment data.
     *
     * @param {gmail_v1.Schema$Message} emailMessage - Gmail message object from API
     * @returns {Promise<Attachment[]>} Array of attachment metadata objects
     *
     * @example
     * ```
     * const message = await gmail.users.messages.get({
     *   userId: 'me',
     *   id: 'messageId'
     * });
     *
     * const attachments = await service.extractAttachmentMetadata(message.data);
     * console.log(`Found ${attachments.length} attachments`);
     * attachments.forEach(att => console.log(`- ${att.filename}`));
     * ```
     *
     * @remarks
     * - Only returns attachments (items with attachmentId and filename)
     * - MIME type defaults to 'application/octet-stream' if not specified
     * - Does not validate file types or download data
     * - Empty array returned if no attachments or error occurs
     */
    extractAttachmentMetadata(emailMessage: gmail_v1.Schema$Message): Promise<Attachment[]>;
    /**
     * Download attachment from Gmail via streaming
     *
     * Uses Gmail API to download attachment data and returns as Buffer.
     * Handles base64 decoding from Gmail API response.
     *
     * @param {gmail_v1.Gmail} gmail - Gmail API client instance
     * @param {string} emailId - Gmail message ID
     * @param {string} attachmentId - Gmail attachment ID
     * @param {string} filename - Filename for logging purposes
     * @returns {Promise<Buffer>} Binary buffer containing attachment data
     *
     * @throws {Error} If attachment data is not received or API fails
     *
     * @example
     * ```
     * const buffer = await service.downloadAttachmentStream(
     *   gmail,
     *   'msg-123',
     *   'att-456',
     *   'invoice.pdf'
     * );
     *
     * console.log(`Downloaded: ${buffer.length} bytes`);
     * ```
     *
     * @remarks
     * - Gmail API returns base64-encoded data, automatically decoded
     * - No file saved to disk during download
     * - Suitable for memory-efficient streaming
     */
    downloadAttachmentStream(gmail: gmail_v1.Gmail, emailId: string, attachmentId: string, filename: string): Promise<Buffer>;
    /**
     * Extract text content from PDF buffer
     *
     * Performs basic PDF text extraction from binary buffer:
     * 1. Decodes buffer as latin1 text
     * 2. Removes binary markers
     * 3. Extracts text objects between BT/ET operators
     * 4. Decodes hex-encoded strings
     * 5. Falls back to UTF-8 extraction if needed
     *
     * @param {Buffer} buffer - PDF file buffer
     * @returns {string} Extracted text content
     *
     * @private
     *
     * @example
     * ```
     * const pdfBuffer = fs.readFileSync('invoice.pdf');
     * const text = this.extractPDFFromBuffer(pdfBuffer);
     * console.log(text.substring(0, 100));
     * ```
     *
     * @remarks
     * - This is a fallback method; Python extraction is preferred
     * - Handles basic PDF structure but may not work with all PDFs
     * - Returns placeholder text if extraction fails
     * - Binary markers and PDF operators are removed during extraction
     */
    private extractPDFFromBuffer;
    /**
     * Extract table data from CSV buffer
     *
     * Parses CSV content and formats as markdown table:
     * 1. Splits into lines
     * 2. Uses first line as header
     * 3. Creates markdown table
     * 4. Includes up to 20 data rows
     * 5. Shows total row count if more than 20
     *
     * @param {Buffer} buffer - CSV file buffer
     * @returns {string} Markdown formatted table
     *
     * @private
     *
     * @example
     * ```
     * const csvBuffer = fs.readFileSync('data.csv');
     * const markdown = this.extractCSVFromBuffer(csvBuffer);
     * console.log(markdown);
     * // Output:
     * // | Name | Amount | Date |
     * // | ---- | ------ | ---- |
     * // | Item 1 | 100 | 2025-11-02 |
     * ```
     *
     * @remarks
     * - Returns markdown table format for easy display
     * - Limits display to 20 rows (+ 1 header)
     * - Uses parseCSVLine for proper quote handling
     * - Returns placeholder text if parsing fails
     */
    private extractCSVFromBuffer;
    /**
     * Parse a single CSV line respecting quoted fields
     *
     * Handles CSV parsing with proper quote handling:
     * - Splits by comma when not inside quotes
     * - Handles escaped quotes ("" = single ")
     * - Trims whitespace from values
     *
     * @param {string} line - CSV line to parse
     * @returns {string[]} Array of parsed values
     *
     * @private
     *
     * @example
     * ```
     * const line = 'Name,"Amount, USD",Date';
     * const parsed = this.parseCSVLine(line);
     * // Result: ['Name', 'Amount, USD', 'Date']
     * ```
     */
    private parseCSVLine;
    /**
     * Extract data from Excel buffer (XLSX/XLS)
     *
     * Performs basic Excel extraction:
     * 1. Converts buffer to UTF-8 text
     * 2. Splits by null bytes
     * 3. Filters and extracts readable strings
     * 4. Returns first 20 lines as markdown list
     *
     * @param {Buffer} buffer - Excel file buffer
     * @returns {string} Markdown list format of extracted data
     *
     * @private
     *
     * @example
     * ```
     * const excelBuffer = fs.readFileSync('data.xlsx');
     * const markdown = this.extractExcelFromBuffer(excelBuffer);
     * console.log(markdown);
     * ```
     *
     * @remarks
     * - Basic extraction method; Python extraction is more reliable
     * - Limited to extracting readable text strings
     * - Returns first 20 lines only
     * - Placeholder text if extraction fails
     */
    private extractExcelFromBuffer;
    /**
     * Extract text from DOCX buffer
     *
     * Extracts text from DOCX (which is ZIP with XML):
     * 1. Converts buffer to UTF-8
     * 2. Finds all <w:t> XML tags containing text
     * 3. Joins text with spaces
     * 4. Falls back to UTF-8 extraction if no tags found
     *
     * @param {Buffer} buffer - DOCX file buffer
     * @returns {string} Extracted text content
     *
     * @private
     *
     * @example
     * ```
     * const docxBuffer = fs.readFileSync('document.docx');
     * const text = this.extractDOCXFromBuffer(docxBuffer);
     * console.log(text);
     * ```
     *
     * @remarks
     * - DOCX is actually a ZIP file containing XML
     * - Extracts text from <w:t> tags
     * - Removes all XML markup
     * - Returns placeholder if extraction fails
     */
    private extractDOCXFromBuffer;
    /**
     * Extract/prepare image content for OCR
     *
     * Returns formatted metadata for image files.
     * Actual OCR processing is delegated to Python/Tesseract.js
     *
     * @param {Buffer} buffer - Image file buffer
     * @param {string} filename - Image filename
     * @returns {string} Formatted metadata with OCR notes
     *
     * @private
     *
     * @example
     * ```
     * const imageBuffer = fs.readFileSync('receipt.jpg');
     * const metadata = this.extractImageFromBuffer(imageBuffer, 'receipt.jpg');
     * console.log(metadata);
     * ```
     *
     * @remarks
     * - This method prepares image for OCR processing
     * - Actual text extraction happens via Python/Tesseract
     * - Returns descriptive text about capabilities
     * - File size is calculated in KB
     */
    private extractImageFromBuffer;
    /**
     * Extract metadata from processed file
     *
     * Collects comprehensive metadata about processed attachment:
     * - File size and mime type
     * - Content length and preview
     * - Extraction quality score
     * - Processing timestamp
     *
     * @param {Buffer} buffer - File buffer
     * @param {string} filename - Filename
     * @param {string} mimeType - MIME type
     * @param {string} content - Extracted content
     * @returns {Record<string, any>} Metadata object
     *
     * @private
     *
     * @example
     * ```
     * const metadata = this.extractMetadata(
     *   buffer,
     *   'invoice.pdf',
     *   'application/pdf',
     *   'extracted text content...'
     * );
     * ```
     */
    private extractMetadata;
    /**
     * Assess quality score of extracted content
     *
     * Calculates quality score (0-100) based on:
     * - Content length (0-35 points)
     * - Text density ratio (0-15 points)
     * - Financial data presence (0-10 points)
     * - Date presence (0-10 points)
     * - Base score (50 points)
     *
     * Returns both numeric score and status string.
     *
     * @param {string} content - Extracted content
     * @param {number} bufferSize - Original file size in bytes
     * @returns {Object} Quality assessment with score (0-100) and status
     * @returns {number} score - Quality score from 0 to 100
     * @returns {string} status - 'high' (>80), 'medium' (>60), or 'low'
     *
     * @private
     *
     * @example
     * ```
     * const quality = this.assessQuality('Extracted text...', 102400);
     * console.log(`Score: ${quality.score}, Status: ${quality.status}`);
     * // Output: Score: 75, Status: medium
     * ```
     *
     * @remarks
     * - Looks for financial keywords: $, USD, INR, EUR, amount, total
     * - Looks for date patterns: DD/MM/YYYY, DD-MM-YYYY, etc.
     * - Score capped at 100
     * - Used to determine extraction reliability
     */
    private assessQuality;
    /**
     * Classify if file is a financial document
     *
     * Checks both file extension and content keywords:
     * - Valid financial extensions: .pdf, .jpg, .jpeg, .png, .csv, .xlsx, .xls, .docx
     * - Financial keywords: invoice, receipt, statement, payment, transaction, bill, tax, report
     *
     * @param {string} filename - Filename to check
     * @param {string} mimeType - MIME type to check
     * @returns {boolean} True if classified as financial document
     *
     * @example
     * ```
     * const isFinancial = service.isFinancialDocument('invoice_2025.pdf', 'application/pdf');
     * console.log(isFinancial); // true
     *
     * const notFinancial = service.isFinancialDocument('photo.jpg', 'image/jpeg');
     * console.log(notFinancial); // false
     * ```
     *
     * @remarks
     * - Returns false if file extension not in whitelist
     * - Returns true if filename contains financial keywords OR
     *   MIME type indicates PDF, image, or CSV
     * - Case-insensitive matching
     */
    isFinancialDocument(filename: string, mimeType: string): boolean;
    /**
     * Check if PDF file is password protected
     *
     * Spawns Python process to check PDF protection status.
     * Returns boolean indicating if PDF is protected.
     *
     * @param {string} tmpFile - Path to temporary PDF file
     * @returns {Promise<boolean>} True if PDF is password protected
     *
     * @private
     *
     * @example
     * ```
     * const isProtected = await this.checkPdfProtection('/tmp/file.pdf');
     * if (isProtected) {
     *   console.log('PDF is password protected');
     * }
     * ```
     *
     * @remarks
     * - Spawns Python3 process with extractor.py script
     * - Returns false if Python check fails (fail-safe)
     * - Python output must be exactly 'protected' or 'not protected'
     * - Suitable for pre-processing before password attempt
     */
    private checkPdfProtection;
    /**
     * Call Python extractor service for advanced file processing
     *
     * Spawns Python subprocess to extract content with fallback handling:
     * 1. Saves buffer to temporary file
     * 2. Spawns Python3 process with extractor.py
     * 3. Handles password for protected PDFs
     * 4. Returns JSON result or raw text
     * 5. Auto-cleanup of temporary files
     *
     * Process Flow:
     * - Check if PDF is protected
     * - Get generated passwords from password service
     * - Spawn Python with appropriate arguments
     * - Parse JSON result or return raw stdout
     * - Handle timeout (30s) and errors gracefully
     *
     * @param {Buffer} buffer - File buffer to process
     * @param {string} filename - Original filename
     * @param {string} [password] - Optional password for protected files
     * @returns {Promise<{success: boolean, text: string, metadata: Record<string, any>}>}
     *          Result with success flag, extracted text, and metadata
     *
     * @private
     *
     * @example
     * ```
     * const result = await this.callPythonExtractor(
     *   pdfBuffer,
     *   'statement.pdf',
     *   'password123'
     * );
     *
     * if (result.success) {
     *   console.log(`Extracted: ${result.text.length} characters`);
     *   console.log(`Quality: ${result.metadata.quality}`);
     * } else {
     *   console.log(`Error: ${result.metadata.error}`);
     * }
     * ```
     *
     * @remarks
     * - 30-second timeout for Python process
     * - Temporary files automatically cleaned up
     * - Falls back to empty result if process fails
     * - Checks PDF protection and generates passwords automatically
     * - Returns both structured JSON and raw text results
     * - Quality scoring included in metadata
     */
    private callPythonExtractor;
    /**
     * Extract content from file buffer with intelligent fallback
     *
     * Main content extraction method with format-specific handling:
     *
     * For PDFs:
     * 1. Tries Python extraction first
     * 2. Falls back to buffer-based extraction
     * 3. Returns extracted text
     *
     * For Images:
     * 1. Tries Python OCR first
     * 2. Falls back to placeholder
     *
     * For Other Formats:
     * 1. CSV: Creates markdown table
     * 2. Excel: Extracts readable strings
     * 3. DOCX: Extracts XML text
     * 4. Text: Returns raw content
     *
     * @param {Buffer} buffer - File buffer to process
     * @param {string} mimeType - MIME type of file
     * @param {string} filename - Original filename
     * @param {string} [password] - Optional password for protected files
     * @returns {Promise<string>} Extracted text content
     *
     * @throws {Error} If buffer processing fails
     *
     * @private
     *
     * @example
     * ```
     * const pdfBuffer = fs.readFileSync('invoice.pdf');
     * const text = await this.extractContentFromBuffer(
     *   pdfBuffer,
     *   'application/pdf',
     *   'invoice.pdf',
     *   'password123'
     * );
     * console.log(`Extracted ${text.length} characters`);
     * ```
     *
     * @remarks
     * - Python extraction is preferred for PDFs and images
     * - Falls back to built-in methods if Python unavailable
     * - Quality threshold of 50 characters before trusting result
     * - Automatically selects format-specific extractor
     */
    private extractContentFromBuffer;
    /**
     * Download and process single attachment end-to-end
     *
     * Complete workflow for a single attachment:
     * 1. Download from Gmail API
     * 2. Validate as financial document
     * 3. Extract content based on file type
     * 4. Extract metadata
     * 5. Return structured result
     *
     * @param {gmail_v1.Gmail} gmail - Gmail API client
     * @param {string} emailId - Gmail message ID
     * @param {Attachment} attachment - Attachment metadata
     * @param {string} userId - User ID who owns the file
     * @param {string} [password] - Optional password for protected files
     * @returns {Promise<Object>} Processing result with extracted data
     * @returns {string} filename - Original filename
     * @returns {string} mimeType - File MIME type
     * @returns {number} size - File size in bytes
     * @returns {string} content - Extracted text content
     * @returns {Record<string, any>} metadata - File metadata
     * @returns {string} [password] - Password used (if any)
     *
     * @throws {Error} If not financial document or processing fails
     *
     * @example
     * ```
     * const attachment: Attachment = {
     *   id: 'att-123',
     *   filename: 'invoice.pdf',
     *   mimeType: 'application/pdf',
     *   data: Buffer.from(''),
     *   size: 0
     * };
     *
     * const result = await service.downloadAndProcessAttachment(
     *   gmail,
     *   'msg-456',
     *   attachment,
     *   'user-789',
     *   'password123'
     * );
     *
     * console.log(`Extracted ${result.content.length} characters`);
     * console.log(`Quality: ${result.metadata.quality.status}`);
     * ```
     *
     * @remarks
     * - Validates document type before processing
     * - Sets userId for password generation in Python extractor
     * - Returns all necessary data for database storage
     * - Throws if file is not classified as financial
     */
    downloadAndProcessAttachment(gmail: gmail_v1.Gmail, emailId: string, attachment: Attachment, userId: string, password?: string): Promise<{
        filename: string;
        mimeType: string;
        size: number;
        content: string;
        metadata: Record<string, any>;
        password?: string;
    }>;
    /**
     * Download and process multiple attachments
     *
     * Batch processes all attachments from an email:
     * 1. Iterates through attachments array
     * 2. Processes each with downloadAndProcessAttachment
     * 3. Continues on error (skips failed attachments)
     * 4. Returns array of successful results
     *
     * @param {gmail_v1.Gmail} gmail - Gmail API client
     * @param {string} emailId - Gmail message ID
     * @param {Attachment[]} attachments - Array of attachments to process
     * @param {string} userId - User ID who owns the attachments
     * @param {string} [password] - Optional password for protected files
     * @returns {Promise<Array<Object>>} Array of processed attachment results
     *
     * @example
     * ```
     * const attachments = await service.extractAttachmentMetadata(emailMessage);
     * const results = await service.downloadAndProcessAttachments(
     *   gmail,
     *   'msg-123',
     *   attachments,
     *   'user-456',
     *   'password'
     * );
     *
     * console.log(`Successfully processed ${results.length} attachments`);
     * results.forEach(r => {
     *   console.log(`- ${r.filename}: ${r.metadata.quality.status} quality`);
     * });
     * ```
     *
     * @remarks
     * - Non-blocking: continues if individual attachment fails
     * - Errors logged but don't stop batch processing
     * - All successful results returned
     * - Suitable for processing entire email batches
     */
    downloadAndProcessAttachments(gmail: gmail_v1.Gmail, emailId: string, attachments: Attachment[], userId: string, password?: string): Promise<Array<{
        filename: string;
        mimeType: string;
        size: number;
        content: string;
        metadata: Record<string, any>;
    }>>;
}
export {};
//# sourceMappingURL=gmail-attachment.service.d.ts.map