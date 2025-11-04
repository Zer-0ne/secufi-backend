import { AttachmentContent } from "./financial-data.service";
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
        transactionType: string;
        amount?: number;
        currency?: string;
        merchant?: string;
        description?: string;
        date?: string;
        accountNumber?: string;
        confidence: number;
    };
    keyPoints?: string[];
    summary?: string;
}
export declare class AIService {
    private openaiKey;
    constructor(openaiKey?: string);
    /**
     * Analyze financial email and extract transaction data
     */
    analyzeFinancialEmail(data: FinancialAnalysisRequest): Promise<AnalysisResult>;
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