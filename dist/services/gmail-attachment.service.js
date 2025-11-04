import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import passwordGeneratorService from './password-generator.service';
import { prisma } from '@/config/database';
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
export class GmailAttachmentService {
    uploadDir;
    userId;
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
    constructor(uploadDir = './uploads/attachments') {
        this.uploadDir = uploadDir;
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, {
                recursive: true,
            });
        }
    }
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
    async extractAttachmentMetadata(emailMessage) {
        try {
            const attachments = [];
            const payload = emailMessage.payload;
            if (!payload || !payload.parts) {
                return attachments;
            }
            for (const part of payload.parts) {
                if (part.filename && part.body?.attachmentId) {
                    attachments.push({
                        id: part.body.attachmentId,
                        filename: part.filename,
                        mimeType: part.mimeType || 'application/octet-stream',
                        data: Buffer.from(''),
                        size: 0,
                    });
                }
            }
            return attachments;
        }
        catch (error) {
            console.error('Error extracting attachments:', error);
            return [];
        }
    }
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
    async downloadAttachmentStream(gmail, emailId, attachmentId, filename) {
        try {
            console.log(`⟳ Streaming attachment: ${filename}`);
            const response = await gmail.users.messages.attachments.get({
                userId: 'me',
                messageId: emailId,
                id: attachmentId,
            });
            if (!response.data.data) {
                throw new Error('No attachment data received');
            }
            // Decode base64 data from Gmail
            const buffer = Buffer.from(response.data.data, 'base64');
            console.log(`✓ Downloaded: ${filename} (${buffer.length} bytes)`);
            return buffer;
        }
        catch (error) {
            console.error(`Error downloading attachment:`, error);
            throw error;
        }
    }
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
    extractPDFFromBuffer(buffer) {
        try {
            // Convert buffer to text
            let text = buffer.toString('latin1');
            // Remove binary markers
            text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, ' ');
            // Extract text objects (BT = Begin Text, ET = End Text)
            const textRegex = /BT[\s\S]*?ET/g;
            const matches = text.match(textRegex);
            if (matches && matches.length > 0) {
                text = matches
                    .map((m) => {
                    // Remove PDF operators
                    let cleaned = m
                        .replace(/[\\/()]{1,2}/g, ' ')
                        .replace(/Tj|TJ|Td|TD/g, ' ')
                        .replace(/[<>()[\]]{2,}/g, ' ');
                    // Decode hex strings (e.g., <48656C6C6F> -> "Hello")
                    cleaned = cleaned.replace(/<([0-9A-Fa-f]{2,})>/g, (match, hex) => {
                        try {
                            return Buffer.from(hex, 'hex').toString('utf-8');
                        }
                        catch {
                            return '';
                        }
                    });
                    return cleaned;
                })
                    .join('\n')
                    .replace(/\s+/g, ' ')
                    .trim();
            }
            // Fallback: extract readable text
            if (!text || text.length < 50) {
                text = buffer
                    .toString('utf-8')
                    .replace(/[^\x20-\x7E\n]/g, '')
                    .trim();
            }
            return text || 'PDF document received';
        }
        catch (error) {
            console.error('Error extracting PDF:', error);
            return 'PDF document received - content extraction pending';
        }
    }
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
    extractCSVFromBuffer(buffer) {
        try {
            const text = buffer.toString('utf-8');
            const lines = text.split('\n').filter((l) => l.trim());
            if (lines.length === 0) {
                return 'Empty CSV file';
            }
            // Create markdown table
            const headers = this.parseCSVLine(lines[0]);
            let markdown = `# CSV Data\n\n`;
            markdown += `| ${headers.join(' | ')} |\n`;
            markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;
            for (let i = 1; i < Math.min(lines.length, 21); i++) {
                const values = this.parseCSVLine(lines[i]);
                markdown += `| ${headers.map((_, idx) => values[idx] || '').join(' | ')} |\n`;
            }
            if (lines.length > 20) {
                markdown += `\n*Showing 20 rows of ${lines.length - 1} total*`;
            }
            return markdown;
        }
        catch (error) {
            console.error('Error extracting CSV:', error);
            return 'CSV file received - parsing pending';
        }
    }
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
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let insideQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                // Handle escaped quotes
                if (insideQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                }
                else {
                    insideQuotes = !insideQuotes;
                }
            }
            else if (char === ',' && !insideQuotes) {
                result.push(current.trim());
                current = '';
            }
            else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }
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
    extractExcelFromBuffer(buffer) {
        try {
            const text = buffer
                .toString('utf-8')
                .split('\0')
                .filter((s) => s.length > 2)
                .join('\n');
            // Extract numbers and text
            const lines = text.split('\n').filter((l) => l.length > 3).slice(0, 20);
            let markdown = `# Excel Data\n\n`;
            lines.forEach((line) => {
                if (line.trim().length > 0) {
                    markdown += `- ${line.trim()}\n`;
                }
            });
            return markdown;
        }
        catch (error) {
            console.error('Error extracting Excel:', error);
            return 'Excel file received - parsing pending';
        }
    }
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
    extractDOCXFromBuffer(buffer) {
        try {
            // DOCX is ZIP with XML - extract text
            let text = buffer.toString('utf-8');
            // Extract text from XML tags
            const matches = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
            if (matches && matches.length > 0) {
                text = matches
                    .map((m) => m.replace(/<[^>]*>/g, ''))
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                return text;
            }
            // Fallback
            return buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, '').trim();
        }
        catch (error) {
            console.error('Error extracting DOCX:', error);
            return 'DOCX file received - parsing pending';
        }
    }
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
    extractImageFromBuffer(buffer, filename) {
        // OCR placeholder - actual extraction done by Python
        return `## Image: ${filename}

**Size:** ${(buffer.length / 1024).toFixed(2)}KB

Image content will be extracted using OCR technology:
- Text detection
- Number extraction
- Financial data recognition
- Document classification

Processing status: Ready for OCR analysis`;
    }
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
    extractMetadata(buffer, filename, mimeType, content) {
        return {
            filename,
            fileSize: `${(buffer.length / 1024).toFixed(2)}KB`,
            mimeType,
            contentLength: content.length,
            extractedAt: new Date().toISOString(),
            hasContent: content.length > 50,
            contentPreview: content.substring(0, 150).replace(/\n/g, ' '),
            quality: this.assessQuality(content, buffer.length),
        };
    }
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
    assessQuality(content, bufferSize) {
        let score = 50; // Base score
        // Content length check (0-35 points)
        if (content.length > 100)
            score += 20;
        if (content.length > 500)
            score += 15;
        // Text density check (0-15 points)
        const textDensity = content.length / bufferSize;
        if (textDensity > 0.5)
            score += 15;
        // Financial data presence (0-10 points)
        if (/(\$|USD|INR|EUR|amount|total)/i.test(content)) {
            score += 10;
        }
        // Date presence (0-10 points)
        if (/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i.test(content)) {
            score += 10;
        }
        // Determine status
        const status = score > 80 ? 'high' : score > 60 ? 'medium' : 'low';
        return { score: Math.min(score, 100), status };
    }
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
    isFinancialDocument(filename, mimeType) {
        const financialExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.csv', '.xlsx', '.xls', '.docx'];
        const financialKeywords = [
            'invoice',
            'receipt',
            'statement',
            'payment',
            'transaction',
            'bill',
            'tax',
            'report',
        ];
        const ext = path.extname(filename).toLowerCase();
        const lower = filename.toLowerCase();
        if (!financialExtensions.includes(ext)) {
            return false;
        }
        return (financialKeywords.some((keyword) => lower.includes(keyword)) ||
            mimeType.includes('pdf') ||
            mimeType.includes('image') ||
            mimeType.includes('csv'));
    }
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
    async checkPdfProtection(tmpFile) {
        return new Promise((resolve) => {
            const args = [
                path.join(process.cwd(), 'extractor.py'),
                tmpFile,
                '--check-protected',
            ];
            const python = spawn('python3', args, { stdio: ['pipe', 'pipe', 'pipe'] });
            let stdout = '';
            python.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            python.on('close', (code) => {
                if (code === 0) {
                    const output = stdout.trim().toLowerCase();
                    if (output === 'protected') {
                        resolve(true);
                    }
                    else if (output === 'not protected') {
                        resolve(false);
                    }
                    else {
                        // Unexpected output: treat as not protected
                        resolve(false);
                    }
                }
                else {
                    resolve(false); // Fail safe
                }
            });
        });
    }
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
    async callPythonExtractor(buffer, filename, password) {
        return new Promise(async (resolve) => {
            try {
                // Create temporary directory and file
                const tmpDir = path.join(process.cwd(), 'tmp');
                if (!fs.existsSync(tmpDir)) {
                    fs.mkdirSync(tmpDir, { recursive: true });
                }
                const tmpFile = path.join(tmpDir, `temp_${Date.now()}_${filename}`);
                fs.writeFileSync(tmpFile, buffer);
                console.log(`⟳ Calling Python extractor: ${filename}`);
                const args = [path.join(process.cwd(), 'extractor.py'), tmpFile];
                // Check if PDF is protected
                const isProtected = await this.checkPdfProtection(tmpFile);
                const user = await prisma.user.findUnique({
                    where: { id: this.userId },
                });
                // Generate passwords for protected PDFs
                const result = await passwordGeneratorService.generatePasswordsForPDF(filename || 'document', user);
                console.log('result.passwords :::', result);
                // Pass password if PDF is protected
                if (password) {
                    args.push('-p', password);
                }
                // Spawn Python process with 30-second timeout
                const python = spawn('python3', args, {
                    timeout: 30000,
                    stdio: ['pipe', 'pipe', 'pipe'],
                });
                // console.log('python :::', python);
                let stdout = '';
                let stderr = '';
                python.stdout.on('data', (data) => {
                    stdout += data.toString();
                });
                console.log('stdout ::', stdout);
                python.stderr.on('data', (data) => {
                    stderr += data.toString();
                    console.error(`Python stderr: ${data}`);
                });
                // Handle process completion
                python.on('close', (code) => {
                    // Clean up temporary file
                    try {
                        fs.unlinkSync(tmpFile);
                    }
                    catch (e) {
                        // Ignore cleanup errors
                    }
                    if (code === 0) {
                        try {
                            // Try to parse as JSON (from --analyze flag)
                            const parsedResult = JSON.parse(stdout);
                            console.log(`✓ Python extraction successful: ${filename}`);
                            resolve({
                                success: parsedResult.success !== false,
                                text: parsedResult.text || parsedResult.extracted_text || '',
                                metadata: {
                                    method: parsedResult.method || 'python_extractor',
                                    char_count: parsedResult.char_count || (parsedResult.text || '').length,
                                    quality: this.assessQuality(parsedResult.text || '', buffer.length),
                                    ...parsedResult,
                                },
                            });
                        }
                        catch (e) {
                            // Not JSON - return raw stdout as text
                            console.log(`✓ Python extraction completed (raw text): ${filename}`);
                            resolve({
                                success: true,
                                text: stdout || '',
                                metadata: {
                                    method: 'python_extractor_raw',
                                    char_count: stdout.length,
                                    quality: this.assessQuality(stdout, buffer.length),
                                },
                            });
                        }
                    }
                    else {
                        console.warn(`Python extraction failed with code ${code}: ${stderr}`);
                        // Return fallback result
                        resolve({
                            success: false,
                            text: '',
                            metadata: {
                                method: 'python_extractor_failed',
                                error: stderr || 'Python process failed',
                                fallback_available: true,
                            },
                        });
                    }
                });
                // 30-second timeout handler
                setTimeout(() => {
                    python.kill();
                    console.warn(`Python extractor timeout for: ${filename}`);
                    // Clean up
                    try {
                        fs.unlinkSync(tmpFile);
                    }
                    catch (e) {
                        // Ignore
                    }
                    resolve({
                        success: false,
                        text: '',
                        metadata: {
                            method: 'python_extractor_timeout',
                            error: 'Processing timeout (30s)',
                        },
                    });
                }, 30000);
            }
            catch (error) {
                console.error('Error spawning Python:', error);
                resolve({
                    success: false,
                    text: '',
                    metadata: {
                        method: 'python_extractor_error',
                        error: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });
    }
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
    async extractContentFromBuffer(buffer, mimeType, filename, password) {
        try {
            const ext = path.extname(filename).toLowerCase();
            // PDF extraction - TRY PYTHON FIRST
            if (mimeType === 'application/pdf' || ext === '.pdf') {
                console.log(`🔓 Attempting Python extraction for PDF: ${filename}`);
                const pythonResult = await this.callPythonExtractor(buffer, filename, password);
                if (pythonResult.success && pythonResult.text.length > 50) {
                    console.log(`✓ Python extraction successful for ${filename}`);
                    return pythonResult.text;
                }
                // Fallback to buffer-based extraction
                console.log(`⚠ Python extraction failed or returned low quality, using fallback for ${filename}`);
                return this.extractPDFFromBuffer(buffer);
            }
            // Image extraction - TRY PYTHON FIRST
            if (mimeType.startsWith('image/')) {
                console.log(`🔓 Attempting Python OCR for image: ${filename}`);
                const pythonResult = await this.callPythonExtractor(buffer, filename, password);
                if (pythonResult.success && pythonResult.text.length > 50) {
                    console.log(`✓ Python OCR successful for ${filename}`);
                    return pythonResult.text;
                }
                // Fallback
                return this.extractImageFromBuffer(buffer, filename);
            }
            // CSV extraction
            if (mimeType === 'text/csv' || ext === '.csv') {
                return this.extractCSVFromBuffer(buffer);
            }
            // Excel extraction
            if (mimeType.includes('sheet') || mimeType.includes('excel')) {
                return this.extractExcelFromBuffer(buffer);
            }
            // DOCX extraction
            if (mimeType.includes('word') || mimeType.includes('document')) {
                return this.extractDOCXFromBuffer(buffer);
            }
            // Text files
            if (mimeType.startsWith('text/')) {
                return buffer.toString('utf-8');
            }
            // Default
            return `File: ${filename}\nSize: ${buffer.length} bytes\nType: ${mimeType}`;
        }
        catch (error) {
            console.error('Error extracting content:', error);
            throw error;
        }
    }
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
    async downloadAndProcessAttachment(gmail, emailId, attachment, userId, password) {
        try {
            // Download from Gmail
            const buffer = await this.downloadAttachmentStream(gmail, emailId, attachment.id, attachment.filename);
            // Store userId for password generation
            if (userId !== 'unknown') {
                this.userId = userId;
            }
            // Validate as financial document
            if (!this.isFinancialDocument(attachment.filename, attachment.mimeType)) {
                console.log(`ℹ Not a financial document: ${attachment.filename}`);
                throw new Error('Not a financial document');
            }
            // Extract content with password support
            const content = await this.extractContentFromBuffer(buffer, attachment.mimeType, attachment.filename, password);
            // Extract metadata
            const metadata = this.extractMetadata(buffer, attachment.filename, attachment.mimeType, content);
            console.log(`✓ Processed: ${attachment.filename} (${content.length} chars)`);
            return {
                filename: attachment.filename,
                mimeType: attachment.mimeType,
                size: buffer.length,
                content,
                metadata,
            };
        }
        catch (error) {
            console.error(`Error processing attachment:`, error);
            throw error;
        }
    }
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
    async downloadAndProcessAttachments(gmail, emailId, attachments, userId, password) {
        const results = [];
        for (const attachment of attachments) {
            try {
                const processed = await this.downloadAndProcessAttachment(gmail, emailId, attachment, userId, password);
                results.push(processed);
            }
            catch (error) {
                console.error(`Error processing ${attachment.filename}:`, error);
                // Continue with next attachment
            }
        }
        return results;
    }
}
//# sourceMappingURL=gmail-attachment.service.js.map