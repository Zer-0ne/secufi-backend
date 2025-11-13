import { AttachmentContent } from "./financial-data.service.js";
import { EmailMessage } from "../types/google.js";
interface FinancialAnalysisRequest {
    emailContent: string;
    subject: string;
    sender: string;
    attachmentContents?: AttachmentContent[];
    documentType: string;
}
interface PDFAnalysisRequest {
    text: string;
    documentType?: string;
}
interface AnalysisResult {
    success: boolean;
    extractedData: {
        transactionType?: any;
        amount?: number;
        currency: string;
        merchant?: string;
        description?: string;
        date?: string;
        accountNumber: string;
        confidence: number;
        assetCategory: any;
        assetType: string;
        assetSubType: string;
        status: string;
        bankName?: string;
        ifscCode?: string;
        branchName?: string;
        policyNumber?: string;
        folioNumber?: string;
        fundName?: string;
        financialMetadata: Record<string, any>;
        balance: any;
        total_value: any;
    };
    keyPoints: string[];
    summary: string;
    issues: string[];
    required_fields: string[];
    attachmentAnalyses: any;
}
export declare class AIService {
    private openaiKey;
    constructor(openaiKey?: string);
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
    classifyEmailSubjects(emailDataArray: EmailMessage[]): Promise<string[]>;
    /**
   * Enhanced local filtering for marketing and non-financial emails
   */
    private isMarketingOrCasualEmail;
    /**
     * Check if email is MAJOR financial only
     */
    private isMajorFinancialEmail;
    /**
     * Classify with multiple layers of filtering
     */
    classifyEmailSubjectsWithFiltering(emailDataArray: EmailMessage[]): Promise<string[]>;
    /**
   * ✅ NEW METHOD: Compare extracted user fields with existing user data
   * Returns array of missing field names
   */
    private checkMissingUserFields;
    /**
     * Safe wrapper for classification with local filtering
     */
    /**
     * Analyze financial email and extract transaction data
     */
    analyzeFinancialEmail(data: FinancialAnalysisRequest, userId: string): Promise<AnalysisResult>;
    /**
   * Validates extracted financial data and returns list of issues
   */
    /**
   * AI-powered file content analysis for detecting document-level issues
   */
    private analyzeFileContentIssues;
    /**
     * Complete validation with file content analysis
     */
    private validateExtractedData;
    private generateSmartSummary;
    /**
     * Fallback financial analysis using regex/keywords
     */
    private fallbackFinancialAnalysis;
    /**
     * Analyze PDF document and extract structured data
     */
    analyzePDFDocument(data: PDFAnalysisRequest): Promise<AnalysisResult>;
    /**
     * Guess password from email instructions and user details
     */
    guessPassword: (subject: string, body: string, userId: string) => Promise<string | false>;
    /**
     * Fallback PDF analysis using keywords
     */
    private fallbackPDFAnalysis;
    /**
     * Extract text from email and classify
     */
    classifyEmailContent(emailBody: string): Promise<{
        isFinancial: boolean;
        category: string;
        priority: 'high' | 'medium' | 'low';
    }>;
    /**
     * Classify email using keywords
     */
    private classifyUsingKeywords;
    /**
     * Call OpenAI API
     */
    private callOpenAI;
    /**
     * Get currency code from symbol
     */
    private getCurrencyCode;
}
export {};
//# sourceMappingURL=ai.service.d.ts.map