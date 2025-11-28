import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { prisma } from '../config/database';
import { AIService, EnhancedFinancialData } from './ai.service';
import { Asset } from '@prisma/client';
import { FileStorageService } from './file-storage.service';

interface FileProcessingOptions {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    userId: string;
    password?: string;
}

export class FileExtractionService {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    /**
     * ✅ Try to unlock file using AI password guessing
     */
    async tryUnlockWithAI(options: FileProcessingOptions): Promise<{
        success: boolean;
        password?: string;
        error?: string;
        attempts?: number;
    }> {
        try {
            const { buffer, filename, mimeType, userId } = options;

            console.log(`\n${'='.repeat(70)}`);
            console.log(`🤖 AI PASSWORD GUESSING ATTEMPT`);
            console.log(`${'='.repeat(70)}`);
            console.log(`📄 File: ${filename}`);
            console.log(`👤 User ID: ${userId}`);

            // Get user data for password guessing
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                console.log(`❌ User not found: ${userId}`);
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            // Prepare user data for AI
            const userData = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                date_of_birth: user.date_of_birth?.toISOString(),
                pan_number: user.pan_number,
                aadhar_number: user.aadhar_number,
                account_number: user.account_number,
                crn_number: user.crn_number,
                pran_number: user.pran_number,
                uan_number: user.uan_number,
                customer_id: user.customer_id
            };

            // Use AI to guess password
            const aiService = new AIService();

            // Try to extract some text even if locked (for AI to analyze)
            const partialExtraction = await this.extractContent(buffer, filename, mimeType);

            const aiResult = await aiService.guessPasswordWithAI(
                filename,
                userData,
                {
                    extractedText: partialExtraction.text,
                    errorMessage: partialExtraction.metadata?.python_error,
                    fileSize: buffer.length
                },
                3 // Max 3 attempts
            );

            if (!aiResult.success || !aiResult.passwords || aiResult.passwords.length === 0) {
                console.log(`❌ AI could not generate password candidates`);
                return {
                    success: false,
                    error: 'AI password guessing failed',
                    attempts: aiResult.attempts?.length || 0
                };
            }

            console.log(`\n🔑 Testing ${aiResult.passwords.length} AI-generated passwords...`);

            // Try each password
            for (let i = 0; i < aiResult.passwords.length; i++) {
                const testPassword = aiResult.passwords[i];
                console.log(`\n🔐 Attempt ${i + 1}/${aiResult.passwords.length}: Testing password...`);

                try {
                    // Try to extract with this password
                    const testExtraction = await this.extractContent(
                        buffer,
                        filename,
                        mimeType,
                        testPassword
                    );

                    // Check if extraction was successful
                    const isSuccess =
                        testExtraction.metadata?.success === true &&
                        testExtraction.text.length > 100 &&
                        !testExtraction.text.toLowerCase().includes('password protected') &&
                        !testExtraction.text.toLowerCase().includes('incorrect password');

                    if (isSuccess) {
                        console.log(`\n${'='.repeat(70)}`);
                        console.log(`✅ SUCCESS! File unlocked with password`);
                        console.log(`${'='.repeat(70)}\n`);

                        return {
                            success: true,
                            password: testPassword,
                            attempts: i + 1
                        };
                    } else {
                        console.log(`❌ Password failed`);
                    }
                } catch (error) {
                    console.log(`❌ Password test error: ${(error as Error).message}`);
                }
            }

            console.log(`\n❌ All ${aiResult.passwords.length} password attempts failed`);
            return {
                success: false,
                error: 'No valid password found',
                attempts: aiResult.passwords.length
            };

        } catch (error) {
            console.error('❌ Error in AI password unlocking:', error);
            return {
                success: false,
                error: (error as Error).message
            };
        }
    }

    /**
     * ✅ Check if file is password protected/locked
     * Returns { isLocked, needsPassword, error }
     */
    async checkFileLocked(options: FileProcessingOptions): Promise<{
        isLocked: boolean;
        needsPassword: boolean;
        canOpen: boolean;
        error?: string;
        message: string;
    }> {
        try {
            const { buffer, filename, mimeType, password } = options;

            console.log(`🔐 Checking if file is locked: ${filename}`);

            // Only check PDF files for now
            if (!mimeType.includes('pdf')) {
                return {
                    isLocked: false,
                    needsPassword: false,
                    canOpen: true,
                    message: 'File is not a PDF, no lock check needed'
                };
            }

            // Try to extract content
            const extractionResult = await this.extractContent(
                buffer,
                filename,
                mimeType,
                password
            );

            console.log(`📊 Extraction result - Success: ${extractionResult.metadata?.success}, Text length: ${extractionResult.text.length}`);

            // Check if extraction failed due to password
            const contentLower = extractionResult.text.toLowerCase();
            const metadataError = extractionResult.metadata?.python_error?.toLowerCase() || '';

            const isPasswordProtected =
                contentLower.includes('password protected') ||
                contentLower.includes('incorrect password') ||
                contentLower.includes('encrypted') ||
                contentLower.includes('password required') ||
                contentLower.includes('user password') ||
                contentLower.includes('owner password') ||
                contentLower.includes('❌ incorrect password') ||
                metadataError.includes('password') ||
                metadataError.includes('encrypted');

            // Check if extraction was successful
            const extractionSuccessful =
                extractionResult.metadata?.success === true &&
                extractionResult.text.length > 100;

            if (isPasswordProtected) {
                console.log('🔒 File is password protected');
                return {
                    isLocked: true,
                    needsPassword: true,
                    canOpen: false,
                    error: 'File is password protected',
                    message: password
                        ? 'Incorrect password provided'
                        : 'File requires password to open'
                };
            }

            // If extraction was successful, file can be opened
            if (extractionSuccessful) {
                console.log('✅ File is not locked and can be opened');
                return {
                    isLocked: false,
                    needsPassword: false,
                    canOpen: true,
                    message: 'File is accessible'
                };
            }

            // Check if file failed to open (but not password related)
            const failedToOpen =
                contentLower.includes('extraction failed') ||
                contentLower.includes('failed to extract') ||
                contentLower.includes('cannot read') ||
                contentLower.includes('corrupt') ||
                contentLower.includes('damaged') ||
                extractionResult.metadata?.success === false;

            if (failedToOpen) {
                console.log('❌ File failed to open');
                return {
                    isLocked: false,
                    needsPassword: false,
                    canOpen: false,
                    error: 'File could not be opened',
                    message: 'File may be corrupt or in unsupported format'
                };
            }

            // Default: if we got here and text is reasonable, assume it's accessible
            console.log('✅ File appears to be accessible (default case)');
            return {
                isLocked: false,
                needsPassword: false,
                canOpen: true,
                message: 'File is accessible'
            };

        } catch (error) {
            console.error('❌ Error checking file lock:', error);
            return {
                isLocked: false,
                needsPassword: false,
                canOpen: false,
                error: (error as Error).message,
                message: 'Error checking file status'
            };
        }
    }


    async processFile(options: FileProcessingOptions) {
        try {
            const { buffer, filename, mimeType, userId, password } = options;
            const startTime = Date.now();

            console.log(`🔍 Extracting content from: ${filename}`);
            let extractionResult;

            // ✅ STEP 1: Check if file is locked or can't be opened
            const combinationsPassword = [options.password?.toUpperCase(), options.password?.toLowerCase()] // manual commbination user usually mistakes
            const lockCheck = await this.checkFileLocked(options);

            // ✅ STEP 2: If locked and no password provided, try AI password guessing
            if (lockCheck.isLocked && !password) {
                console.log(`🤖 File is locked, attempting AI password guessing...`);

                const unlockedResult = await this.tryUnlockWithAI(options);

                if (unlockedResult.success) {
                    console.log(`✅ File unlocked with AI-guessed password!`);
                    // Update options with guessed password and continue processing
                    options.password = unlockedResult.password!;
                } else {
                    console.log(`❌ AI password guessing failed: ${unlockedResult.error}`);
                    return {
                        success: false,
                        filename,
                        error: lockCheck.error || lockCheck.message,
                        statusCode: 403,
                        isLocked: lockCheck.isLocked,
                        needsPassword: lockCheck.needsPassword,
                        canOpen: lockCheck.canOpen,
                        aiAttempted: true,
                        aiResult: unlockedResult
                    };
                }
            } else if (lockCheck.isLocked && password) {
                // Password provided but incorrect
                // 1. firstly check the manual combinations lekin in lower cas and upper case because user by mistake not use the case sensitive password
                for (const combinationPass of combinationsPassword) {
                    // console.log('combination pass :: ',combinationPass)
                    const data = await this.extractContent(buffer, filename, mimeType, combinationPass)
                    // console.log("data.metadata :: ",data.metadata)
                    if (data.metadata.success) {
                        // data extracted and assign to the variable
                        extractionResult = data
                        // console.log('extracted data herer ::: ', data)

                        // break the loops to prevent unwanted excution and checks
                        break;
                    }
                    if (!data.metadata?.success) {
                        // 2. if combination password is checked  and incorrect then remove the string from the commbinationsPassword to prevent the duplication checks
                        combinationsPassword.filter(n => n !== combinationPass)
                        continue;
                    }
                }

                // 3. if the password is correct then we not filter out that password and another combinations in comminationArray means if any of the string exist thats means the password is found 
                if (combinationsPassword.length < 1) {
                    console.log(`❌ Provided password is incorrect`);
                    return {
                        success: false,
                        filename,
                        error: 'Incorrect password provided',
                        statusCode: 403,
                        isLocked: lockCheck.isLocked,
                        needsPassword: lockCheck.needsPassword,
                        canOpen: lockCheck.canOpen
                    };
                }

            } else if (!lockCheck.canOpen) {
                // File cannot be opened (corrupt/damaged)
                console.log(`❌ File cannot be opened: ${lockCheck.message}`);
                return {
                    success: false,
                    filename,
                    error: lockCheck.error || lockCheck.message,
                    statusCode: 403,
                    isLocked: lockCheck.isLocked,
                    needsPassword: lockCheck.needsPassword,
                    canOpen: lockCheck.canOpen
                };
            }

            // Extract content using Python
            extractionResult = await this.extractContent(
                buffer,
                filename,
                mimeType,
                password
            );

            const aiService = new AIService()
            const assetAnalysis = await aiService.analyzeFileForAsset(
                extractionResult.text,
                extractionResult.metadata,
                userId,
                filename,
                mimeType
            );

            // Initialize storageResult for both cases
            let storageResult: any = null;

            // after extract and parsing we can empty the combinationPassword array 
            combinationsPassword.splice(0, combinationsPassword.length)

            // ✅ VERIFICATION: Check if this is actually financial data before saving
            console.log('\n🔍 Verifying if file contains financial data...');

            // Create a simplified extracted data object for verification
            const extractedForVerification: EnhancedFinancialData = {
                transactionType: 'other' as any,
                amount: assetAnalysis.assetData.balance ? Number(assetAnalysis.assetData.balance) : null,
                currency: 'INR',
                balance: '0',
                merchant: assetAnalysis.assetData.bank_name || '',
                description: assetAnalysis.assetData.name || '',
                date: new Date().toISOString().split('T')[0],
                accountNumber: assetAnalysis.assetData.account_number || null,
                confidence: (assetAnalysis.assetData.document_metadata as any)?.confidence || 50,
                assetCategory: assetAnalysis.assetData.type as any,
                assetType: assetAnalysis.assetData.sub_type || '',
                assetSubType: null,
                status: assetAnalysis.assetData.status as any || 'active',
                financialMetadata: {
                    isRecurring: false
                },
                keyPoints: []
            };

            let verification;
            try {
                verification = await aiService.verifyFinancialContent(
                    extractedForVerification,
                    extractionResult.text,
                    filename
                );
            } catch (error: any) {
                console.warn('⚠️ AI verification failed,1 using fallback logic:', error.message);
                // Fallback: Assume it's financial if asset analysis has bank details
                verification = {
                    isFinancial: !!assetAnalysis.assetData.bank_name || !!assetAnalysis.assetData.account_number,
                    reason: 'AI verification failed, using fallback logic'
                };
            }

            if (!verification.isFinancial) {
                console.log(`⏭️  File - Not financial data: ${filename}`);
                console.log(`   Reason: ${verification.reason}`);

                console.log(`🔍 Performing dedicated document analysis...`);

                // Use dedicated document analysis instead of financial analysis
                const documentAnalysis = await aiService.analyzeDocumentContent(
                    extractionResult.text,
                    extractionResult.metadata,
                    userId,
                    filename,
                    mimeType
                );

                console.log(`✅ Document analysis completed with confidence: ${documentAnalysis.documentData.confidence_score}%`);

                // Store file using FileStorageService
                const fileStorageService = new FileStorageService();
                storageResult = await fileStorageService.storeFile({
                    buffer,
                    filename,
                    mimeType,
                    userId
                });

                // Save to Document model with proper document analysis
                const documentData = {
                    user_id: userId,
                    filename: filename,
                    original_filename: filename,
                    file_size: buffer.length,
                    mime_type: mimeType,
                    upload_source: 'manual',
                    parsing_status: 'completed' as any,
                    extracted_text: extractionResult.text.replace(/\u0000/g, ''),
                    document_type: documentAnalysis.documentData.document_type as any,
                    document_category: documentAnalysis.documentData.document_category,
                    confidence_score: documentAnalysis.documentData.confidence_score,
                    extracted_data: documentAnalysis.documentData.extracted_data,
                    page_count: extractionResult.metadata?.page_count,
                    is_password_protected: options.password ? true : false,
                    processing_method: 'hybrid' as any,
                    processing_duration: Date.now() - startTime,
                    ai_model_used: 'document_analysis',
                    file_url: storageResult.url,
                    storage_path: storageResult.s3Key
                };

                await prisma.document.create({
                    data: documentData
                });

                console.log(`✅ Document saved successfully with preview URL: ${storageResult.previewUrl}`);
                return {
                    success: true,
                    filename,
                    mimeType,
                    // fileId: storageResult.fileId,
                    // previewUrl: storageResult.previewUrl,
                    message: 'Document Parsed Successfully.'
                }
            } else {
                console.log(`✅ Verified as financial data, extracting balance...`);

                // 🔥 Extract balance and total_value from document_metadata
                let balance = assetAnalysis.assetData.balance;
                let total_value = assetAnalysis.assetData.total_value;

                if (assetAnalysis.assetData.document_metadata) {
                    let balanceExtraction;
                    try {
                        balanceExtraction = await aiService.extractBalanceFromMetadata(
                            assetAnalysis.assetData.document_metadata,
                            assetAnalysis.assetData.type || 'Document'
                        );

                        if (balanceExtraction.confidence > 60) {
                            balance = balanceExtraction.balance as any;
                            total_value = balanceExtraction.total_value! as any;
                            console.log(`✅ Balance extracted: ₹${balance}, Total: ₹${total_value}`);
                        } else {
                            console.log(`⚠️ Low confidence balance extraction (${balanceExtraction.confidence}%), using fallback values`);
                        }
                    } catch (error: any) {
                        console.warn('⚠️ AI balance extraction failed, using fallback values:', error.message);
                        // Use existing balance values as fallback
                    }
                }

                console.log(`💾 Saving to database...`);

                await prisma.asset.create({
                    data: {
                        ...assetAnalysis.assetData,
                        balance: balance,
                        total_value: total_value
                    } as any
                });

                // For financial assets, also store the file for preview
                const fileStorageService = new FileStorageService();
                storageResult = await fileStorageService.storeFile({
                    buffer,
                    filename,
                    mimeType,
                    userId
                });

                console.log(`✅ Financial asset saved with preview URL: ${storageResult.previewUrl}`);
            }

            return {
                success: true,
                filename,
                mimeType,
                size: buffer.length,
                extractedContent: assetAnalysis,
                metadata: extractionResult.metadata,
                fileId: storageResult?.fileId,
                previewUrl: storageResult?.previewUrl
            };

        } catch (error) {
            console.error('❌ Error processing file:', error);

            return {
                success: false,
                filename: options.filename,
                error: (error as Error).message
            };
        }
    }

    private async extractContent(
        buffer: Buffer,
        filename: string,
        mimeType: string,
        password?: string
    ): Promise<{ text: string; metadata: Record<string, any> }> {
        return new Promise(async (resolve) => {
            let tmpFile: string | null = null;
            let outputFile: string | null = null;

            try {
                const tmpDir = path.join(process.cwd(), 'tmp');
                console.log(tmpDir)
                if (!fs.existsSync(tmpDir)) {
                    fs.mkdirSync(tmpDir, { recursive: true });
                }

                // Create temporary file with proper filename
                tmpFile = path.join(tmpDir, `temp_${Date.now()}_${filename}`);
                outputFile = path.join(tmpDir, `output_${Date.now()}.txt`);

                fs.writeFileSync(tmpFile, buffer);

                console.log(`⟳ Calling Python extractor for: ${filename}`);

                // Python command with output file
                const args = [
                    path.join(process.cwd(), 'extractor.py'),
                    tmpFile,
                    '-o',
                    outputFile
                ];

                if (password) {
                    args.push('-p', password);
                }

                const python = spawn('python3', args, {
                    timeout: 300000,
                    stdio: ['pipe', 'pipe', 'pipe'],
                });

                let stdout = '';
                let stderr = '';

                python.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                python.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                python.on('close', (code) => {
                    let extractedText = '';
                    let metadata: any = {
                        method: 'python_extractor',
                        success: false,
                        char_count: 0,
                        exit_code: code
                    };

                    // Log stdout and stderr for debugging
                    if (stdout) {
                        // console.log('📝 Python stdout:', stdout.substring(0, 500));
                    }
                    if (stderr) {
                        // console.log('⚠️  Python stderr:', stderr.substring(0, 500));
                    }

                    // Read from output file
                    if (outputFile && fs.existsSync(outputFile)) {
                        try {
                            extractedText = fs.readFileSync(outputFile, 'utf-8');
                            metadata.success = true;
                            metadata.char_count = extractedText.length;
                            console.log(`✅ Read ${extractedText.length} characters from output file`);

                            // Delete output file
                            fs.unlinkSync(outputFile);
                        } catch (e) {
                            console.error('❌ Error reading output file:', e);
                        }
                    } else {
                        console.log('⚠️  Output file does not exist:', outputFile);
                    }

                    // Parse metadata from stdout (even if Python had error)
                    try {
                        const methodMatch = stdout.match(/Method:\s*(.+)/);
                        if (methodMatch) {
                            metadata.extraction_method = methodMatch[1].trim();
                        }

                        const sizeMatch = stdout.match(/Size:\s*(.+)/);
                        if (sizeMatch) {
                            metadata.file_size = sizeMatch[1].trim();
                        }

                        const pageMatch = stdout.match(/Pages:\s*(\d+)/);
                        if (pageMatch) {
                            metadata.page_count = parseInt(pageMatch[1]);
                        }

                        // Check for tables
                        if (stdout.includes('Tables:') && stdout.includes('Detected')) {
                            metadata.has_tables = true;
                        }
                    } catch (e) {
                        console.warn('Could not parse metadata from stdout');
                    }

                    // Cleanup temp file
                    if (tmpFile && fs.existsSync(tmpFile)) {
                        try {
                            fs.unlinkSync(tmpFile);
                            console.log(`🗑️ Deleted temp file: ${tmpFile}`);
                        } catch (e) {
                            console.warn('Failed to cleanup temp file:', e);
                        }
                    }

                    // Return result
                    if (extractedText && extractedText.length > 0) {
                        console.log(`✅ Extraction successful: ${extractedText.length} chars`);
                        resolve({
                            text: extractedText,
                            metadata: {
                                ...metadata,
                                success: true,
                                stdout: stdout.substring(0, 1000),
                                stderr: stderr.substring(0, 1000)
                            }
                        });
                    } else {
                        console.warn(`⚠ No content extracted from file`);

                        // Return error info with stdout/stderr for debugging
                        resolve({
                            text: stdout || stderr || 'Failed to extract content from file',
                            metadata: {
                                ...metadata,
                                success: false,
                                python_error: stderr || 'No output generated',
                                python_stdout: stdout || 'No stdout',
                                exit_code: code
                            }
                        });
                    }
                });

                python.on('error', (error) => {
                    console.error('❌ Python process error:', error);

                    // Cleanup
                    if (tmpFile && fs.existsSync(tmpFile)) {
                        fs.unlinkSync(tmpFile);
                    }
                    if (outputFile && fs.existsSync(outputFile)) {
                        fs.unlinkSync(outputFile);
                    }

                    resolve({
                        text: `Python execution error: ${error.message}`,
                        metadata: {
                            method: 'python_extractor_error',
                            error: error.message,
                            success: false,
                            char_count: 0
                        }
                    });
                });

                // Timeout handler
                setTimeout(() => {
                    python.kill();
                    console.warn(`⏱ Python timeout for: ${filename}`);

                    // Cleanup
                    if (tmpFile && fs.existsSync(tmpFile)) {
                        fs.unlinkSync(tmpFile);
                    }
                    if (outputFile && fs.existsSync(outputFile)) {
                        fs.unlinkSync(outputFile);
                    }

                    resolve({
                        text: 'Extraction timeout (5 minutes)',
                        metadata: {
                            method: 'python_extractor_timeout',
                            error: 'Processing timeout',
                            success: false,
                            char_count: 0
                        }
                    });
                }, 300000);

            } catch (error) {
                console.error('❌ Error in extractContent:', error);

                // Cleanup on error
                if (tmpFile && fs.existsSync(tmpFile)) {
                    try {
                        fs.unlinkSync(tmpFile);
                    } catch (e) {
                        // Ignore
                    }
                }
                if (outputFile && fs.existsSync(outputFile)) {
                    try {
                        fs.unlinkSync(outputFile);
                    } catch (e) {
                        // Ignore
                    }
                }

                resolve({
                    text: `Extraction error: ${(error as Error).message}`,
                    metadata: {
                        method: 'extraction_error',
                        error: (error as Error).message,
                        success: false,
                        char_count: 0
                    }
                });
            }
        });
    }
}
