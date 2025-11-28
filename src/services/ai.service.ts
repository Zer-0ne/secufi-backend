/**
 * @fileoverview AI service for financial data analysis and password guessing
 * @description This service provides AI-powered analysis of financial documents,
 * email classification, password guessing for encrypted files, and financial data
 * extraction using AWS Bedrock and OpenAI APIs.
 * 
 * @module services/ai.service
 * @requires @/config/database - Prisma database client
 * @requires ./financial-data.service - Financial data service interfaces
 * @requires @/types/google - Email message types
 * @requires @aws-sdk/client-bedrock-runtime - AWS Bedrock client
 * @requires @prisma/client - Prisma database types
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

import { prisma } from "@/config/database";
import { AttachmentContent, EmailData } from "./financial-data.service";
import { EmailMessage } from "@/types/google";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { Asset } from "@prisma/client";
import { bedrockQueue } from "./queue.service";

/**
 * Interface defining the structure of financial analysis requests
 * 
 * @interface FinancialAnalysisRequest
 * @description Contains all data needed for AI-powered financial analysis
 * 
 * @property {string} emailContent - The content of the email to analyze
 * @property {string} subject - The email subject line
 * @property {string} sender - The sender's email address
 * @property {AttachmentContent[]} [attachmentContents] - Optional array of attachment contents
 * @property {string} documentType - Type of document being analyzed
 */
interface FinancialAnalysisRequest {
  emailContent: string;
  subject: string;
  sender: string;
  attachmentContents?: AttachmentContent[];
  documentType: string;
}

export interface EnhancedFinancialData {
  // Transaction fields
  transactionType: 'invoice' | 'payment' | 'receipt' | 'statement' | 'bill' | 'tax' | 'credit_card' | 'other';
  amount: number | null;
  currency: string;
  merchant: string;
  balance: string;
  description: string;
  date: string;
  accountNumber: string | null;
  confidence: number;

  // Asset Classification (3 main categories)
  assetCategory: 'asset' | 'liability' | 'insurance' | 'other';
  assetType: string;
  assetSubType: string | null;

  // Status tracking
  status: 'active' | 'inactive' | 'pending' | 'complete' | 'missing';

  // Bank details
  bankName?: string;
  ifscCode?: string;
  branchName?: string;

  // Insurance/Investment specific
  policyNumber?: string;
  folioNumber?: string;
  fundName?: string;

  requiredUserFields?: {
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    pan_number?: boolean;
    aadhar_number?: boolean;
    date_of_birth?: boolean;
    crn_number?: boolean;
    account_number?: boolean;
    ifsc_code?: boolean;
    policy_number?: boolean;
    folio_number?: boolean;
  };

  // Financial metadata
  financialMetadata: {
    totalValue?: number;
    currentValue?: number;

    // For recurring payments
    isRecurring: boolean;
    frequency?: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
    dueDate?: string;

    // Insurance specific
    coverageAmount?: number;
    premium?: number;
    premiumFrequency?: string;
    maturityDate?: string;
    sumAssured?: number;
    policyTerm?: number;
    beneficiary?: string;

    // Liability specific
    outstandingBalance?: number;
    minimumPayment?: number;
    creditLimit?: number;
    interestRate?: number;
    emiAmount?: number;
    emiDueDate?: string;

    // Asset specific (Investments)
    purchasePrice?: number;
    currentNav?: number;
    units?: number;
    appreciationRate?: number;
    returnsPercentage?: number;
  };

  keyPoints: string[];
}

interface PDFAnalysisRequest {
  text: string;
  documentType?: string;
}

interface AnalysisResult {
  success: boolean;

  extractedData: {
    // Basic transaction data
    transactionType?: any;
    amount?: number;
    currency: string;
    merchant?: string;
    description?: string;
    date?: string;
    accountNumber: string;
    confidence: number;

    // Enhanced classification
    assetCategory: any;
    assetType: string;
    assetSubType: string;
    status: string;

    // Bank details
    bankName?: string;
    ifscCode?: string;
    branchName?: string;

    // Insurance / Investment specific
    policyNumber?: string;
    folioNumber?: string;
    fundName?: string;

    // Complete metadata
    financialMetadata: Record<string, any>;
    balance: any;
    total_value: any;
  };

  keyPoints: string[];
  summary: string;
  issues: string[];
  required_fields: string[];
  attachmentAnalyses: any
  extracted_content: any
}


export class AIService {
  private openaiKey: string;

  // badrock
  private bedrockApiKey: string;
  private bedrockEndpoint: string;
  private modelId: string;

  // Cache for API responses to avoid duplicate calls
  private apiCache: Map<string, { response: string; timestamp: number }> = new Map();
  private cacheTtl = 5 * 60 * 1000; // 5 minutes

  constructor(openaiKey?: string) {
    this.openaiKey = openaiKey || process.env.OPENAI_API_KEY || '';

    if (!this.openaiKey) {
      console.warn('⚠️ OpenAI API key not configured');
    } else {
      console.log('✓ OpenAI API key configured');
    }


    // badrock 
    this.bedrockApiKey = process.env.AWS_BEARER_TOKEN_BEDROCK || '';
    const awsRegion = 'us-east-1';
    this.bedrockEndpoint = `https://bedrock-runtime.${awsRegion}.amazonaws.com`;

    // Choose your model
    this.modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
    // this.modelId = 'amazon.nova-lite-v1:0';

    console.log('✓ AWS Bedrock configured with API key authentication');
    console.log('✓ Model:', this.modelId);
  }

  public async checkEnv() {
    this.bedrockApiKey = await process.env.AWS_BEARER_TOKEN_BEDROCK || '';

    if (!this.bedrockApiKey) {
      throw new Error('AWS_BEARER_TOKEN_BEDROCK environment variable is required');
    }
  }

  private async callBedrock(prompt: string, systemPrompt?: string, retries: number = 3): Promise<string> {
    return bedrockQueue.addToQueue<string>(async () => {
      // Check cache first
      // const cacheKey = `${prompt.substring(0, 100)}_${systemPrompt?.substring(0, 50) || 'no_system'}`;
      // const cached = this.apiCache.get(cacheKey);

      // if (cached && Date.now() - cached.timestamp < this.cacheTtl) {
      //   console.log('✓ Using cached Bedrock response');
      //   return cached.response;
      // }

      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`⟳ Calling AWS Bedrock API... (Attempt ${attempt}/${retries})`);
          await this.checkEnv()

          let body: any;

          if (this.modelId.includes('claude')) {
            // Claude model format (WITHOUT thinking parameter for REST API)
            body = {
              anthropic_version: "bedrock-2023-05-31",
              max_tokens: 15000,
              messages: [
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.3,
              top_p: 0.95,
            };

            // Add system prompt if provided
            if (systemPrompt) {
              body.system = systemPrompt;
            }

          } else if (this.modelId.includes('titan')) {
            // Amazon Titan format
            body = {
              inputText: prompt,
              textGenerationConfig: {
                maxTokenCount: 8000,
                stopSequences: [],
                temperature: 0.3,
                topP: 0.95,
              }
            };
          } else if (this.modelId.includes('nova')) {
            // Amazon Nova model format (NEW)
            body = {
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      text: prompt
                    }
                  ]
                }
              ],
              inferenceConfig: {
                max_new_tokens: 10000,
                temperature: 0.3,
                top_p: 0.95
              }
            };

            // Add system prompt if provided
            if (systemPrompt) {
              body.system = [
                {
                  text: systemPrompt
                }
              ];
            }

          } else if (this.modelId.includes('llama')) {
            // Meta Llama format
            body = {
              prompt: prompt,
              max_gen_len: 8000,
              temperature: 0.3,
              top_p: 0.95,
            };
          }

          // Make HTTP request with Bearer token
          const url = `${this.bedrockEndpoint}/model/${this.modelId}/invoke`;

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.bedrockApiKey}`
            },
            body: JSON.stringify(body)
          });

          // Check if response is not OK (non-200 status)
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Bedrock API error (${response.status}): ${errorText}`);

            // Determine if error is retryable
            const isRetryable = this.isRetryableError(response.status);

            if (!isRetryable) {
              // Don't retry for client errors (4xx except 429)
              throw new Error(`Bedrock API error (${response.status}): ${errorText}`);
            }

            // If retryable and not last attempt, continue to retry
            if (attempt < retries) {
              const waitTime = this.calculateBackoffDelay(attempt);
              console.log(`⏳ Retrying after ${waitTime}ms... (${retries - attempt} retries left)`);
              await this.sleep(waitTime);
              continue; // Retry
            }

            // Last attempt failed
            throw new Error(`Bedrock API error after ${retries} attempts (${response.status}): ${errorText}`);
          }

          const modelResponse = await response.json() as any;
          console.log('✓ Bedrock response received successfully');

          // Extract text based on model type
          let extractedResponse = '';
          
          if (this.modelId.includes('claude')) {
            // Claude 3.5 Sonnet response structure
            let fullResponse = '';

            // Extract main content
            if (modelResponse.content && Array.isArray(modelResponse.content)) {
              for (const block of modelResponse.content) {
                if (block.type === 'text') {
                  fullResponse += block.text;
                }
              }
            }

            extractedResponse = fullResponse || modelResponse.content[0]?.text || '';

          } else if (this.modelId.includes('titan')) {
            extractedResponse = modelResponse.results[0].outputText;

          } else if (this.modelId.includes('llama')) {
            extractedResponse = modelResponse.generation;
          } else {
            throw new Error('Unsupported model response format');
          }

          // Cache the successful response (store the extracted string)
          // this.apiCache.set(cacheKey, {
          //   response: extractedResponse,
          //   timestamp: Date.now()
          // });

          return extractedResponse;

        } catch (error) {
          lastError = error as Error;
          console.error(`❌ AWS Bedrock API attempt ${attempt} failed:`, error);

          // If not last attempt, retry
          if (attempt < retries) {
            const waitTime = this.calculateBackoffDelay(attempt);
            console.log(`⏳ Retrying after ${waitTime}ms... (${retries - attempt} retries left)`);
            await this.sleep(waitTime);
          }
        }
      }

      // All retries exhausted
      throw new Error(`AWS Bedrock API failed after ${retries} attempts: ${lastError?.message}`);

    })
  }

  /**
   * Determines if an HTTP status code is retryable
   */
  private isRetryableError(statusCode: number): boolean {
    // Retry on:
    // - 429 (Too Many Requests)
    // - 500-599 (Server Errors)
    // - 408 (Request Timeout)
    return statusCode === 429 || statusCode === 408 || (statusCode >= 500 && statusCode < 600);
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attempt: number): number {
    // Conservative backoff for AWS Bedrock rate limiting: 5s, 15s, 30s...
    const baseDelay = 5000; // 5 seconds
    const maxDelay = 60000; // 60 seconds max
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

    // Add jitter (random ±30%)
    const jitter = delay * 0.3 * (Math.random() - 0.5);
    return Math.floor(delay + jitter);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Batch multiple API calls to reduce rate limiting
   */
  private async batchBedrockCalls(requests: Array<{ prompt: string; systemPrompt?: string }>): Promise<string[]> {
    const results: string[] = [];

    // Process requests sequentially with delay between batches
    for (const request of requests) {
      try {
        const result = await this.callBedrock(request.prompt, request.systemPrompt);
        results.push(result);

        // Add delay between calls to avoid rate limiting
        if (requests.length > 1) {
          await this.sleep(1000); // 1 second delay between calls
        }
      } catch (error) {
        console.error(`❌ Batch API call failed:`, error);
        results.push(''); // Return empty string on failure
      }
    }

    return results;
  }

  /**
   * 🔐 AI-Powered Password Guessing with Retry Logic
   * Tries to guess PDF password using AI analysis with 3 attempts
   */
  async guessPasswordWithAI(
    filename: string,
    userData: any,
    pdfMetadata?: {
      extractedText?: string;
      errorMessage?: string;
      fileSize?: number;
    },
    maxAttempts: number = 3
  ): Promise<{
    success: boolean;
    passwords: string[];
    attempts: Array<{
      attemptNumber: number;
      passwords: string[];
      reasoning: string;
    }>;
    finalRecommendation?: string;
  }> {
    const attempts: Array<{
      attemptNumber: number;
      passwords: string[];
      reasoning: string;
    }> = [];

    console.log('\n' + '='.repeat(70));
    console.log('🤖 AI-POWERED PASSWORD GUESSING');
    console.log('='.repeat(70));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`\n🔄 Attempt ${attempt}/${maxAttempts}`);

      try {
        // Build context from previous attempts
        const previousAttemptsContext = attempts
          .map(
            (a) =>
              `Attempt ${a.attemptNumber}: Tried [${a.passwords.join(', ')}] - FAILED\nReasoning: ${a.reasoning}`
          )
          .join('\n\n');

        const prompt = `You are an expert PDF password cracker. Analyze the following information and suggest the MOST LIKELY passwords for this encrypted PDF.

═══════════════════════════════════════════════════════════
FILE INFORMATION
═══════════════════════════════════════════════════════════
Filename: ${filename}
File Size: ${pdfMetadata?.fileSize || 'Unknown'}
Error Message: ${pdfMetadata?.errorMessage || 'Password protected'}
Extracted Text Preview: ${pdfMetadata?.extractedText?.substring(0, 500) || 'None'}

═══════════════════════════════════════════════════════════
USER DATA AVAILABLE
═══════════════════════════════════════════════════════════
${JSON.stringify(userData, null, 2)}

═══════════════════════════════════════════════════════════
PREVIOUS FAILED ATTEMPTS (${attempts.length})
═══════════════════════════════════════════════════════════
${previousAttemptsContext || 'This is the first attempt'}

═══════════════════════════════════════════════════════════
ANALYSIS INSTRUCTIONS
═══════════════════════════════════════════════════════════

1. DETECT BANK/INSTITUTION from filename:
   - Look for bank names: SBI, HDFC, ICICI, Axis, Kotak, IDFC, IndusInd, Yes Bank, RBL, etc.
   - Look for institutions: LIC, IRCTC, EPF, NPS, mutual funds, insurance companies

2. ANALYZE DATE OF BIRTH FORMATS:
   ${userData.date_of_birth ? `
   User's DOB: ${userData.date_of_birth}
   Common DOB formats to try:
   - DDMMYYYY (e.g., 15061990)
   - DDMMYY (e.g., 150690)
   - YYYYMMDD (e.g., 19900615)
   - DD-MM-YYYY (e.g., 15-06-1990)
   - DD/MM/YYYY (e.g., 15/06/1990)
   - YYYY (just year, e.g., 1990)
   - MMDDYYYY (US format)
   - Reverse formats: MMDDYY, YYMMDD
   ` : 'DOB not available'}

3. BANK-SPECIFIC PASSWORD PATTERNS:
   - SBI: Usually account number or mobile number
   - HDFC: Customer ID, name+card_last_4
   - ICICI: name(4 chars) + DDMM from DOB
   - Axis: name(4 chars) + account_last_4
   - IDFC: DDMMYYYY or DDMMYY format
   - Kotak: CRN number
   - LIC: Policy number or DOB variants
   - EPF: UAN number or DOB
   - NPS: PRAN number
   
4. COMMON PATTERNS:
   - First 4 letters of name + DOB
   - Account number or last 4 digits
   - PAN number (uppercase/lowercase)
   - Phone number (last 10 or 4 digits)
   - Customer ID / CRN
   - Common passwords: password, 123456, 0000, 1111

5. ANALYZE PREVIOUS FAILURES:
   ${attempts.length > 0 ? `
   - What patterns were already tried?
   - What variations are still untested?
   - What alternative formats should we explore?
   - Consider case sensitivity, special characters, spacing
   - Try combining fields differently
   - Consider typos or alternate spellings
   ` : 'No previous attempts to analyze'}

6. SPECIAL CONSIDERATIONS:
   - Check if filename/error message hints at password format
   - Some PDFs use UPPERCASE, some lowercase, some mixed
   - Special characters like @, #, _, - might be used
   - Spaces might be part of password
   - Sometimes password is empty string ""
   - Bank name or institution name might be part of password

═══════════════════════════════════════════════════════════
RESPONSE FORMAT (JSON ONLY)
═══════════════════════════════════════════════════════════

Return ONLY valid JSON in this exact format:

{
  "passwords": [
    "password1",
    "password2",
    "password3",
    "password4",
    "password5"
  ],
  "reasoning": "Detailed explanation of why these passwords were chosen, what patterns were considered, and why they are likely to work based on the available data and previous failures.",
  "confidence": 85,
  "recommendedNext": "If this attempt fails, suggest what to try next"
}

IMPORTANT:
- Return 5-10 UNIQUE passwords (most likely first)
- DO NOT repeat passwords from previous attempts
- Focus on UNTESTED variations
- Prioritize based on bank/institution patterns
- Consider DOB format variations thoroughly
- Return ONLY JSON, no additional text

Begin analysis now:`;

        const response = await this.callBedrock(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          console.error('❌ Failed to parse AI response');

          // Use fallback on parse failure
          const fallbackPasswords = this.generateFallbackPasswords(userData, attempt);
          attempts.push({
            attemptNumber: attempt,
            passwords: fallbackPasswords,
            reasoning: 'AI response parsing failed, using fallback strategy',
          });
          continue;
        }

        const aiResult = JSON.parse(jsonMatch[0]);

        // Filter out passwords that were already tried
        const alreadyTried = new Set(
          attempts.flatMap((a) => a.passwords.map(p => p.toLowerCase()))
        );
        const newPasswords = aiResult.passwords.filter(
          (p: string) => !alreadyTried.has(p.toLowerCase())
        );

        if (newPasswords.length === 0) {
          console.log('⚠️ AI suggested no new passwords, using fallback');
          const fallbackPasswords = this.generateFallbackPasswords(userData, attempt);
          attempts.push({
            attemptNumber: attempt,
            passwords: fallbackPasswords,
            reasoning: 'AI suggested already-tried passwords, using fallback',
          });
          continue;
        }

        attempts.push({
          attemptNumber: attempt,
          passwords: newPasswords,
          reasoning: aiResult.reasoning,
        });

        console.log(`\n💡 AI Reasoning:\n${aiResult.reasoning}`);
        console.log(`\n🔑 Suggested Passwords (${newPasswords.length}):`);
        newPasswords.forEach((p: string, i: number) => {
          console.log(`   ${i + 1}. ${p}`);
        });
        console.log(`\n📊 Confidence: ${aiResult.confidence}%`);
        if (aiResult.recommendedNext) {
          console.log(`\n💭 Next Recommendation: ${aiResult.recommendedNext}`);
        }

      } catch (error) {
        console.error(`❌ Error in attempt ${attempt}:`, error);

        // Add fallback attempt on error
        const fallbackPasswords = this.generateFallbackPasswords(userData, attempt);
        attempts.push({
          attemptNumber: attempt,
          passwords: fallbackPasswords,
          reasoning: `AI call failed: ${(error as Error).message}, using fallback strategy ${attempt}`,
        });
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log(`✅ Completed ${attempts.length} password guessing attempts`);
    console.log('='.repeat(70));

    // Collect all unique passwords across all attempts
    const allPasswords = Array.from(
      new Set(attempts.flatMap((a) => a.passwords))
    );

    console.log(`\n📊 Total Unique Passwords Generated: ${allPasswords.length}`);

    const result: {
      success: boolean;
      passwords: string[];
      attempts: Array<{
        attemptNumber: number;
        passwords: string[];
        reasoning: string;
      }>;
      finalRecommendation?: string;
    } = {
      success: allPasswords.length > 0,
      passwords: allPasswords,
      attempts,
    };

    if (attempts.length === maxAttempts) {
      result.finalRecommendation = 'All AI attempts exhausted. Consider: 1) Asking user for password, 2) Checking if PDF is actually password protected, 3) Verifying user data completeness, 4) Trying manual password entry';
    }

    return result;
  }

  /**
   * Generate fallback passwords when AI fails
   */
  private generateFallbackPasswords(userData: any, attempt: number): string[] {
    const passwords: string[] = [];

    // Different strategies for each attempt
    switch (attempt) {
      case 1:
        // First attempt: Standard DOB and account patterns
        if (userData.date_of_birth) {
          const dob = new Date(userData.date_of_birth);
          const dd = String(dob.getDate()).padStart(2, '0');
          const mm = String(dob.getMonth() + 1).padStart(2, '0');
          const yyyy = String(dob.getFullYear());
          const yy = yyyy.slice(-2);

          passwords.push(
            `${dd}${mm}${yyyy}`,
            `${dd}${mm}${yy}`,
            yyyy,
            `${yyyy}${mm}${dd}`,
            `${mm}${dd}${yyyy}`
          );
        }
        if (userData.account_number) {
          passwords.push(
            String(userData.account_number),
            String(userData.account_number).slice(-4)
          );
        }
        if (userData.phone) {
          const cleaned = userData.phone.replace(/\D/g, '');
          passwords.push(
            cleaned.slice(-10),
            cleaned.slice(-4)
          );
        }
        break;

      case 2:
        // Second attempt: Name combinations with DOB/Account
        if (userData.name) {
          const name4Lower = userData.name.substring(0, 4).toLowerCase();
          const name4Upper = userData.name.substring(0, 4).toUpperCase();
          const name4Title = name4Lower.charAt(0).toUpperCase() + name4Lower.slice(1);

          if (userData.date_of_birth) {
            const dob = new Date(userData.date_of_birth);
            const dd = String(dob.getDate()).padStart(2, '0');
            const mm = String(dob.getMonth() + 1).padStart(2, '0');

            passwords.push(
              `${name4Lower}${dd}${mm}`,
              `${name4Upper}${dd}${mm}`,
              `${name4Title}${dd}${mm}`,
              `${name4Lower}${mm}${dd}`,
              `${name4Upper}${mm}${dd}`
            );
          }

          if (userData.account_number) {
            const last4 = String(userData.account_number).slice(-4);
            passwords.push(
              `${name4Lower}${last4}`,
              `${name4Upper}${last4}`,
              `${name4Title}${last4}`
            );
          }
        }

        if (userData.pan_number) {
          passwords.push(
            userData.pan_number.toUpperCase(),
            userData.pan_number.toLowerCase()
          );
        }

        if (userData.customer_id || userData.crn_number) {
          passwords.push(
            String(userData.customer_id || userData.crn_number)
          );
        }
        break;

      case 3:
        // Third attempt: Special characters, reverse patterns, and defaults
        if (userData.date_of_birth) {
          const dob = new Date(userData.date_of_birth);
          const dd = String(dob.getDate()).padStart(2, '0');
          const mm = String(dob.getMonth() + 1).padStart(2, '0');
          const yyyy = String(dob.getFullYear());
          const yy = yyyy.slice(-2);

          passwords.push(
            `${dd}-${mm}-${yyyy}`,
            `${dd}/${mm}/${yyyy}`,
            `${yyyy}-${mm}-${dd}`,
            `${dd}.${mm}.${yyyy}`,
            `${yy}${mm}${dd}`,
            `${mm}${yy}`
          );
        }

        // Policy/Folio numbers
        if (userData.policy_number) {
          passwords.push(String(userData.policy_number));
        }
        if (userData.folio_number) {
          passwords.push(String(userData.folio_number));
        }

        // IFSC code
        if (userData.ifsc_code) {
          passwords.push(
            userData.ifsc_code.toUpperCase(),
            userData.ifsc_code.toLowerCase()
          );
        }

        // Aadhar (last 4 digits)
        if (userData.aadhar_number) {
          passwords.push(
            String(userData.aadhar_number).replace(/\D/g, '').slice(-4)
          );
        }

        // Common defaults
        passwords.push(
          '',
          'password',
          'Password',
          '123456',
          '12345678',
          '0000',
          '1111',
          '1234'
        );
        break;
    }

    // Remove empty/null/undefined and return unique
    return Array.from(new Set(passwords.filter(Boolean)));
  }


  /**
 * Classify email subjects and return only financial email IDs
 * Single AI call for batch classification - reduces token usage
 * 
 * @param emailDataArray - Array of email data
 * @returns Array of financial email IDs
 */
  /**
  * Classify email subjects and return only MAJOR financial email IDs
  * Filters out:
  * - Marketing/promotional emails (plan purchases, platform offers)
  * - Small casual transactions (UPI, small transfers)
  * - Non-critical financial data
  * 
  * Keeps only:
  * - Bank statements, account summaries
  * - Assets (investments, real estate, business)
  * - Liabilities (loans, credit cards, EMI)
  * - Insurance (policies, premiums)
  * - Mutual funds, stocks, investments
  * - Major transactions
  */
  async classifyEmailSubjects(
    emailDataArray: EmailMessage[]
  ): Promise<string[]> {
    try {
      const subjects = emailDataArray
        .map((email, index) => `${index}. ${email.subject}`)
        .join('\n');

      const prompt = `Analyze these email subjects and identify which ones contain MAJOR FINANCIAL data that needs tracking.

INCLUDE:
- Bank statements, account summaries, account confirmations
- Investment statements (mutual funds, stocks, ETF, SIP, NPS)
- Insurance policies, premiums, maturity notifications
- Loan documents, loan statements, EMI reminders (not payment confirmations)
- Asset acquisition/sale documents (real estate, property, business)
- Tax documents (ITR, tax return, 1099, Form 16, TDS)
- Liabilities (credit card statements, outstanding balances)
- Income documents (salary slips, bonus, commission)
- Loan applications, approvals, sanctions letters

EXCLUDE:
- Marketing emails (Vercel, AWS, cloud platforms offering plans/discounts)
- Plan purchase offers or promotional campaigns
- Small casual transactions (UPI payments, app transfers, wallet recharges)
- Shopping receipts for small purchases
- Email receipts for digital services
- Confirmation emails for subscription plan changes
- Notification emails (password reset, login alerts)
- Food delivery, ride sharing, casual purchases
- Entertainment, streaming, utilities bills (unless it's major liability tracking)

Email Subjects:
${subjects}

Return ONLY a JSON array with JUST the indices of MAJOR financial emails:
["0", "2", "5"]

Only return indices of emails with MAJOR financial data. Return empty array [] if none qualify.`;

      const response = await this.callBedrock(prompt);
      const jsonMatch = response.match(/\[[\s\S]*?\]/);

      if (!jsonMatch) {
        console.log('⚠️ Could not parse classification response');
        return [];
      }

      const financialIndices: string[] = JSON.parse(jsonMatch[0]);

      // Convert indices to email IDs
      const financialEmailIds = financialIndices
        .map(index => {
          const idx = parseInt(index);
          return emailDataArray[idx]?.id;
        })
        .filter((id): id is string => id !== undefined);

      console.log(
        `✅ Found ${financialEmailIds.length} major financial emails out of ${emailDataArray.length}`
      );

      if (financialEmailIds.length < emailDataArray.length) {
        console.log(
          `⏭️  Filtered out ${emailDataArray.length - financialEmailIds.length} non-critical emails`
        );
      }

      return financialEmailIds;
    } catch (error) {
      console.error('❌ Error classifying email subjects:', error);
      return [];
    }
  }

  /**
 * Enhanced local filtering for marketing and non-financial emails
 */
  private isMarketingOrCasualEmail(emailData: EmailMessage): boolean {
    const subject = (emailData.subject || '').toLowerCase();
    const body = (emailData.preview || '').toLowerCase();
    const sender = (emailData.from || '').toLowerCase();

    // === MARKETING/PLATFORM EMAILS ===
    const marketingPatterns = [
      // Cloud platforms & deployment services
      'vercel', 'render', 'fylo', 'aws', 'azure', 'heroku', 'railway',
      'netlify', 'firebase', 'digital ocean', 'linode', 'vultr',

      // Payment & financial services platforms (not bank/actual financial)
      'stripe', 'razorpay', 'paypal billing', 'square',
      'twilio', 'sendgrid', 'mailgun',

      // SaaS & subscription services
      'upgrade to', 'plan', 'pricing', 'discount', 'offer', 'promotion',
      'limited offer', 'save now', 'get started', 'try for free',
      'special deal', 'exclusive offer', 'claim your',
      'activate', 'welcome to', 'get up and running',
      '30 days free', 'free trial', 'standard support',

      // Generic marketing
      'activate', 'welcome aboard', 'help you get started',
      'scaling', 'cloud platform', 'deploy faster'
    ];

    // === SMALL/CASUAL TRANSACTIONS ===
    const casualTransactionPatterns = [
      // Digital wallets & casual payments
      'upi', 'wallet', 'recharge', 'paytm', 'gpay', 'phonepay',
      'small transfer', 'money transfer', 'quick payment',
      'app recharge', 'subscription charged',
      'amazon pay', 'airtel payments',

      // Food & delivery
      'food delivery', 'uber eats', 'zomato', 'swiggy',
      'doordash', 'grubhub', 'order delivered',

      // Ride sharing & casual services
      'uber', 'ola', 'lyft', 'taxi',

      // Entertainment & casual
      'streaming', 'netflix', 'spotify', 'youtube',
      'movie ticket', 'bookMyShow',

      // Small shopping
      'order confirmed', 'shipment', 'delivery', 'tracking',
      'amazon', 'flipkart', 'ebay'
    ];

    // Check marketing patterns
    for (const pattern of marketingPatterns) {
      if (subject.includes(pattern) || body.includes(pattern)) {
        console.log(`🔥 Filtered (Marketing): ${subject}`);
        return true;
      }
    }

    // Check casual transaction patterns
    for (const pattern of casualTransactionPatterns) {
      if (subject.includes(pattern) || body.includes(pattern)) {
        console.log(`💳 Filtered (Casual): ${subject}`);
        return true;
      }
    }

    return false;
  }


  /**
   * Check if email is MAJOR financial only
   */
  private isMajorFinancialEmail(emailData: EmailMessage): boolean {
    const subject = (emailData.subject || '').toLowerCase();
    const body = (emailData.preview || '').toLowerCase();

    // === MAJOR FINANCIAL ONLY ===
    const majorFinancialPatterns = [
      // Bank statements
      'statement', 'account summary', 'bank account',

      // Credit cards (actual statements, not small purchases)
      'credit card statement', 'card statement', 'cc statement',
      'outstanding balance', 'credit limit',

      // Loans
      'loan statement', 'loan emi', 'home loan', 'car loan',
      'personal loan', 'education loan', 'business loan',
      'emi due', 'loan disbursement', 'loan approval',

      // Insurance
      'policy statement', 'insurance premium', 'policy renewal',
      'life insurance', 'health insurance', 'insurance claim',
      'coverage', 'sum assured', 'maturity',

      // Investments & mutual funds
      'mutual fund', 'mf statement', 'portfolio statement',
      'investment statement', 'stock statement',
      'sip', 'nps statement', 'ppf',
      'dividend', 'dividend reinvestment',

      // Income & tax
      'salary slip', 'payslip', 'income certificate',
      'tax return', 'form 16', 'itr', '1099', 'w2',
      'tds', 'tax', 'income tax',

      // Major transactions & assets
      'property purchase', 'real estate', 'deed',
      'business registration', 'company formation',
      'cryptocurrency', 'digital asset',

      // Financial statements
      'balance sheet', 'p&l', 'profit loss',
      'financial statement', 'annual report',

      // Bank notifications (critical only)
      'fund transfer', 'large withdrawal', 'account alert',
      'suspicious activity', 'security alert'
    ];

    for (const pattern of majorFinancialPatterns) {
      if (subject.includes(pattern) || body.includes(pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Classify with multiple layers of filtering
   */
  async classifyEmailSubjectsWithFiltering(
    emailDataArray: EmailMessage[]
  ): Promise<string[]> {
    try {
      console.log(`🔍 Starting classification for ${emailDataArray.length} emails...\n`);

      // Step 1: Local pre-filtering (remove obvious marketing/casual)
      const afterLocalFilter = emailDataArray.filter(email => {
        const isMarketing = this.isMarketingOrCasualEmail(email);
        if (isMarketing) {
          console.log(`  ❌ Filtered (${email.from}): "${email.subject}"`);
        }
        return !isMarketing;
      });

      console.log(
        `\n📊 After local filter: ${emailDataArray.length} → ${afterLocalFilter.length}\n`
      );

      if (afterLocalFilter.length === 0) {
        console.log('⚠️ All emails filtered as marketing/casual');
        return [];
      }

      // Step 2: Check if remaining emails are major financial
      const majorFinancialEmails = afterLocalFilter.filter(email => {
        const isMajor = this.isMajorFinancialEmail(email);
        if (isMajor) {
          console.log(`  ✅ Major Financial: "${email.subject}"`);
        }
        return isMajor;
      });

      console.log(
        `\n💰 Major financial emails: ${majorFinancialEmails.length}\n`
      );

      if (majorFinancialEmails.length === 0) {
        console.log('⚠️ No major financial emails found');
        return [];
      }

      // Step 3: AI classification for final confirmation (optional, for edge cases)
      const aiConfirmed = await this.classifyEmailSubjects(majorFinancialEmails);

      console.log(
        `✅ Final after AI filtering: ${aiConfirmed.length} emails\n`
      );

      return aiConfirmed;
    } catch (error) {
      console.error('❌ Error in filtered classification:', error);
      return [];
    }
  }

  /**
 * ✅ NEW METHOD: Compare extracted user fields with existing user data
 * Returns array of missing field names
 */
  private async checkMissingUserFields(
    userId: string,
    requiredFields: {
      name?: boolean;
      phone?: boolean;
      email?: boolean;
      address?: boolean;
      pan_number?: boolean;
      aadhar_number?: boolean;
      date_of_birth?: boolean;
      crn_number?: boolean;
      account_number?: boolean;
      ifsc_code?: boolean;
      policy_number?: boolean;
      folio_number?: boolean;
    }
  ): Promise<string[]> {
    try {
      // Fetch user profile from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        // select: {
        //   name: true,
        //   phone: true,
        //   email: true,
        //   address: true,
        //   pan_number: true,
        //   aadhar_number: true,
        //   date_of_birth: true,
        //   crn_number: true,
        //   account_number: true,  // ✅ Correct: snake_case
        //   pran_number:true,

        // },
      });

      if (!user) {
        console.warn(`⚠️ User not found: ${userId}`);
        return [];
      }

      const missingFields: string[] = [];

      // Map of required fields to user profile fields
      const fieldMap: Record<string, keyof typeof user> = {
        name: 'name',
        phone: 'phone',
        email: 'email',
        address: 'address',
        'pan_number': 'pan_number',
        'aadhar_number': 'aadhar_number',
        'date_of_birth': 'date_of_birth',
        'crn_number': 'crn_number',
        'account_number': 'account_number',
      };

      // Check each required field
      Object.entries(requiredFields).forEach(([field, isRequired]) => {
        if (isRequired === true) {
          const userField = fieldMap[field];

          // If field is required but user doesn't have it
          if (userField && !user[userField]) {
            missingFields.push(field);
            console.log(`📋 Missing: ${field} (required but not in profile)`);
          }
        }
      });

      if (missingFields.length > 0) {
        console.log(`⚠️ Total missing fields: ${missingFields.length}`, missingFields);
      } else {
        console.log('✅ All required fields present in user profile');
      }

      return missingFields;
    } catch (error) {
      console.error('❌ Error checking missing fields:', error);
      return [];
    }
  }


  /**
   * Safe wrapper for classification with local filtering
   */
  // async classifyEmailSubjectsWithFiltering(
  //   emailDataArray: EmailMessage[]
  // ): Promise<string[]> {
  //   try {
  //     // Step 1: Local filtering to remove obvious marketing/casual emails
  //     const filteredEmails = emailDataArray.filter(
  //       email => !this.isMarketingOrCasualEmail(email)
  //     );

  //     if (filteredEmails.length === 0) {
  //       console.log('⚠️ All emails filtered as marketing/casual');
  //       return [];
  //     }

  //     console.log(
  //       `📊 Local filtering: ${emailDataArray.length} → ${filteredEmails.length}`
  //     );

  //     // Step 2: AI classification for remaining emails
  //     const aiFiltered = await this.classifyEmailSubjects(filteredEmails);

  //     return aiFiltered;
  //   } catch (error) {
  //     console.error('❌ Error in filtered classification:', error);
  //     return [];
  //   }
  // }



  /**
   * Analyze financial email and extract transaction data
   */
  async analyzeFinancialEmail(
    data: FinancialAnalysisRequest,
    userId: string
  ): Promise<AnalysisResult> {
    try {
      const prompt = `You are an expert financial document analyzer. Analyze this email and extract all financial information with proper categorization.

⚠️ CRITICAL INSTRUCTION: Extract and return EXACT VALUES from the document. DO NOT mask, hide, or replace any numbers with XXX or asterisks. Return COMPLETE account numbers, amounts, and all other financial details EXACTLY as they appear in the document.

Subject: ${data.subject}
From: ${data.sender}
Content: ${data.emailContent}
Attachments: ${data.attachmentContents
          ?.map(
            (att) =>
              `${att.filename} (${att.mimeType}, ${att.size} bytes, content: ${att.content.substring(0, 1000)}...)`
          )
          .join(', ') || 'None'}

CLASSIFICATION RULES:

🎯 MAIN CATEGORIES (type field):

1. ASSET - Things owned with value:
   Sub-types:
   - Cash, savings, checking account, fixed deposits, money market funds
   - Stocks, bonds, mutual funds, ETF, SIP, PPF, NPS, 401k, retirement accounts
   -  House, land, commercial property, rental property, real estate investment
   -  Car, bike, commercial vehicle, automobile
   - Gold, silver, platinum holdings, gold bonds
   -  Business ownership, partnership shares, equity stake
   -  Cryptocurrency, NFT, domain names, digital properties
   - Money owed to you, loans given, security deposits refundable

2. LIABILITY - Money owed to others:
   Sub-types:
   - home_loan: Mortgage, home equity loan, property loan
   - vehicle_loan: Car loan, bike loan, auto finance, two-wheeler loan
   - personal_loan: Unsecured personal loan, peer loan, consumer loan
   - credit_card: Credit card debt, outstanding balance, revolving credit
   - education_loan: Student loan, education financing, study loan
   - business_loan: Business credit, commercial loan, working capital loan
   - medical_debt: Hospital bills, medical financing, healthcare loans
   - utility_bill: Electricity, water, gas, internet, phone, DTH, broadband
   - tax_liability: Income tax, property tax, GST, TDS, advance tax
   - emi: EMI payments for any purchase, installment payments
   - payable: Money you owe, vendor payments, dues, outstanding payments

3. INSURANCE - Risk protection policies:
   Sub-types:
   - life_insurance: Term, whole life, endowment, ULIP, money-back policy
   - health_insurance: Medical, hospitalization, family floater, mediclaim
   - vehicle_insurance: Car insurance, bike insurance (comprehensive/third-party)
   - home_insurance: Property insurance, fire insurance, earthquake coverage
   - travel_insurance: International travel, domestic travel insurance
   - business_insurance: Professional indemnity, liability insurance, business coverage
   - critical_illness: Cancer care, heart disease coverage, critical illness rider
   - accident_insurance: Personal accident, disability insurance
   - liability_insurance: Public liability, professional liability

📋 STATUS VALUES:
- active: Currently active/running
- inactive: Closed/matured/completed
- complete: Fully paid/matured
- missing: Information incomplete

🔍 EXTRACT ALL FIELDS AND RETURN JSON:

⚠️ IMPORTANT: Return EXACT VALUES from the document:
- accountNumber: Return FULL account number as-is (e.g., "1234567890123456", NOT "XXXX-XXXX-XXXX-1234")
- amount: Return EXACT amount (e.g., 15000.50, NOT "XXXX")
- policyNumber: Return FULL policy number as-is
- folioNumber: Return FULL folio number as-is
- bankName: Return FULL bank name
- ifscCode: Return FULL IFSC code
- ALL OTHER FIELDS: Return EXACT values from the document without any masking or hiding

{
  "transactionType": "invoice|payment|receipt|statement|bill|tax|credit_card|other",
  "amount": number or null (EXACT amount from document, no masking),
  "currency": "USD|INR|EUR|GBP|etc",
  "merchant": "company/bank/institution name (FULL name, no abbreviations)",
  "description": "detailed description of transaction",
  "date": "YYYY-MM-DD",
  "accountNumber": "FULL account/reference number (NO masking, return complete number)",
  "confidence": 0-100,
  
  "assetCategory": "asset|liability|insurance",
  "assetType": "detailed type from above list",
  "assetSubType": "more specific classification if applicable",
  "status": "active|inactive|complete|missing",
  
  "bankName": "bank/institution name",
  "ifscCode": "IFSC code if available",
  "branchName": "branch name if available",
  "policyNumber": "for insurance policies",
  "folioNumber": "for mutual funds/insurance",
  "fundName": "for mutual funds/investment schemes",
  
  "financialMetadata": {
    "totalValue": number,
    "currentValue": number,
    "isRecurring": true/false,
    "frequency": "monthly|quarterly|yearly|one-time",
    "dueDate": "YYYY-MM-DD",
    
    // Insurance fields
    "coverageAmount": number,
    "premium": number,
    "premiumFrequency": "monthly|quarterly|yearly",
    "maturityDate": "YYYY-MM-DD",
    "sumAssured": number,
    "policyTerm": number in years,
    "beneficiary": "beneficiary name",
    
    // Liability fields
    "outstandingBalance": number,
    "minimumPayment": number,
    "creditLimit": number,
    "interestRate": number,
    "emiAmount": number,
    "emiDueDate": "YYYY-MM-DD",
    
    // Investment fields
    "purchasePrice": number,
    "currentNav": number,
    "units": number,
    "returnsPercentage": number,
    "appreciationRate": number
  },
  
  "keyPoints": [
    "Key finding 1",
    "Key finding 2",
    "Key finding 3"
  ]
}

📝 EXAMPLES:

Example 1 - Credit Card Bill:
{
  "transactionType": "bill",
  "amount": 15000,
  "currency": "INR",
  "merchant": "HDFC Bank",
  "description": "Credit card statement for September 2025",
  "date": "2025-09-28",
  "accountNumber": "4532123456789012",
  "confidence": 95,
  "assetCategory": "liability",
  "assetType": "credit_card",
  "assetSubType": "outstanding_balance",
  "status": "active",
  "bankName": "HDFC Bank",
  "financialMetadata": {
    "isRecurring": true,
    "frequency": "monthly",
    "outstandingBalance": 15000,
    "minimumPayment": 750,
    "creditLimit": 100000,
    "dueDate": "2025-10-15"
  },
  "keyPoints": [
    "Account Number: 4532123456789012",
    "Outstanding balance: ₹15,000",
    "Minimum payment due: ₹750",
    "Payment due by: Oct 15, 2025",
    "Credit limit: ₹100,000"
  ]
}

Example 2 - Life Insurance Policy:
{
  "transactionType": "payment",
  "amount": 24000,
  "currency": "INR",
  "merchant": "LIC India",
  "description": "Annual premium payment for term insurance",
  "date": "2025-10-01",
  "accountNumber": null,
  "confidence": 90,
  "assetCategory": "insurance",
  "assetType": "life_insurance",
  "assetSubType": "term_plan",
  "status": "active",
  "policyNumber": "LIC123456789",
  "financialMetadata": {
    "isRecurring": true,
    "frequency": "yearly",
    "coverageAmount": 10000000,
    "premium": 24000,
    "premiumFrequency": "yearly",
    "sumAssured": 10000000,
    "policyTerm": 30,
    "maturityDate": "2050-10-01",
    "beneficiary": "Spouse"
  },
  "keyPoints": [
    "Term insurance with ₹1 Crore coverage",
    "Annual premium: ₹24,000",
    "Policy valid until 2050"
  ]
}

Example 3 - Mutual Fund Statement:
{
  "transactionType": "statement",
  "amount": null,
  "currency": "INR",
  "merchant": "Axis Mutual Fund",
  "description": "Monthly statement for Axis Bluechip Fund",
  "date": "2025-10-31",
  "accountNumber": null,
  "confidence": 92,
  "assetCategory": "asset",
  "assetType": "investment",
  "assetSubType": "mutual_fund",
  "status": "active",
  "folioNumber": "12345678",
  "fundName": "Axis Bluechip Fund - Direct Growth",
  "financialMetadata": {
    "totalValue": 250000,
    "currentValue": 250000,
    "purchasePrice": 200000,
    "currentNav": 45.50,
    "units": 5494.505,
    "returnsPercentage": 25.0,
    "appreciationRate": 25.0
  },
   "requiredUserFields": {
    "name": boolean,
    "phone": boolean,
    "email": boolean,
    "address": boolean,
    "pan_number": boolean,
    "aadhar_number": boolean,
    "date_of_birth": boolean,
    "crn_number": boolean,
    "account_number": boolean,
    "ifsc_code": boolean,
    "policy_number": boolean,
    "folio_number": boolean
  },
  "keyPoints": [
    "Current investment value: ₹2,50,000",
    "Total returns: 25% (₹50,000 gain)",
    "Units held: 5494.505"
  ]
}

Example 4 - Home Loan EMI:
{
  "transactionType": "payment",
  "amount": 35000,
  "currency": "INR",
  "merchant": "SBI Home Loans",
  "description": "Monthly EMI payment for home loan",
  "date": "2025-11-05",
  "accountNumber": "SBIH123456789",
  "confidence": 95,
  "assetCategory": "liability",
  "assetType": "home_loan",
  "assetSubType": "mortgage",
  "status": "active",
  "bankName": "State Bank of India",
  "branchName": "Connaught Place, New Delhi",
  "financialMetadata": {
    "isRecurring": true,
    "frequency": "monthly",
    "outstandingBalance": 5000000,
    "emiAmount": 35000,
    "interestRate": 8.5,
    "emiDueDate": "2025-11-05"
  },
  "keyPoints": [
    "Monthly EMI: ₹35,000",
    "Outstanding principal: ₹50,00,000",
    "Interest rate: 8.5% p.a."
  ]
}

IMPORTANT: In "requiredUserFields", identify which personal/account fields are REQUIRED or MENTIONED in the email/attachments. Set to true if the field is required/requested, false otherwise. Example: If email asks for CRN number, set "crn_number": true.
ALL DATE in the form YYYY-MM-DD

Now analyze the provided email and return structured JSON:`;

      const response = await this.callBedrock(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        console.log('No JSON found, using fallback analysis');
        return this.fallbackFinancialAnalysis(data);
      }

      // Parse attachment analysis separately
      let attachmentAnalyses: any[] = [];
      if (data.attachmentContents && data.attachmentContents.length > 0) {
        for (const att of data.attachmentContents) {
          const attAnalysis = await this.analyzePDFDocument({
            text: att.content,
            documentType: data.documentType || 'financial',
          });
          attachmentAnalyses.push(attAnalysis);
        }
      }

      const extracted: EnhancedFinancialData = JSON.parse(jsonMatch[0]);
      const requiredFields = await this.checkMissingUserFields(
        userId,
        extracted.requiredUserFields || {}
      );


      const issues = await this.validateExtractedData(extracted, data.attachmentContents!);
      // console.log('extracted.requiredUserFields :: ', extracted.requiredUserFields);


      // console.log('requiredFields :: ', requiredFields)

      if (issues.length > 0) {
        console.log('⚠️ Validation Issues Found:', issues);
      } else {
        console.log('✅ No validation issues detected');
      }

      return {
        success: true,
        extractedData: {
          // Basic transaction data
          transactionType: extracted.transactionType || 'other' as any,
          // amount: extracted.amount,
          currency: extracted.currency || 'INR',
          merchant: extracted.merchant,
          description: extracted.description,
          date: extracted.date,
          accountNumber: extracted.accountNumber!,
          confidence: extracted.confidence || 50,

          // Enhanced classification
          assetCategory: (extracted.assetCategory as any),
          assetType: extracted.assetType!,
          assetSubType: extracted.assetSubType!,
          status: extracted.status || 'active',

          // Bank details
          bankName: extracted.bankName,
          ifscCode: extracted.ifscCode,
          branchName: extracted.branchName,

          // Insurance/Investment specific
          policyNumber: extracted.policyNumber,
          folioNumber: extracted.folioNumber,
          fundName: extracted.fundName,

          // Complete metadata
          financialMetadata: extracted.financialMetadata || {},
          balance: extracted.financialMetadata?.currentValue ||
            extracted.financialMetadata?.outstandingBalance ||
            extracted.amount, // fallback
          total_value: extracted.financialMetadata?.totalValue ||
            extracted.financialMetadata?.coverageAmount ||
            extracted.amount, // fallback
        } as any,
        keyPoints: extracted.keyPoints || [],
        summary: this.generateSmartSummary(extracted),
        attachmentAnalyses,
        issues,
        required_fields: requiredFields,
        extracted_content: extracted
      };
    } catch (error) {
      console.error('Error analyzing financial email:', error);
      return this.fallbackFinancialAnalysis(data);
    }
  }


  /**
 * Validates extracted financial data and returns list of issues
 */
  /**
 * AI-powered file content analysis for detecting document-level issues
 */
  private async analyzeFileContentIssues(
    fileContent: string,
    fileName: string,
    mimeType: string
  ): Promise<string[]> {
    const contentIssues: string[] = [];

    try {
      // Check for common error indicators in content [web:11][web:18]
      const errorPatterns = {
        passwordProtected: [
          'password',
          'encrypted',
          'protected',
          'incorrect password',
          'enter password',
          'password required',
          'authentication required',
          'user password',
          'owner password',
        ],
        corruptFile: [
          'corrupt',
          'damaged',
          'incomplete',
          'invalid file',
          'file error',
          'parsing error',
          'cannot read',
          'unreadable',
          'broken',
          'malformed',
        ],
        ocrErrors: [
          'poor quality',
          'low resolution',
          'blurry',
          'unrecognizable',
          'extraction failed',
          'ocr error',
          'cannot extract text',
        ],
        permissionErrors: [
          'access denied',
          'permission denied',
          'not allowed',
          'restricted',
          'printing not available',
          'copying disabled',
        ],
      };

      const contentLower = fileContent.toLowerCase();

      // Pattern matching for common errors [web:11][web:15][web:18]
      for (const [category, patterns] of Object.entries(errorPatterns)) {
        for (const pattern of patterns) {
          if (contentLower.includes(pattern.toLowerCase())) {
            switch (category) {
              case 'passwordProtected':
                contentIssues.push('File is password protected or encrypted');
                break;
              case 'corruptFile':
                contentIssues.push('File appears to be corrupt or incomplete');
                break;
              case 'ocrErrors':
                contentIssues.push('OCR extraction quality is poor or failed');
                break;
              case 'permissionErrors':
                contentIssues.push('File has permission restrictions');
                break;
            }
            break;
          }
        }
      }

      // Check content length [web:16]
      if (fileContent.length < 50) {
        contentIssues.push('File content is too short - possible extraction failure');
      }

      // Check for gibberish/binary content [web:19]
      const nonPrintableChars = fileContent.match(/[^\x20-\x7E\n\r\t]/g);
      if (nonPrintableChars && nonPrintableChars.length > fileContent.length * 0.3) {
        contentIssues.push('File contains excessive binary/non-readable characters');
      }

      // AI-powered content analysis [web:21][web:24][web:25]
      const aiContentPrompt = `You are a document quality analyzer. Analyze this file content and detect ALL issues.

File Name: ${fileName}
MIME Type: ${mimeType}
Content Preview: ${fileContent.substring(0, 2000)}

🔍 DETECT AND RETURN ALL ISSUES AS JSON ARRAY:

Common issues to check [web:16][web:19][web:28]:
1. Password protected/encrypted files
2. Corrupt or incomplete files
3. Poor OCR quality (blurry, unreadable text)
4. Parsing errors
5. Permission/access restrictions
6. Invalid file format
7. Missing critical data
8. Garbled/corrupted text
9. Incomplete extraction
10. File size issues
11. Format conversion errors
12. Character encoding problems
13. Scanned document quality issues (skew, noise, dark/light)
14. Handwriting recognition failures
15. Table extraction errors
16. Missing pages or sections
17. Watermark interference
18. Image quality issues in scanned PDFs
19. Date parsing failures
20. Currency symbol errors
21. Special character misinterpretation
22. Multiple languages mixing
23. Header/footer extraction issues
24. Signature/stamp recognition problems
25. Barcode/QR code reading failures

Return ONLY a JSON array of detected issues:
{
  "issues": [
    "Issue description 1",
    "Issue description 2"
  ]
}

If NO issues found, return: {"issues": []}
`;

      const aiResponse = await this.callBedrock(aiContentPrompt);
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const aiResult = JSON.parse(jsonMatch[0]);
        if (aiResult.issues && Array.isArray(aiResult.issues)) {
          contentIssues.push(...aiResult.issues);
        }
      }

      // Remove duplicates
      return [...new Set(contentIssues)];
    } catch (error) {
      console.error('Error analyzing file content:', error);
      contentIssues.push('Failed to analyze file content quality');
      return contentIssues;
    }
  }

  /**
   * Complete validation with file content analysis
   */
  private async validateExtractedData(
    extracted: EnhancedFinancialData,
    requiredFields: Record<string, any>, // Added parameter
    attachmentContents?: Array<{ filename: string; mimeType: string; content: string; size: number }>
  ): Promise<string[]> {
    const issues: string[] = [];

    // =====================================
    // 0. REQUIRED FIELDS VALIDATION [web:68][web:74]
    // =====================================
    if (requiredFields && Object.keys(requiredFields).length > 0) {
      for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
        if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
          issues.push(`Missing required user field: ${fieldName}`);
        } else if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
          issues.push(`Required user field '${fieldName}' is empty`);
        } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
          issues.push(`Required user field '${fieldName}' is an empty array`);
        }
      }
    }

    // =====================================
    // 1. CONFIDENCE SCORE CHECK
    // =====================================
    if (extracted.confidence < 60) {
      issues.push(`Low confidence score: ${extracted.confidence}%`);
    } else if (extracted.confidence < 80) {
      issues.push(`Medium confidence score: ${extracted.confidence}% - Manual review recommended`);
    }

    // =====================================
    // 2. MISSING CRITICAL FIELDS
    // =====================================
    if (!extracted.assetCategory) {
      issues.push('Missing asset category (asset/liability/insurance)');
    }
    if (!extracted.assetType) {
      issues.push('Missing asset type classification');
    }
    if (!extracted.merchant && !extracted.bankName) {
      issues.push('Missing merchant/bank name');
    }

    // =====================================
    // 3. AMOUNT/VALUE VALIDATION
    // =====================================
    if (
      !extracted.amount &&
      !extracted.financialMetadata?.currentValue &&
      !extracted.financialMetadata?.totalValue
    ) {
      issues.push('No financial amount or value found');
    }
    if (extracted.amount && extracted.amount < 0) {
      issues.push('Negative amount detected - verify transaction type');
    }
    if (extracted.financialMetadata?.totalValue && extracted.financialMetadata?.currentValue) {
      if (extracted.financialMetadata.totalValue < extracted.financialMetadata.currentValue) {
        issues.push('Total value less than current value - possible data inconsistency');
      }
    }

    // Large amount validation
    if (extracted.amount && extracted.amount > 10000000) {
      // 1 crore+
      issues.push(`Unusually large amount: ${extracted.amount} - verify accuracy`);
    }

    // =====================================
    // 4. DATE VALIDATION
    // =====================================
    if (extracted.date) {
      const extractedDate = new Date(extracted.date);
      const currentDate = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

      if (isNaN(extractedDate.getTime())) {
        issues.push('Invalid date format');
      } else if (extractedDate > currentDate) {
        issues.push('Future date detected - verify transaction date');
      } else if (extractedDate < fiveYearsAgo) {
        issues.push(`Very old transaction date: ${extracted.date} - verify if historical data`);
      } else if (extractedDate < oneYearAgo) {
        issues.push(`Old transaction date: ${extracted.date} - verify if accurate`);
      }
    } else {
      issues.push('Missing transaction date');
    }

    // =====================================
    // 5. BANK ACCOUNT VALIDATION
    // =====================================
    if (extracted.accountNumber) {
      const digitsOnly = extracted.accountNumber.replace(/[^0-9]/g, '');
      // Indian bank account: 9-18 digits
      if (!/^\d{9,18}$/.test(digitsOnly)) {
        issues.push('Invalid account number format (expected 9-18 digits)');
      }
    }

    if (extracted.ifscCode) {
      // IFSC format: 4 letters + 0 + 6 alphanumeric (e.g., SBIN0001234)
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(extracted.ifscCode.toUpperCase())) {
        issues.push('Invalid IFSC code format (expected: XXXX0XXXXXX)');
      }
    }

    // =====================================
    // 6. CATEGORY-SPECIFIC VALIDATION
    // =====================================
    if (extracted.assetCategory === 'liability') {
      // Liabilities should have outstanding balance or EMI info
      if (!extracted.financialMetadata?.outstandingBalance && !extracted.financialMetadata?.emiAmount) {
        issues.push('Liability missing outstanding balance or EMI details');
      }

      // Credit card specific
      if (extracted.assetType === 'credit_card') {
        if (!extracted.financialMetadata?.creditLimit) {
          issues.push('Credit card missing credit limit');
        }
        if (!extracted.financialMetadata?.minimumPayment) {
          issues.push('Credit card missing minimum payment amount');
        }
        if (!extracted.financialMetadata?.dueDate) {
          issues.push('Credit card missing payment due date');
        }

        // Credit utilization check
        if (
          extracted.financialMetadata?.outstandingBalance &&
          extracted.financialMetadata?.creditLimit
        ) {
          const utilization =
            (extracted.financialMetadata.outstandingBalance / extracted.financialMetadata.creditLimit) *
            100;
          if (utilization > 100) {
            issues.push('Credit card over limit - verify outstanding balance');
          } else if (utilization > 80) {
            issues.push('High credit utilization (>80%) - consider payment');
          }
        }
      }

      // Loan specific
      if (
        extracted.assetType === 'home_loan' ||
        extracted.assetType === 'vehicle_loan' ||
        extracted.assetType === 'education_loan'
      ) {
        if (!extracted.financialMetadata?.interestRate) {
          issues.push('Loan missing interest rate information');
        }
        if (!extracted.financialMetadata?.emiAmount) {
          issues.push('Loan missing EMI amount');
        }
      }
    }

    if (extracted.assetCategory === 'insurance') {
      // Insurance should have policy number
      if (!extracted.policyNumber) {
        issues.push('Insurance policy missing policy number');
      }

      // Life insurance specific
      if (extracted.assetType === 'life_insurance') {
        if (!extracted.financialMetadata?.sumAssured && !extracted.financialMetadata?.coverageAmount) {
          issues.push('Life insurance missing sum assured/coverage amount');
        }
        if (!extracted.financialMetadata?.premium) {
          issues.push('Life insurance missing premium amount');
        }
        if (!extracted.financialMetadata?.maturityDate) {
          issues.push('Life insurance missing maturity date');
        }
      }

      // Health insurance specific
      if (extracted.assetType === 'health_insurance') {
        if (!extracted.financialMetadata?.coverageAmount) {
          issues.push('Health insurance missing coverage amount');
        }
      }

      // Premium validation
      if (extracted.financialMetadata?.premium) {
        if (extracted.financialMetadata.premium < 0) {
          issues.push('Invalid negative premium amount');
        }
        if (!extracted.financialMetadata.premiumFrequency) {
          issues.push('Insurance missing premium frequency (monthly/yearly)');
        }
      }
    }

    if (extracted.assetCategory === 'asset') {
      // Investment specific
      if (extracted.assetType === 'investment') {
        if (extracted.assetSubType === 'mutual_fund' && !extracted.folioNumber) {
          issues.push('Mutual fund missing folio number');
        }
        if (!extracted.financialMetadata?.currentValue) {
          issues.push('Investment missing current value');
        }

        // Returns validation
        if (
          extracted.financialMetadata?.purchasePrice &&
          extracted.financialMetadata?.currentValue
        ) {
          const returns =
            ((extracted.financialMetadata.currentValue - extracted.financialMetadata.purchasePrice) /
              extracted.financialMetadata.purchasePrice) *
            100;
          if (returns < -50) {
            issues.push(`Significant loss detected: ${returns.toFixed(2)}% - verify values`);
          }
        }
      }

      // Liquid asset validation
      if (extracted.assetSubType === 'liquid_asset') {
        if (!extracted.balance && !extracted.financialMetadata?.currentValue) {
          issues.push('Liquid asset missing balance/current value');
        }
      }
    }

    // =====================================
    // 7. CURRENCY VALIDATION
    // =====================================
    const validCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'CHF', 'CAD', 'AUD'];
    if (extracted.currency && !validCurrencies.includes(extracted.currency)) {
      issues.push(`Unusual or invalid currency detected: ${extracted.currency}`);
    }

    // =====================================
    // 8. STATUS VALIDATION
    // =====================================
    const validStatuses = ['active', 'inactive', 'complete', 'missing'];
    if (extracted.status && !validStatuses.includes(extracted.status)) {
      issues.push(`Invalid status value: ${extracted.status}`);
    }

    // =====================================
    // 9. TRANSACTION TYPE VALIDATION
    // =====================================
    const validTransactionTypes = [
      'invoice',
      'payment',
      'receipt',
      'statement',
      'bill',
      'tax',
      'credit_card',
      'other',
    ];
    if (extracted.transactionType && !validTransactionTypes.includes(extracted.transactionType)) {
      issues.push(`Unknown transaction type: ${extracted.transactionType}`);
    }

    // =====================================
    // 10. METADATA COMPLETENESS CHECK
    // =====================================
    if (!extracted.description || extracted.description.length < 10) {
      issues.push('Insufficient transaction description (minimum 10 characters required)');
    }

    // =====================================
    // 11. RECURRING PAYMENT VALIDATION
    // =====================================
    if (extracted.financialMetadata?.isRecurring) {
      if (!extracted.financialMetadata.frequency) {
        issues.push('Recurring payment missing frequency (monthly/quarterly/yearly)');
      }
      if (!extracted.financialMetadata.dueDate && !extracted.financialMetadata.emiDueDate) {
        issues.push('Recurring payment missing due date');
      }

      // Check if due date is in the past
      if (extracted.financialMetadata.dueDate) {
        const dueDate = new Date(extracted.financialMetadata.dueDate);
        if (dueDate < new Date()) {
          issues.push('Payment due date has passed - action may be required');
        }
      }
    }

    // =====================================
    // 12. INTEREST RATE VALIDATION (for loans)
    // =====================================
    if (extracted.financialMetadata?.interestRate) {
      if (extracted.financialMetadata.interestRate < 0 || extracted.financialMetadata.interestRate > 50) {
        issues.push(`Unusual interest rate: ${extracted.financialMetadata.interestRate}% (expected 0-50%)`);
      }
    }

    // =====================================
    // 13. DOCUMENT QUALITY CHECK
    // =====================================
    if (extracted.confidence < 50) {
      issues.push('Poor document quality - OCR extraction unreliable (confidence <50%)');
    }

    // =====================================
    // 14. CROSS-FIELD VALIDATION
    // =====================================
    // EMI vs Outstanding Balance check
    if (
      extracted.financialMetadata?.emiAmount &&
      extracted.financialMetadata?.outstandingBalance
    ) {
      if (extracted.financialMetadata.emiAmount > extracted.financialMetadata.outstandingBalance) {
        issues.push('EMI amount exceeds outstanding balance - verify data');
      }
    }

    // Policy number format validation
    if (extracted.policyNumber && extracted.policyNumber.length < 5) {
      issues.push('Policy number appears too short - verify accuracy');
    }

    // Folio number format validation
    if (extracted.folioNumber && extracted.folioNumber.length < 4) {
      issues.push('Folio number appears too short - verify accuracy');
    }

    // =====================================
    // REMOVE DUPLICATES & RETURN
    // =====================================
    return [...new Set(issues)];
  }




  private generateSmartSummary(data: EnhancedFinancialData): string {
    const categoryEmoji = {
      asset: '💰',
      liability: '💳',
      insurance: '🛡️',
      other: '📄',
    }[data.assetCategory];

    const statusEmoji = {
      active: '✅',
      inactive: '❌',
      pending: '⏳',
      complete: '✔️',
      missing: '⚠️',
    }[data.status] || '';

    return `${categoryEmoji} ${data.assetType} ${statusEmoji} | ${data.merchant} ${data.amount ? `- ₹${data.amount}` : ''} (${data.transactionType})`;
  }

  // private fallbackFinancialAnalysis(
  //   data: FinancialAnalysisRequest
  // ): AnalysisResult {
  //   return {
  //     success: false,
  //     extractedData: {
  //       transactionType: 'other',
  //       amount: null,
  //       currency: 'USD',
  //       merchant: data.sender,
  //       description: data.subject || 'No description',
  //       date: new Date().toISOString().split('T')[0],
  //       accountNumber: null,
  //       confidence: 20,
  //       assetCategory: 'other',
  //       assetType: 'other',
  //       assetSubType: null,
  //       financialMetadata: {},
  //     },
  //     keyPoints: ['Unable to extract financial data'],
  //     summary: 'Analysis failed - manual review required',
  //   };
  // }


  /**
   * Fallback financial analysis using regex/keywords
   */
  private fallbackFinancialAnalysis(
    data: FinancialAnalysisRequest
  ): AnalysisResult {
    const content = `${data.subject} ${data.emailContent}`.toLowerCase();

    let transactionType = 'other';
    if (content.includes('invoice') || content.includes('billing'))
      transactionType = 'invoice';
    else if (content.includes('receipt') || content.includes('purchase'))
      transactionType = 'receipt';
    else if (content.includes('payment') || content.includes('paid'))
      transactionType = 'payment';
    else if (content.includes('statement') || content.includes('account summary'))
      transactionType = 'statement';
    else if (content.includes('tax') || content.includes('1099') || content.includes('irs'))
      transactionType = 'tax';
    else if (content.includes('credit card') || content.includes('card statement'))
      transactionType = 'credit_card';

    const amountMatch = content.match(/(\$|usd|inr|eur|gbp|jpy)\s*([\d,]+\.?\d*)/i);
    let amount = null;
    let currency = 'USD';

    if (amountMatch) {
      currency = this.getCurrencyCode(amountMatch[1]);
      amount = parseFloat(amountMatch[2].replace(/,/g, ''));
    }

    const merchantMatch = content.match(
      /(?:from|merchant|company|bank|account|issued by):\s*([a-z\s]+?)(?:\.|,|$)/i
    );
    const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';

    const dateMatch = content.match(
      /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/
    );
    let date = null;
    if (dateMatch) {
      try {
        date = new Date(dateMatch[1]).toISOString().split('T')[0];
      } catch (e) {
        date = new Date().toISOString().split('T')[0];
      }
    }

    const confidence = transactionType !== 'other' ? 75 : 30;

    return {
      success: true,
      extractedData: {
        transactionType,
        amount: amount || 0,
        currency,
        merchant,
        description: data.emailContent.substring(0, 100),
        date: data as any,
        confidence,
      } as any,
      keyPoints: [
        `Transaction Type: ${transactionType}`,
        amount ? `Amount: ${currency} ${amount}` : 'No amount found',
        `Merchant: ${merchant}`,
      ],
      summary: `Identified ${transactionType} with ${confidence}% confidence`,
    } as any;
  }


  /**
 * Analyze file content and return Asset-ready structured data
 */
  async analyzeFileForAsset(
    extractedText: string,
    metadata: Record<string, any>,
    userId: string,
    fileName?: string,
    mimeType?: string
  ): Promise<{
    success: boolean;
    assetData: Partial<Asset>;
    issues: string[];
    required_fields: string[];
  }> {
    try {
      const systemPrompt = `You are an expert financial document analyzer. Extract ALL information from documents and map them to structured asset/liability/insurance data.`;

      const prompt = `Analyze this financial document and extract ALL details for asset tracking:

═══════════════════════════════════════════════════════════
DOCUMENT INFORMATION
═══════════════════════════════════════════════════════════
File Name: ${fileName || 'Unknown'}
MIME Type: ${mimeType || 'Unknown'}
Extraction Metadata: ${JSON.stringify(metadata)}

═══════════════════════════════════════════════════════════
DOCUMENT CONTENT
═══════════════════════════════════════════════════════════
${extractedText}

═══════════════════════════════════════════════════════════
EXTRACTION REQUIREMENTS
═══════════════════════════════════════════════════════════

Map this document to the following structure:

{
  // Basic identification
  "name": "Asset name/title",
  "type": "asset|liability|insurance",
  "sub_type": "Specific type (e.g., savings_account, mutual_fund, home_loan, life_insurance)",
  
  // Bank/Financial details
  "account_number": "Full account number",
  "ifsc_code": "IFSC code (Indian banks)",
  "branch_name": "Branch name",
  "bank_name": "Bank/Institution name",
  
  // Financial values
  "balance": "Current balance/value (Decimal)",
  "total_value": "Total investment/loan amount (Decimal)",
  
  // Status & tracking
  "status": "active|inactive|complete|missing",
  
  // Address
  "address": "Complete address of institution/property",
  
  // CRN/Customer Reference
  "crn_number": "CRN or customer reference number",
  
  // Nominee details (JSON array)
  "nominee": [
    {
      "name": "Nominee name",
      "relation": "Relationship",
      "percentage": "Share percentage"
    }
  ],
  
  // Insurance specific
  "policy_number": "Policy number",
  "fund_name": "Fund/scheme name",
  "folio_number": "Folio number for MF/insurance",
  
  // Document metadata (store AI analysis)
  "document_metadata": {
    "extraction_method": "python_extractor|ocr|pypdf",
    "confidence": 0-100,
    "document_type": "statement|policy|invoice|receipt",
    "extracted_at": "ISO timestamp",
    "page_count": "Number of pages",
    "has_tables": true/false,
    "key_findings": ["Finding 1", "Finding 2"],
    "financial_summary": {
      "total_credits": "Total credit amount",
      "total_debits": "Total debit amount",
      "net_balance": "Net balance",
      "transaction_count": "Number of transactions",
      "date_range": "Statement period"
    }
  },
  
  // File details
  "file_name": "Original filename",
  "file_size": "File size in bytes",
  "mime_type": "MIME type",
  
  // Required fields that user needs to provide
  "required_fields": [
    "List of fields that are missing or need user confirmation"
  ],
  
  // Issues detected
  "issues": [
    "List of validation issues or data quality concerns"
  ]
}

═══════════════════════════════════════════════════════════
CLASSIFICATION RULES
═══════════════════════════════════════════════════════════

**ASSET TYPES:**
- savings_account, checking_account, fixed_deposit
- mutual_fund, stocks, bonds, sip, ppf, nps
- real_estate, property, land
- vehicle, gold, cryptocurrency
- business_ownership

**LIABILITY TYPES:**
- home_loan, vehicle_loan, personal_loan
- credit_card, education_loan
- utility_bill, tax_liability, emi

**INSURANCE TYPES:**
- life_insurance, health_insurance
- vehicle_insurance, home_insurance
- critical_illness, accident_insurance

═══════════════════════════════════════════════════════════
IMPORTANT INSTRUCTIONS
═══════════════════════════════════════════════════════════

1. Extract ALL account numbers, IFSC codes, policy numbers
2. Identify nominee details if mentioned
3. Calculate balance and total_value accurately
4. Detect document quality issues
5. List missing required fields
6. Return ONLY valid JSON, no additional text
7. Use null for missing fields
8. Convert dates to ISO format
9. Store complete financial metadata

Begin extraction now:`;

      const response = await this.callBedrock(prompt, systemPrompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const extracted = JSON.parse(jsonMatch[0]);

      // Validate extracted data
      const issues = await this.validateAssetData(extracted, userId);
      const requiredFields = await this.checkMissingUserFields(
        userId,
        extracted.required_fields || {}
      );

      return {
        success: true,
        assetData: {
          user_id: userId,
          name: extracted.name,
          type: extracted.type || 'documents',
          sub_type: extracted.sub_type,
          account_number: extracted.account_number,
          ifsc_code: extracted.ifsc_code,
          branch_name: extracted.branch_name,
          bank_name: extracted.bank_name,
          // balance: extracted.balance ? parseFloat(extracted.balance) : 0,
          // total_value: extracted.total_value ? parseFloat(extracted.total_value) : 0,
          // status: extracted.status || 'incai',
          file_content: extractedText,
          address: extracted.address,
          crn_number: extracted.crn_number,
          nominee: extracted.nominee || [],
          policy_number: extracted.policy_number,
          fund_name: extracted.fund_name,
          folio_number: extracted.folio_number,
          document_metadata: {
            ...extracted.document_metadata,
            extraction_method: metadata.method || metadata.extraction_method,
            extracted_at: new Date().toISOString(),
            original_metadata: metadata
          },
          file_name: fileName!,
          file_size: parseInt(metadata.file_size),
          mime_type: mimeType as string,
          issues: issues,
          required_fields: requiredFields
        },
        issues,
        required_fields: requiredFields
      };

    } catch (error) {
      console.error('❌ Error analyzing file for asset:', error);
      return {
        success: false,
        assetData: {},
        issues: [(error as Error).message],
        required_fields: []
      };
    }
  }

  /**
   * Validate asset data before storing
   */
  private async validateAssetData(
    extracted: any,
    userId: string
  ): Promise<string[]> {
    const issues: string[] = [];

    // Type validation
    const validTypes = ['asset', 'liability', 'insurance'];
    if (!extracted.type || !validTypes.includes(extracted.type)) {
      issues.push('Invalid or missing asset type');
    }

    // Bank details validation
    if (extracted.account_number) {
      const digitsOnly = extracted.account_number.replace(/[^0-9]/g, '');
      if (!/^\d{9,18}$/.test(digitsOnly)) {
        issues.push('Invalid account number format');
      }
    }

    if (extracted.ifsc_code) {
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(extracted.ifsc_code.toUpperCase())) {
        issues.push('Invalid IFSC code format');
      }
    }

    // Financial values validation
    if (extracted.balance && parseFloat(extracted.balance) < 0) {
      issues.push('Negative balance detected');
    }

    if (extracted.total_value && parseFloat(extracted.total_value) < 0) {
      issues.push('Negative total value detected');
    }

    // Required fields check
    if (!extracted.name) {
      issues.push('Asset name is required');
    }

    if (!extracted.bank_name && !extracted.merchant) {
      issues.push('Bank/Institution name is required');
    }

    return issues;
  }


  /**
   * Analyze PDF document and extract structured data
   */
  async analyzePDFDocument(data: PDFAnalysisRequest): Promise<AnalysisResult> {
    try {
      const systemPrompt = `You are an expert financial document analyzer specializing in:
- Bank statements and transaction records
- Insurance policies and claims
- Investment portfolios and reports
- Invoices, receipts, and bills
- Tax documents and returns
- Loan agreements and EMI schedules
- Asset and liability documentation

Extract ALL relevant financial information with precision and structure.`;

      const prompt = `Analyze this financial document comprehensively and extract ALL key information:

═══════════════════════════════════════════════════════════
DOCUMENT INFORMATION
═══════════════════════════════════════════════════════════
Document Type Hint: ${data.documentType || 'Unknown - Please identify'}
Document Length: ${data.text.length} characters

═══════════════════════════════════════════════════════════
DOCUMENT CONTENT
═══════════════════════════════════════════════════════════
${data.text}

═══════════════════════════════════════════════════════════
EXTRACTION REQUIREMENTS
═══════════════════════════════════════════════════════════

Perform a COMPREHENSIVE analysis and extract:

1. DOCUMENT CLASSIFICATION
   - Identify exact document type
   - Determine financial category
   - Assess document purpose

2. FINANCIAL FIGURES (Critical)
   - Opening balance
   - Closing balance
   - Current balance
   - Total amount
   - Subtotal
   - Tax amounts (GST, CGST, SGST, etc.)
   - Discounts
   - Fees and charges
   - Interest amounts
   - EMI amounts
   - Premium amounts
   - Sum assured/insured
   - Investment value
   - Returns/gains/losses
   - ANY other monetary values

3. PARTIES & ENTITIES
   - Sender/Issuer name
   - Receiver/Customer name
   - Bank/Institution name
   - Branch name
   - Merchant name
   - Service provider
   - Beneficiary details
   - Nominee information

4. IDENTIFICATION NUMBERS
   - Account number
   - IFSC code
   - CRN (Customer Reference Number)
   - Policy number
   - Folio number
   - Invoice number
   - Receipt number
   - Transaction ID/Reference
   - PAN number
   - GST number
   - Customer ID

5. DATES (All formats: DD/MM/YYYY, YYYY-MM-DD, etc.)
   - Document date
   - Statement period (from - to)
   - Transaction dates
   - Due date
   - Payment date
   - Maturity date
   - Expiry date
   - Issue date

6. TRANSACTION DETAILS (if applicable)
   - List of transactions
   - Credit entries
   - Debit entries
   - Transaction descriptions
   - Payment methods
   - Categories

7. CONTACT & ADDRESS
   - Full address
   - Email address
   - Phone numbers
   - Website

8. ADDITIONAL METADATA
   - Currency (INR, USD, etc.)
   - Statement frequency
   - Account type
   - Product type
   - Plan name
   - Coverage details
   - Terms and conditions
   - Important notes/warnings

9. DATA QUALITY ASSESSMENT
   - Text clarity (0-100)
   - Completeness (0-100)
   - Structure quality (0-100)
   - Overall confidence (0-100)

10. ACCOUNG HOLDER DETAILS 
    - ADDRESS
    - PHONE NUMBER
    - BANK ADDRESS
    - OTHER DETAILS

═══════════════════════════════════════════════════════════
RESPONSE FORMAT (STRICT JSON)
═══════════════════════════════════════════════════════════

Return ONLY valid JSON 
═══════════════════════════════════════════════════════════
IMPORTANT INSTRUCTIONS
═══════════════════════════════════════════════════════════

1. Extract ALL numbers - don't miss any financial figures
2. Use null for missing/not applicable fields
3. Convert all dates to YYYY-MM-DD format
4. Remove currency symbols from numbers (₹, $, etc.)
5. Include decimal places for amounts (e.g., 1234.56)
6. List transactions in chronological order
7. Be thorough with identification numbers
8. Assess quality honestly based on text clarity
9. Provide specific, actionable key findings
10. Return ONLY the JSON object, no additional text
11. full account number

Begin analysis now:`;

      // console.log(prompt)

      const response = await this.callBedrock(prompt, systemPrompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return this.fallbackPDFAnalysis(data);
      }

      const extracted = JSON.parse(jsonMatch[0]);
      console.log(extracted)

      return {
        success: true,
        extractedData: {
          content: extracted,
          transactionType: extracted.documentType || 'other',
          confidence: extracted.dataQuality || 50,
        } as any,
        keyPoints: extracted.keyFindings,
        summary: `${extracted?.documentType} with ${extracted?.keyFigures?.length} financial figures identified`,
      } as any;
    } catch (error) {
      console.error('Error analyzing PDF document:', error);
      return this.fallbackPDFAnalysis(data);
    }
  }

  structureData = async (data: string) => {
    try {
      const prompt = `structure this data :: ${data}`
      return await this.callBedrock(prompt)
    } catch (error) {
      console.log('Error in structuring the data :: ', (error as Error).message)
      return
    }
  }

  private formatAdditionalDetails(details: object): string[] {
    const formatted: string[] = [];

    for (const [key, value] of Object.entries(details)) {
      if (value !== null && value !== undefined && value !== '') {
        // Format the key (convert snake_case/camelCase to readable format)
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .trim();

        // Handle different value types
        if (typeof value === 'object' && value !== null) {
          if (value instanceof Date) {
            const date = new Date(value);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            formatted.push(`${formattedKey}: ${formattedDate}`);
          } else if (Array.isArray(value)) {
            formatted.push(`${formattedKey}: ${value.join(', ')}`);
          } else {
            // Nested object - flatten it
            formatted.push(`${formattedKey}:`);
            const nested = this.formatAdditionalDetails(value);
            formatted.push(...nested.map(line => `  ${line}`));
          }
        } else {
          formatted.push(`${formattedKey}: ${value}`);
        }
      }
    }

    return formatted;
  }

  /**
   * Guess password from email instructions and user details
   */
  guessPassword = async (
    subject: string,
    body: string,
    userId: string,
    additionalDetails?: object
  ) => {
    try {
      // Fetch user details from database
      const userDetails = await prisma.user.findUnique({
        where: { id: userId },
        // select: {
        //   name: true,
        //   email: true,
        //   phone: true,
        //   date_of_birth: true,
        //   pan_number: true,
        // },
      });

      if (!userDetails) {
        console.log('❌ User not found');
        return false;
      }

      // Format user details for AI
      let userInfo = '';
      const details: string[] = [];

      if (userDetails.name) {
        details.push(`Name: ${userDetails.name}`);
      }
      if (userDetails.email) {
        details.push(`Email: ${userDetails.email}`);
      }
      if (userDetails.phone) {
        details.push(`Phone: ${userDetails.phone}`);
      }
      if (userDetails.date_of_birth) {
        const dob = new Date(userDetails.date_of_birth);
        const formatted = `${String(dob.getDate()).padStart(2, '0')}/${String(dob.getMonth() + 1).padStart(2, '0')}/${dob.getFullYear()}`;
        details.push(`Date of Birth: ${formatted}`);
      }
      if (userDetails.pan_number) {
        details.push(`PAN Number: ${userDetails.pan_number}`);
      }

      if (details.length > 0) {
        userInfo = `\n\nUser Details:\n${details.join('\n')}`;
      }

      if (additionalDetails && Object.keys(additionalDetails).length > 0) {
        const additionalInfo = this.formatAdditionalDetails(additionalDetails);
        if (additionalInfo.length > 0) {
          details.push(''); // Empty line for separation
          details.push('Additional Information:');
          details.push(...additionalInfo);
        }
      }

      // console.log('details :: ',details)

      const prompt = `Read the email and identify password instructions for the attachment. If instructions are found and user details are provided, generate the password according to those instructions.

Email Subject: ${subject}
Email Body: ${body}${userInfo}
Additional Details: ${details}

Instructions:
1. Look for password instructions in the email for password-protected attachments
2. If instructions found AND user details provided, generate the password exactly as instructed
3. Return ONLY the password string, nothing else
4. If no instructions found OR user details missing, return exactly "false"
5. Default format DDMMYYYY

Response (just password or "false"):`;

      // console.log(prompt)
      const response = await this.callBedrock(prompt);
      const password = response.trim();

      // console.log(response,password)

      // Check if AI returned false
      if (
        password.toLowerCase() === 'false' ||
        password.toLowerCase() === 'none' ||
        password.length === 0 ||
        password.length > 50
      ) {
        console.log('❌ Cannot generate password');
        return false;
      }

      console.log('✅ Password generated');
      return password;
    } catch (error) {
      console.error('Error guessing password:', error);
      return false;
    }
  };

  /**
   * Fallback PDF analysis using keywords
   */
  private fallbackPDFAnalysis(data: PDFAnalysisRequest): AnalysisResult {
    const text = data.text.toLowerCase();
    let docType = 'other';

    if (text.includes('invoice')) docType = 'invoice';
    else if (text.includes('receipt')) docType = 'receipt';
    else if (text.includes('statement')) docType = 'statement';
    else if (text.includes('1099') || text.includes('tax')) docType = 'tax';
    else if (text.includes('contract')) docType = 'contract';

    return {
      success: true,
      extractedData: {
        transactionType: docType as any,
        confidence: 70,
      } as any,
      keyPoints: [
        `Document Type: ${docType}`,
        `Text Length: ${data.text.length} chars`,
      ],
      summary: `${docType} document analyzed`,
    } as any;
  }

  /**
   * Extract text from email and classify
   */
  async classifyEmailContent(
    emailBody: string
  ): Promise<{
    isFinancial: boolean;
    category: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    try {
      return this.classifyUsingKeywords(emailBody);
    } catch (error) {
      console.error('Error classifying email:', error);
      return {
        isFinancial: false,
        category: 'other',
        priority: 'low',
      };
    }
  }

  /**
   * Classify email using keywords
   */
  private classifyUsingKeywords(
    emailBody: string
  ): {
    isFinancial: boolean;
    category: string;
    priority: 'high' | 'medium' | 'low';
  } {
    const content = emailBody.toLowerCase();

    const financialKeywords: Record<
      string,
      { category: string; priority: string }
    > = {
      invoice: { category: 'invoice', priority: 'high' },
      receipt: { category: 'receipt', priority: 'high' },
      payment: { category: 'payment', priority: 'high' },
      transaction: { category: 'transaction', priority: 'high' },
      statement: { category: 'statement', priority: 'high' },
      bank: { category: 'statement', priority: 'high' },
      tax: { category: 'tax', priority: 'high' },
      '1099': { category: 'tax', priority: 'high' },
      irs: { category: 'tax', priority: 'high' },
      'credit card': { category: 'credit_card', priority: 'high' },
      'account number': { category: 'statement', priority: 'medium' },
      amount: { category: 'transaction', priority: 'medium' },
      $: { category: 'transaction', priority: 'medium' },
      'total due': { category: 'invoice', priority: 'high' },
      purchase: { category: 'receipt', priority: 'high' },
      order: { category: 'receipt', priority: 'high' },
      billing: { category: 'invoice', priority: 'high' },
      balance: { category: 'statement', priority: 'medium' },
      withdrawal: { category: 'transaction', priority: 'high' },
      deposit: { category: 'transaction', priority: 'high' },
      fee: { category: 'statement', priority: 'medium' },
    };

    let isFinancial = false;
    let matchedCategory = 'other';
    let maxPriority = 'low';

    for (const [keyword, metadata] of Object.entries(financialKeywords)) {
      if (content.includes(keyword)) {
        isFinancial = true;
        matchedCategory = metadata.category;

        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (
          priorityOrder[metadata.priority as keyof typeof priorityOrder] >
          priorityOrder[maxPriority as keyof typeof priorityOrder]
        ) {
          maxPriority = metadata.priority;
        }
      }
    }

    return {
      isFinancial,
      category: matchedCategory,
      priority: maxPriority as 'high' | 'medium' | 'low',
    };
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      console.log('⟳ Calling OpenAI API...');
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.5,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI error:', error);
        throw new Error(`OpenAI failed: ${response.status} - ${(error as any).error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✓ OpenAI response received');
      return (data as any).choices[0].message.content || '';
    } catch (error) {
      console.error('OpenAI API failed:', error);
      throw error;
    }
  }

  /**
   * Get currency code from symbol
   */
  private getCurrencyCode(symbol: string): string {
    const codes: Record<string, string> = {
      $: 'USD',
      usd: 'USD',
      inr: 'INR',
      '₹': 'INR',
      eur: 'EUR',
      '€': 'EUR',
      gbp: 'GBP',
      '£': 'GBP',
      jpy: 'JPY',
      '¥': 'JPY',
    };

    return codes[symbol.toLowerCase()] || 'USD';
  }

  /**
   * 🔥 NEW METHOD: Extract balance and total_value from document_metadata
   * Analyzes document_metadata using AI to find exact balance values
   * 
   * @param documentMetadata - Complete document metadata object
   * @param assetCategory - Asset category (asset, liability, insurance)
   * @returns Object with balance and total_value
   * 
   * @example
   * const aiService = new AIService();
   * const result = await aiService.extractBalanceFromMetadata(
   *   asset.document_metadata,
   *   'liability'
   * );
   * console.log(`Balance: ₹${result.balance}, Total: ₹${result.total_value}`);
   */
  async extractBalanceFromMetadata(
    documentMetadata: any,
    assetCategory: string
  ): Promise<{
    balance: number | null;
    total_value: number | null;
    confidence: number;
    reasoning: string;
  }> {
    try {
      console.log('\n🔍 Extracting balance from document metadata...');

      const prompt = `You are an expert financial data analyzer. Analyze this document metadata and extract the EXACT balance and total value.

═══════════════════════════════════════════════════════════
DOCUMENT METADATA
═══════════════════════════════════════════════════════════
${JSON.stringify(documentMetadata, null, 2)}

═══════════════════════════════════════════════════════════
ASSET CATEGORY: ${assetCategory}
═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
EXTRACTION RULES BY CATEGORY
═══════════════════════════════════════════════════════════

🏦 ASSET (savings, investments, property):
   balance: Current account balance or investment value
   total_value: Total investment amount or property value
   
   Sources to check:
   - aiAnalysis.balance
   - financialMetadata.currentValue
   - financialMetadata.totalValue
   - attachmentAnalysis.content.financialFigures.closingBalance
   - attachmentAnalysis.content.financialFigures.openingBalance
   - Any "balance", "current value", "market value" mentions
   - For investments: NAV × Units = current value

💳 LIABILITY (loans, credit cards, bills):
   balance: Outstanding balance or amount due
   total_value: Total loan amount or credit limit
   
   Sources to check:
   - financialMetadata.outstandingBalance
   - financialMetadata.creditLimit
   - financialMetadata.emiAmount (NOT balance, just EMI)
   - attachmentAnalysis.content.financialFigures.totalDue
   - attachmentAnalysis.content.financialFigures.outstandingBalance
   - attachmentAnalysis.content.financialFigures.creditLimit
   - aiAnalysis.total_value
   - Any "outstanding", "due amount", "total due" mentions

🛡️ INSURANCE (policies):
   balance: Premium amount (annual/monthly)
   total_value: Sum assured or coverage amount
   
   Sources to check:
   - financialMetadata.premium
   - financialMetadata.sumAssured
   - financialMetadata.coverageAmount
   - attachmentAnalysis.content.financialFigures (any premium/coverage)
   - Any "premium", "sum assured", "coverage" mentions

═══════════════════════════════════════════════════════════
IMPORTANT INSTRUCTIONS
═══════════════════════════════════════════════════════════

1. **Return EXACT NUMERIC VALUES ONLY** (no currency symbols, commas, or text)
2. Look in ALL possible fields:
   - aiAnalysis object
   - financialMetadata object
   - attachmentAnalysis.content.financialFigures
   - keyFindings array (extract numbers from text)
   - description field
3. For credit cards: outstandingBalance = balance, creditLimit = total_value
4. For loans: outstandingBalance = balance, loan amount = total_value
5. For insurance: premium = balance, sum assured = total_value
6. For investments: current value = balance, invested amount = total_value
7. If multiple sources exist, prefer:
   - attachmentAnalysis (highest priority - actual document data)
   - aiAnalysis (second priority)
   - financialMetadata (third priority)
8. Convert strings to numbers (remove ₹, $, commas, etc.)
9. Return null if genuinely not found (don't guess)
10. Check keyFindings for phrases like "outstanding balance: ₹12,540"

═══════════════════════════════════════════════════════════
RESPONSE FORMAT (JSON ONLY)
═══════════════════════════════════════════════════════════

Return ONLY valid JSON:

{
  "balance": <number or null>,
  "total_value": <number or null>,
  "confidence": <0-100>,
  "reasoning": "Explain where you found the values and why",
  "sources": {
    "balance_source": "Exact path where balance was found (e.g., 'attachmentAnalysis.content.financialFigures.totalDue')",
    "total_value_source": "Exact path where total_value was found"
  }
}

Examples:

Credit Card:
{
  "balance": 12540,
  "total_value": 120000,
  "confidence": 95,
  "reasoning": "Found outstanding due of ₹12,540 in attachmentAnalysis.content.financialFigures.totalDue and credit limit of ₹1,20,000 in attachmentAnalysis.content.financialFigures.creditLimit",
  "sources": {
    "balance_source": "attachmentAnalysis.content.financialFigures.totalDue",
    "total_value_source": "attachmentAnalysis.content.financialFigures.creditLimit"
  }
}

Mutual Fund:
{
  "balance": 250000,
  "total_value": 200000,
  "confidence": 90,
  "reasoning": "Current investment value (NAV × Units) is ₹2,50,000 and invested amount is ₹2,00,000",
  "sources": {
    "balance_source": "financialMetadata.currentValue",
    "total_value_source": "financialMetadata.totalValue"
  }
}

Begin extraction now:`;

      const response = await this.callBedrock(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        console.warn('⚠️ Failed to extract balance from metadata');
        return {
          balance: null,
          total_value: null,
          confidence: 0,
          reasoning: 'AI failed to extract balance'
        };
      }

      const result = JSON.parse(jsonMatch[0]);

      console.log(`✅ Balance extraction result:`);
      console.log(`   Balance: ${result.balance !== null ? `₹${result.balance}` : 'null'}`);
      console.log(`   Total Value: ${result.total_value !== null ? `₹${result.total_value}` : 'null'}`);
      console.log(`   Confidence: ${result.confidence}%`);
      console.log(`   Reasoning: ${result.reasoning}`);

      return {
        balance: result.balance !== null ? Number(result.balance) : null,
        total_value: result.total_value !== null ? Number(result.total_value) : null,
        confidence: result.confidence || 50,
        reasoning: result.reasoning || 'Balance extracted from metadata'
      };

    } catch (error) {
      console.error('❌ Error extracting balance from metadata:', error);
      return {
        balance: null,
        total_value: null,
        confidence: 0,
        reasoning: `Error: ${(error as Error).message}`
      };
    }
  }

  /**
   * ✅ NEW METHOD: Verify if the extracted content is actually financial data
   * Returns true if it's valid financial data, false if it's garbage/non-financial
   */
  async verifyFinancialContent(
    extractedData: EnhancedFinancialData,
    fileContent: string,
    fileName: string
  ): Promise<{
    isFinancial: boolean;
    confidence: number;
    reason: string;
    recommendations?: string[];
  }> {
    try {
      console.log(`\n🔍 Verifying financial content for: ${fileName}`);

      // Quick pre-checks before AI verification
      const preCheckResult = this.preCheckFinancialContent(extractedData, fileContent, fileName);

      if (!preCheckResult.shouldVerifyWithAI) {
        console.log(`❌ Pre-check failed: ${preCheckResult.reason}`);
        return {
          isFinancial: false,
          confidence: preCheckResult.confidence,
          reason: preCheckResult.reason,
          recommendations: preCheckResult.recommendations!
        };
      }

      // AI-powered deep verification
      const prompt = `You are an expert financial document classifier. Your task is to verify if the provided content is ACTUALLY financial data or just garbage/non-financial content.

FILE INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Filename: ${fileName}
Extracted Data Confidence: ${extractedData.confidence}%
Asset Category: ${extractedData.assetCategory || 'Not detected'}
Asset Type: ${extractedData.assetType || 'Not detected'}
Merchant/Bank: ${extractedData.merchant || 'Not detected'}
Amount: ${extractedData.amount || 'Not detected'}

EXTRACTED DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(extractedData, null, 2)}

FILE CONTENT PREVIEW (first 2000 chars):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${fileContent.substring(0, 2000)}

VERIFICATION CRITERIA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ VALID FINANCIAL DATA should contain:
1. Clear financial institution/bank names (HDFC, SBI, ICICI, LIC, etc.)
2. Actual monetary amounts with currency symbols (₹, $, etc.)
3. Financial terms (statement, invoice, payment, account, balance, etc.)
4. Account numbers, policy numbers, folio numbers, transaction IDs
5. Dates related to financial transactions
6. Financial metadata (interest rates, EMI, premium, coverage, etc.)
7. Clear document structure (headers, tables, organized data)
8. Professional banking/financial language
9. Regulatory information (IFSC, PAN, terms & conditions)
10. Transaction history or financial summaries

❌ NON-FINANCIAL/GARBAGE DATA indicators:
1. Error messages (password protected, extraction failed, corrupt file)
2. System logs or debug output
3. Dependency checks or software installation logs
4. Generic placeholder text ("Placeholder financial detail", "Line item 1", etc.)
5. Testing/demo data with no real financial content
6. Marketing emails without actual transaction data
7. Empty or minimal content (<100 meaningful characters)
8. Excessive binary/unreadable characters
9. File format conversion errors
10. OCR failures or gibberish text
11. Technical error messages (PyMuPDF, pypdf, pdfplumber errors)
12. "DEPENDENCY CHECK", "Available", "Successful" without context
13. Repeated generic phrases without real data
14. Email invitations, notifications, or promotional content
15. Family sharing invitations or platform notifications
16. Google account security alerts
17. Verification codes, OTPs, login alerts

EXAMPLES OF NON-FINANCIAL CONTENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- "PyMuPDF: ✓ Available, pypdf: ✓ Available" → Software dependency check
- "Password protected, extraction failed" → Error message
- "Line item 1: Placeholder financial detail" → Generic placeholder
- "Invited you to join the family group" → Family invitation
- "Google Account security alert" → Platform notification
- "Dependency check successful" → System log

YOUR TASK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analyze the content and determine:
1. Is this ACTUAL financial data worth saving?
2. Or is it garbage/error/non-financial content?

Return ONLY valid JSON in this format:
{
  "isFinancial": true or false,
  "confidence": 0-100 (how confident you are in this classification),
  "reason": "Clear explanation of why this is/isn't financial data",
  "financialIndicators": [
    "List of financial elements found (or empty if none)"
  ],
  "nonFinancialIndicators": [
    "List of non-financial/error elements found (or empty if none)"
  ],
  "recommendations": [
    "What should be done with this data"
  ]
}

IMPORTANT:
- Be STRICT: If you're not 90%+ confident it's real financial data, mark it as non-financial
- Prefer false negatives (rejecting questionable data) over false positives (saving garbage)
- Real financial documents have SPECIFIC details, not generic placeholders
- Error messages, logs, and system output are NOT financial data
- If confidence in extracted data is below 60%, be extra skeptical

Analyze now:`;

      const response = await this.callBedrock(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        console.warn('⚠️ AI verification failed to return JSON, using fallback');
        return {
          isFinancial: extractedData.confidence > 70,
          confidence: extractedData.confidence,
          reason: 'AI verification inconclusive, relying on extraction confidence',
          recommendations: ['Manual review recommended']
        };
      }

      const verificationResult = JSON.parse(jsonMatch[0]);

      console.log(`\n📊 Verification Result:`);
      console.log(`   Financial: ${verificationResult.isFinancial ? '✅ YES' : '❌ NO'}`);
      console.log(`   Confidence: ${verificationResult.confidence}%`);
      console.log(`   Reason: ${verificationResult.reason}`);

      if (verificationResult.financialIndicators && verificationResult.financialIndicators.length > 0) {
        console.log(`   ✅ Financial Indicators: ${verificationResult.financialIndicators.length}`);
      }

      if (verificationResult.nonFinancialIndicators && verificationResult.nonFinancialIndicators.length > 0) {
        console.log(`   ❌ Non-Financial Indicators: ${verificationResult.nonFinancialIndicators.length}`);
      }

      return {
        isFinancial: verificationResult.isFinancial,
        confidence: verificationResult.confidence,
        reason: verificationResult.reason,
        recommendations: verificationResult.recommendations || []
      };

    } catch (error) {
      console.error('❌ Error verifying financial content:', error);

      // Fallback to confidence-based decision on error
      const isFinancial = extractedData.confidence > 70;
      return {
        isFinancial,
        confidence: extractedData.confidence,
        reason: `Verification error: ${(error as Error).message}. Fallback based on extraction confidence.`,
        recommendations: ['Manual review required due to verification error']
      };
    }
  }

  /**
   * Pre-check financial content before AI verification
   * Quick checks to filter out obvious non-financial data
   */
  private preCheckFinancialContent(
    extractedData: EnhancedFinancialData,
    fileContent: string,
    fileName: string
  ): {
    shouldVerifyWithAI: boolean;
    confidence: number;
    reason: string;
    recommendations?: string[];
  } {
    const contentLower = fileContent.toLowerCase();

    // Check 1: Too short content
    // if (fileContent.length < 10) {
    //   return {
    //     shouldVerifyWithAI: false,
    //     confidence: 0,
    //     reason: 'Content too short (< 100 characters) - likely extraction failure',
    //     recommendations: ['Check if file is corrupt or password protected']
    //   };
    // }

    // Check 2: Error indicators
    const errorPatterns = [
      'dependency check',
      'extraction failed',
      'password protected',
      'incorrect password',
      'pypdf',
      'pdfplumber',
      'pymupdf',
      '✓ available',
      '✗ extraction failed',
      'corrupt',
      'damaged',
      'parsing error'
    ];

    let errorCount = 0;
    for (const pattern of errorPatterns) {
      if (contentLower.includes(pattern)) {
        errorCount++;
      }
    }

    if (errorCount >= 3) {
      return {
        shouldVerifyWithAI: false,
        confidence: 0,
        reason: 'Multiple error indicators found - this is system output, not financial data',
        recommendations: ['Re-extract the file or check file integrity']
      };
    }

    // Check 3: Placeholder content
    const placeholderPatterns = [
      'placeholder',
      'line item 1',
      'line item 2',
      'additional narrative text',
      'note 1:',
      'note 2:'
    ];

    let placeholderCount = 0;
    for (const pattern of placeholderPatterns) {
      if (contentLower.includes(pattern)) {
        placeholderCount++;
      }
    }

    if (placeholderCount >= 3) {
      return {
        shouldVerifyWithAI: false,
        confidence: 0,
        reason: 'Generic placeholder content detected - not real financial data',
        recommendations: ['This appears to be test/demo data']
      };
    }

    // Check 4: Non-financial content (invitations, notifications)
    const nonFinancialPatterns = [
      'invited you to join',
      'family group',
      'family invitation',
      'google account',
      'security alert',
      'verify your',
      'confirm your email',
      'password reset',
      'login alert',
      'app password created'
    ];

    for (const pattern of nonFinancialPatterns) {
      if (contentLower.includes(pattern)) {
        return {
          shouldVerifyWithAI: false,
          confidence: 0,
          reason: `Non-financial content detected: ${pattern}`,
          recommendations: ['This is a notification/invitation, not financial data']
        };
      }
    }

    // Check 5: Very low extraction confidence
    if (extractedData.confidence < 30) {
      return {
        shouldVerifyWithAI: false,
        confidence: extractedData.confidence,
        reason: 'Extraction confidence too low (< 30%) - unreliable data',
        recommendations: ['Data quality too poor for reliable analysis']
      };
    }

    // Check 6: Missing critical financial elements
    const hasMerchant = extractedData.merchant && extractedData.merchant.length > 2;
    const hasCategory = extractedData.assetCategory && extractedData.assetCategory !== 'other';
    const hasAmount = extractedData.amount ||
      extractedData.financialMetadata?.currentValue ||
      extractedData.financialMetadata?.totalValue;

    const criticalElementsCount = [hasMerchant, hasCategory, hasAmount].filter(Boolean).length;

    if (criticalElementsCount === 0) {
      return {
        shouldVerifyWithAI: true, // Still verify with AI as it might need deeper analysis
        confidence: 30,
        reason: 'No critical financial elements detected in quick check',
        recommendations: ['Needs AI verification to confirm']
      };
    }

    // Passed all pre-checks, proceed to AI verification
    return {
      shouldVerifyWithAI: true,
      confidence: 50,
      reason: 'Passed pre-checks, proceeding to AI verification'
    };
  }

  /**
 * 🔥 NEW METHOD: Analyze Non-Financial Document Content
 * Dedicated method for general documents (not financial assets)
 * Maps to Document model schema
 * 
 * @param extractedText - Text extracted from document
 * @param metadata - Extraction metadata
 * @param userId - User ID
 * @param filename - Original filename
 * @param mimeType - MIME type
 * @returns Document-ready structured data
 */
  async analyzeDocumentContent(
    extractedText: string,
    metadata: any,
    userId: string,
    filename: string,
    mimeType: string
  ): Promise<{
    success: boolean;
    documentData: {
      user_id: string;
      filename: string;
      original_filename: string;
      file_size: number;
      mime_type: string;
      upload_source: string;
      parsing_status: 'completed' | 'failed';
      parsing_error?: string;
      extracted_text: string;
      document_type: 'general' | 'contract' | 'agreement' | 'certificate' | 'license' | 'invoice' | 'receipt' | 'statement' | 'report' | 'letter' | 'form' | 'manual' | 'presentation' | 'spreadsheet' | 'other';
      document_category: string;
      confidence_score: number;
      extracted_data: Record<string, any>;
      page_count?: number;
      is_password_protected: boolean;
      processing_method: string;
      processing_duration?: number;
      ai_model_used: string;
      data_quality_score: number;
      validation_errors?: any;
    };
  }> {
    try {
      console.log('\n📄 Analyzing non-financial document...');
      console.log(`   File: ${filename}`);
      console.log(`   Text Length: ${extractedText.length} chars`);

      const systemPrompt = `You are an expert document classifier and content analyzer. Analyze documents and extract structured information for categorization and storage.`;

      const prompt = `Analyze this document and extract structured metadata:

═══════════════════════════════════════════════════════════
DOCUMENT INFORMATION
═══════════════════════════════════════════════════════════
Filename: ${filename}
MIME Type: ${mimeType}
Extraction Metadata: ${JSON.stringify(metadata)}

═══════════════════════════════════════════════════════════
DOCUMENT CONTENT (First 5000 chars)
═══════════════════════════════════════════════════════════
${extractedText.substring(0, 5000)}

═══════════════════════════════════════════════════════════
ANALYSIS REQUIREMENTS
═══════════════════════════════════════════════════════════

1. DOCUMENT CLASSIFICATION
   Classify this document into ONE of these types:
   - general: General documents, notes, letters
   - contract: Legal contracts, agreements with terms
   - agreement: Informal agreements, MOUs
   - certificate: Certificates, awards, credentials
   - license: Licenses, permits, authorizations
   - invoice: Commercial invoices (non-financial tracking)
   - receipt: Purchase receipts, acknowledgments
   - statement: Various statements (not bank statements)
   - report: Research reports, project reports
   - letter: Formal/informal letters, correspondence
   - form: Application forms, registration forms
   - manual: User manuals, guides, instructions
   - presentation: Presentation documents, slides
   - spreadsheet: Data tables, spreadsheets
   - other: Doesn't fit above categories

2. DOCUMENT CATEGORY
   Provide a specific subcategory, examples:
   - For contract: "Employment Contract", "Service Agreement"
   - For certificate: "Degree Certificate", "Participation Certificate"
   - For report: "Annual Report", "Project Status Report"
   - For letter: "Resignation Letter", "Recommendation Letter"

3. CONTENT EXTRACTION
   Extract key structured data:
   {
     "title": "Document title or subject",
     "author": "Author/creator name",
     "organization": "Issuing organization",
     "date": "Document date (YYYY-MM-DD format)",
     "reference_number": "Any reference/registration number",
     "parties_involved": ["List of parties/people mentioned"],
     "key_terms": ["Important terms or topics"],
     "summary": "Brief 2-3 sentence summary",
     "important_dates": [
       {"date": "YYYY-MM-DD", "description": "Event description"}
     ],
     "contacts": [
       {"name": "Person name", "role": "Role/designation", "contact": "Email/phone"}
     ],
     "attachments_mentioned": ["List of referenced attachments"],
     "action_items": ["Any action items or requirements"],
     "validity": {
       "start_date": "YYYY-MM-DD or null",
       "end_date": "YYYY-MM-DD or null",
       "is_time_sensitive": true/false
     }
   }

4. DATA QUALITY ASSESSMENT
   {
     "text_clarity": 0-100,
     "completeness": 0-100,
     "structure_quality": 0-100,
     "confidence_overall": 0-100
   }

5. VALIDATION
   Check for:
   - Missing critical information
   - Inconsistencies
   - Unclear sections
   - OCR errors
   - Format issues

═══════════════════════════════════════════════════════════
RESPONSE FORMAT (JSON ONLY)
═══════════════════════════════════════════════════════════

{
  "document_type": "one of the enum values",
  "document_category": "specific category description",
  "confidence_score": 0-100,
  "extracted_data": {
    // All extracted structured data as defined above
  },
  "data_quality": {
    "text_clarity": 0-100,
    "completeness": 0-100,
    "structure_quality": 0-100,
    "confidence_overall": 0-100
  },
  "validation_errors": [
    "List of validation issues found"
  ],
  "key_findings": [
    "Important points discovered"
  ]
}

IMPORTANT:
- Return ONLY valid JSON
- Use null for missing fields
- Convert dates to YYYY-MM-DD format
- Be precise with document_type enum
- Provide detailed extracted_data
- Assess quality honestly

Begin analysis now:`;

      const response = await this.callBedrock(prompt, systemPrompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        console.error('❌ Failed to parse AI response');

        // Fallback analysis
        return {
          success: true,
          documentData: {
            user_id: userId,
            filename: filename,
            original_filename: filename,
            file_size: Buffer.byteLength(extractedText),
            mime_type: mimeType,
            upload_source: 'manual',
            parsing_status: 'completed',
            extracted_text: extractedText,
            document_type: 'general',
            document_category: 'Unclassified Document',
            confidence_score: 30,
            extracted_data: {
              summary: 'AI parsing failed, document saved without analysis',
              text_length: extractedText.length
            },
            page_count: metadata?.page_count,
            is_password_protected: false,
            processing_method: 'hybrid',
            ai_model_used: 'document_analysis_fallback',
            data_quality_score: 30
          }
        };
      }

      const aiResult = JSON.parse(jsonMatch[0]);

      console.log(`✅ Document classified as: ${aiResult.document_type}`);
      console.log(`   Category: ${aiResult.document_category}`);
      console.log(`   Confidence: ${aiResult.confidence_score}%`);

      // Calculate overall data quality score
      const qualityScore = aiResult.data_quality?.confidence_overall ||
        Math.round(
          (
            (aiResult.data_quality?.text_clarity || 50) +
            (aiResult.data_quality?.completeness || 50) +
            (aiResult.data_quality?.structure_quality || 50)
          ) / 3
        );

      return {
        success: true,
        documentData: {
          user_id: userId,
          filename: filename,
          original_filename: filename,
          file_size: Buffer.byteLength(extractedText),
          mime_type: mimeType,
          upload_source: 'manual',
          parsing_status: 'completed',
          parsing_error: aiResult.validation_errors?.length > 0
            ? aiResult.validation_errors.join('; ')
            : undefined,
          extracted_text: extractedText,
          document_type: aiResult.document_type || 'general',
          document_category: aiResult.document_category || 'General Document',
          confidence_score: aiResult.confidence_score || 50,
          extracted_data: {
            ...aiResult.extracted_data,
            key_findings: aiResult.key_findings || [],
            ai_analysis_timestamp: new Date().toISOString(),
            extraction_method: metadata?.extraction_method || 'python_extractor'
          },
          page_count: metadata?.page_count,
          is_password_protected: false,
          processing_method: 'hybrid',
          ai_model_used: 'document_analysis',
          data_quality_score: qualityScore,
          validation_errors: aiResult.validation_errors?.length > 0
            ? { errors: aiResult.validation_errors }
            : undefined
        }
      };

    } catch (error) {
      console.error('❌ Error in document content analysis:', error);

      // Return fallback data on error
      return {
        success: false,
        documentData: {
          user_id: userId,
          filename: filename,
          original_filename: filename,
          file_size: Buffer.byteLength(extractedText),
          mime_type: mimeType,
          upload_source: 'manual',
          parsing_status: 'failed',
          parsing_error: (error as Error).message,
          extracted_text: extractedText,
          document_type: 'general',
          document_category: 'Error During Classification',
          confidence_score: 0,
          extracted_data: {
            error: (error as Error).message,
            timestamp: new Date().toISOString()
          },
          page_count: metadata?.page_count,
          is_password_protected: false,
          processing_method: 'hybrid',
          ai_model_used: 'document_analysis_error',
          data_quality_score: 0,
          validation_errors: { errors: [(error as Error).message] }
        }
      };
    }
  }

}
