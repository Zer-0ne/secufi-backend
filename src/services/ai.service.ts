import { prisma } from "@/config/database";
import { AttachmentContent, EmailData } from "./financial-data.service";
import { EmailMessage } from "@/types/google";

interface FinancialAnalysisRequest {
  emailContent: string;
  subject: string;
  sender: string;
  attachmentContents?: AttachmentContent[];
  documentType: string;
}

interface EnhancedFinancialData {
  // Transaction fields
  transactionType: 'invoice' | 'payment' | 'receipt' | 'statement' | 'bill' | 'tax' | 'credit_card' | 'other';
  amount: number | null;
  currency: string;
  merchant: string;
  description: string;
  date: string;
  accountNumber: string | null;
  confidence: number;

  // Asset Classification (3 main categories)
  assetCategory: 'asset' | 'liability' | 'insurance';
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

export class AIService {
  private openaiKey: string;

  constructor(openaiKey?: string) {
    this.openaiKey = openaiKey || process.env.OPENAI_API_KEY || '';

    if (!this.openaiKey) {
      console.warn('⚠️ OpenAI API key not configured');
    } else {
      console.log('✓ OpenAI API key configured');
    }
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

      const response = await this.callOpenAI(prompt);
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
    data: FinancialAnalysisRequest
  ): Promise<AnalysisResult> {
    try {
      const prompt = `You are an expert financial document analyzer. Analyze this email and extract all financial information with proper categorization.

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
   - liquid_asset: Cash, savings, checking account, fixed deposits, money market funds
   - investment: Stocks, bonds, mutual funds, ETF, SIP, PPF, NPS, 401k, retirement accounts
   - real_estate: House, land, commercial property, rental property, real estate investment
   - vehicle: Car, bike, commercial vehicle, automobile
   - precious_metal: Gold, silver, platinum holdings, gold bonds
   - business: Business ownership, partnership shares, equity stake
   - digital_asset: Cryptocurrency, NFT, domain names, digital properties
   - receivable: Money owed to you, loans given, security deposits refundable

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
- pending: Awaiting activation/processing
- complete: Fully paid/matured
- missing: Information incomplete

🔍 EXTRACT ALL FIELDS AND RETURN JSON:
{
  "transactionType": "invoice|payment|receipt|statement|bill|tax|credit_card|other",
  "amount": number or null,
  "currency": "USD|INR|EUR|GBP|etc",
  "merchant": "company/bank/institution name",
  "description": "detailed description of transaction",
  "date": "YYYY-MM-DD",
  "accountNumber": "account/reference number",
  "confidence": 0-100,
  
  "assetCategory": "asset|liability|insurance",
  "assetType": "detailed type from above list",
  "assetSubType": "more specific classification if applicable",
  "status": "active|inactive|pending|complete|missing",
  
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
  "accountNumber": "XXXX-XXXX-XXXX-1234",
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
    "Outstanding balance: ₹15,000",
    "Minimum payment due: ₹750",
    "Payment due by: Oct 15, 2025"
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

Now analyze the provided email and return structured JSON:`;

      const response = await this.callOpenAI(prompt);
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

      return {
        success: true,
        extractedData: {
          // Basic transaction data
          transactionType: extracted.transactionType || 'other',
          amount: extracted.amount,
          currency: extracted.currency || 'INR',
          merchant: extracted.merchant,
          description: extracted.description,
          date: extracted.date,
          accountNumber: extracted.accountNumber,
          confidence: extracted.confidence || 50,

          // Enhanced classification
          assetCategory: extracted.assetCategory,
          assetType: extracted.assetType,
          assetSubType: extracted.assetSubType,
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
        },
        keyPoints: extracted.keyPoints || [],
        summary: this.generateSmartSummary(extracted),
        attachmentAnalyses,
      };
    } catch (error) {
      console.error('Error analyzing financial email:', error);
      return this.fallbackFinancialAnalysis(data);
    }
  }

  private generateSmartSummary(data: EnhancedFinancialData): string {
    const categoryEmoji = {
      asset: '💰',
      liability: '💳',
      insurance: '🛡️',
    }[data.assetCategory] || '📄';

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
        date,
        confidence,
      },
      keyPoints: [
        `Transaction Type: ${transactionType}`,
        amount ? `Amount: ${currency} ${amount}` : 'No amount found',
        `Merchant: ${merchant}`,
      ],
      summary: `Identified ${transactionType} with ${confidence}% confidence`,
    };
  }

  /**
   * Analyze PDF document and extract structured data
   */
  async analyzePDFDocument(data: PDFAnalysisRequest): Promise<AnalysisResult> {
    try {
      const prompt = `Analyze this document and extract key financial information:

Document Type: ${data.documentType || 'Unknown'}
Content: ${data.text}...

Please extract:
1. Document type (invoice, receipt, statement, etc.)
2. Key financial figures (amounts, totals)
3. Parties involved (sender, receiver, merchant)
4. Important dates
5. Account/Reference numbers
6. Any other critical financial information
7. Data quality score (0-100)

Return JSON format:
{
  "documentType": "invoice|receipt|statement|tax|contract|other",
  "keyFigures": [{"label": "string", "value": "string"}],
  "parties": {"sender": "string", "receiver": "string"},
  "dates": {"document": "YYYY-MM-DD", "due": "YYYY-MM-DD"},
  "referenceNumbers": {"invoice": "string", "account": "string"},
  "dataQuality": number,
  "keyFindings": ["finding 1", "finding 2"]
}`;

      const response = await this.callOpenAI(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return this.fallbackPDFAnalysis(data);
      }

      const extracted = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        extractedData: {
          transactionType: extracted.documentType || 'other',
          confidence: extracted.dataQuality || 50,
        },
        keyPoints: extracted.keyFindings,
        summary: `${extracted.documentType} with ${extracted.keyFigures.length} financial figures identified`,
      };
    } catch (error) {
      console.error('Error analyzing PDF document:', error);
      return this.fallbackPDFAnalysis(data);
    }
  }

  /**
   * Guess password from email instructions and user details
   */
  guessPassword = async (
    subject: string,
    body: string,
    userId: string
  ) => {
    try {
      // Fetch user details from database
      const userDetails = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          phone: true,
          date_of_birth: true,
          pan_number: true,
        },
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

      const prompt = `Read the email and identify password instructions for the attachment. If instructions are found and user details are provided, generate the password according to those instructions.

Email Subject: ${subject}
Email Body: ${body}${userInfo}

Instructions:
1. Look for password instructions in the email for password-protected attachments
2. If instructions found AND user details provided, generate the password exactly as instructed
3. Return ONLY the password string, nothing else
4. If no instructions found OR user details missing, return exactly "false"

Response (just password or "false"):`;

      console.log(prompt)
      const response = await this.callOpenAI(prompt);
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
        transactionType: docType,
        confidence: 70,
      },
      keyPoints: [
        `Document Type: ${docType}`,
        `Text Length: ${data.text.length} chars`,
      ],
      summary: `${docType} document analyzed`,
    };
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
        throw new Error(`OpenAI failed: ${response.status} - ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✓ OpenAI response received');
      return data.choices[0].message.content || '';
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
}
