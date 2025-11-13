import { prisma } from "../config/database.js";
export class AIService {
    openaiKey;
    constructor(openaiKey) {
        this.openaiKey = openaiKey || process.env.OPENAI_API_KEY || '';
        if (!this.openaiKey) {
            console.warn('⚠️ OpenAI API key not configured');
        }
        else {
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
    async classifyEmailSubjects(emailDataArray) {
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
            const financialIndices = JSON.parse(jsonMatch[0]);
            // Convert indices to email IDs
            const financialEmailIds = financialIndices
                .map(index => {
                const idx = parseInt(index);
                return emailDataArray[idx]?.id;
            })
                .filter((id) => id !== undefined);
            console.log(`✅ Found ${financialEmailIds.length} major financial emails out of ${emailDataArray.length}`);
            if (financialEmailIds.length < emailDataArray.length) {
                console.log(`⏭️  Filtered out ${emailDataArray.length - financialEmailIds.length} non-critical emails`);
            }
            return financialEmailIds;
        }
        catch (error) {
            console.error('❌ Error classifying email subjects:', error);
            return [];
        }
    }
    /**
   * Enhanced local filtering for marketing and non-financial emails
   */
    isMarketingOrCasualEmail(emailData) {
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
    isMajorFinancialEmail(emailData) {
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
    async classifyEmailSubjectsWithFiltering(emailDataArray) {
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
            console.log(`\n📊 After local filter: ${emailDataArray.length} → ${afterLocalFilter.length}\n`);
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
            console.log(`\n💰 Major financial emails: ${majorFinancialEmails.length}\n`);
            if (majorFinancialEmails.length === 0) {
                console.log('⚠️ No major financial emails found');
                return [];
            }
            // Step 3: AI classification for final confirmation (optional, for edge cases)
            const aiConfirmed = await this.classifyEmailSubjects(majorFinancialEmails);
            console.log(`✅ Final after AI filtering: ${aiConfirmed.length} emails\n`);
            return aiConfirmed;
        }
        catch (error) {
            console.error('❌ Error in filtered classification:', error);
            return [];
        }
    }
    /**
   * ✅ NEW METHOD: Compare extracted user fields with existing user data
   * Returns array of missing field names
   */
    async checkMissingUserFields(userId, requiredFields) {
        try {
            // Fetch user profile from database
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    name: true,
                    phone: true,
                    email: true,
                    address: true,
                    pan_number: true,
                    aadhar_number: true,
                    date_of_birth: true,
                    crn_number: true,
                },
            });
            if (!user) {
                console.warn(`⚠️ User not found: ${userId}`);
                return [];
            }
            const missingFields = [];
            // Map of required fields to user profile fields
            const fieldMap = {
                name: 'name',
                phone: 'phone',
                email: 'email',
                address: 'address',
                pan_number: 'pan_number',
                aadhar_number: 'aadhar_number',
                date_of_birth: 'date_of_birth',
                crn_number: 'crn_number',
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
            }
            else {
                console.log('✅ All required fields present in user profile');
            }
            return missingFields;
        }
        catch (error) {
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
    async analyzeFinancialEmail(data, userId) {
        try {
            const prompt = `You are an expert financial document analyzer. Analyze this email and extract all financial information with proper categorization.

Subject: ${data.subject}
From: ${data.sender}
Content: ${data.emailContent}
Attachments: ${data.attachmentContents
                ?.map((att) => `${att.filename} (${att.mimeType}, ${att.size} bytes, content: ${att.content.substring(0, 1000)}...)`)
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

Now analyze the provided email and return structured JSON:`;
            const response = await this.callOpenAI(prompt);
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.log('No JSON found, using fallback analysis');
                return this.fallbackFinancialAnalysis(data);
            }
            // Parse attachment analysis separately
            let attachmentAnalyses = [];
            if (data.attachmentContents && data.attachmentContents.length > 0) {
                for (const att of data.attachmentContents) {
                    const attAnalysis = await this.analyzePDFDocument({
                        text: att.content,
                        documentType: data.documentType || 'financial',
                    });
                    attachmentAnalyses.push(attAnalysis);
                }
            }
            const extracted = JSON.parse(jsonMatch[0]);
            const issues = await this.validateExtractedData(extracted, data.attachmentContents);
            ;
            console.log('extracted.requiredUserFields :: ', extracted.requiredUserFields);
            const requiredFields = await this.checkMissingUserFields(userId, extracted.requiredUserFields || {});
            console.log('requiredFields :: ', requiredFields);
            if (issues.length > 0) {
                console.log('⚠️ Validation Issues Found:', issues);
            }
            else {
                console.log('✅ No validation issues detected');
            }
            return {
                success: true,
                extractedData: {
                    // Basic transaction data
                    transactionType: extracted.transactionType || 'other',
                    // amount: extracted.amount,
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
                    balance: extracted.financialMetadata?.currentValue ||
                        extracted.financialMetadata?.outstandingBalance ||
                        extracted.amount, // fallback
                    total_value: extracted.financialMetadata?.totalValue ||
                        extracted.financialMetadata?.coverageAmount ||
                        extracted.amount, // fallback
                },
                keyPoints: extracted.keyPoints || [],
                summary: this.generateSmartSummary(extracted),
                attachmentAnalyses,
                issues,
                required_fields: requiredFields,
            };
        }
        catch (error) {
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
    async analyzeFileContentIssues(fileContent, fileName, mimeType) {
        const contentIssues = [];
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
            const aiResponse = await this.callOpenAI(aiContentPrompt);
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const aiResult = JSON.parse(jsonMatch[0]);
                if (aiResult.issues && Array.isArray(aiResult.issues)) {
                    contentIssues.push(...aiResult.issues);
                }
            }
            // Remove duplicates
            return [...new Set(contentIssues)];
        }
        catch (error) {
            console.error('Error analyzing file content:', error);
            contentIssues.push('Failed to analyze file content quality');
            return contentIssues;
        }
    }
    /**
     * Complete validation with file content analysis
     */
    async validateExtractedData(extracted, attachmentContents) {
        const issues = [];
        // =====================================
        // 1. CONFIDENCE SCORE CHECK
        // =====================================
        if (extracted.confidence < 60) {
            issues.push(`Low confidence score: ${extracted.confidence}%`);
        }
        else if (extracted.confidence < 80) {
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
        if (!extracted.amount &&
            !extracted.financialMetadata?.currentValue &&
            !extracted.financialMetadata?.totalValue) {
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
        // 4. DATE VALIDATION [web:1]
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
            }
            else if (extractedDate > currentDate) {
                issues.push('Future date detected - verify transaction date');
            }
            else if (extractedDate < fiveYearsAgo) {
                issues.push(`Very old transaction date: ${extracted.date} - verify if historical data`);
            }
            else if (extractedDate < oneYearAgo) {
                issues.push(`Old transaction date: ${extracted.date} - verify if accurate`);
            }
        }
        else {
            issues.push('Missing transaction date');
        }
        // =====================================
        // 5. BANK ACCOUNT VALIDATION [web:1]
        // =====================================
        if (extracted.accountNumber) {
            const digitsOnly = extracted.accountNumber.replace(/[^0-9]/g, '');
            // Indian bank account: 9-18 digits
            if (!/^\d{9,18}$/.test(digitsOnly)) {
                issues.push('Invalid account number format (expected 9-18 digits)');
            }
        }
        if (extracted.ifscCode) {
            // IFSC format: 4 letters + 0 + 6 alphanumeric (e.g., SBIN0001234) [web:1]
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
                if (extracted.financialMetadata?.outstandingBalance &&
                    extracted.financialMetadata?.creditLimit) {
                    const utilization = (extracted.financialMetadata.outstandingBalance / extracted.financialMetadata.creditLimit) *
                        100;
                    if (utilization > 100) {
                        issues.push('Credit card over limit - verify outstanding balance');
                    }
                    else if (utilization > 80) {
                        issues.push('High credit utilization (>80%) - consider payment');
                    }
                }
            }
            // Loan specific
            if (extracted.assetType === 'home_loan' ||
                extracted.assetType === 'vehicle_loan' ||
                extracted.assetType === 'education_loan') {
                if (!extracted.financialMetadata?.interestRate) {
                    issues.push('Loan missing interest rate information');
                }
                if (!extracted.financialMetadata?.emiAmount) {
                    issues.push('Loan missing EMI amount');
                }
            }
        }
        if (extracted.assetCategory === 'insurance') {
            // Insurance should have policy number [web:7]
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
                if (extracted.financialMetadata?.purchasePrice &&
                    extracted.financialMetadata?.currentValue) {
                    const returns = ((extracted.financialMetadata.currentValue - extracted.financialMetadata.purchasePrice) /
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
        // 10. METADATA COMPLETENESS CHECK [web:2][web:3]
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
        // 13. DOCUMENT QUALITY CHECK [web:7]
        // =====================================
        if (extracted.confidence < 50) {
            issues.push('Poor document quality - OCR extraction unreliable (confidence <50%)');
        }
        // =====================================
        // 14. 🆕 FILE CONTENT ANALYSIS [web:11][web:16][web:19][web:28]
        // =====================================
        if (attachmentContents && attachmentContents.length > 0) {
            for (const attachment of attachmentContents) {
                console.log(`🔍 Analyzing file content: ${attachment.filename}`);
                const fileContentIssues = await this.analyzeFileContentIssues(attachment.content, attachment.filename, attachment.mimeType);
                if (fileContentIssues.length > 0) {
                    // Prefix with filename for clarity
                    fileContentIssues.forEach((issue) => {
                        issues.push(`[${attachment.filename}] ${issue}`);
                    });
                }
                // File size validation [web:28]
                if (attachment.size === 0) {
                    issues.push(`[${attachment.filename}] File is empty (0 bytes)`);
                }
                else if (attachment.size < 100) {
                    issues.push(`[${attachment.filename}] File size too small (${attachment.size} bytes) - possible corruption`);
                }
                else if (attachment.size > 10 * 1024 * 1024) {
                    // 10MB
                    issues.push(`[${attachment.filename}] Large file size (${(attachment.size / 1024 / 1024).toFixed(2)} MB) - may impact processing`);
                }
                // MIME type validation
                const validMimeTypes = [
                    'application/pdf',
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword',
                    'text/csv',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ];
                if (!validMimeTypes.includes(attachment.mimeType)) {
                    issues.push(`[${attachment.filename}] Unsupported or unusual file type: ${attachment.mimeType}`);
                }
            }
        }
        // =====================================
        // 15. CROSS-FIELD VALIDATION
        // =====================================
        // EMI vs Outstanding Balance check
        if (extracted.financialMetadata?.emiAmount &&
            extracted.financialMetadata?.outstandingBalance) {
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
    generateSmartSummary(data) {
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
    fallbackFinancialAnalysis(data) {
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
        const merchantMatch = content.match(/(?:from|merchant|company|bank|account|issued by):\s*([a-z\s]+?)(?:\.|,|$)/i);
        const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';
        const dateMatch = content.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/);
        let date = null;
        if (dateMatch) {
            try {
                date = new Date(dateMatch[1]).toISOString().split('T')[0];
            }
            catch (e) {
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
                date: data,
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
    async analyzePDFDocument(data) {
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
        }
        catch (error) {
            console.error('Error analyzing PDF document:', error);
            return this.fallbackPDFAnalysis(data);
        }
    }
    /**
     * Guess password from email instructions and user details
     */
    guessPassword = async (subject, body, userId) => {
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
            const details = [];
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
            console.log(prompt);
            const response = await this.callOpenAI(prompt);
            const password = response.trim();
            // console.log(response,password)
            // Check if AI returned false
            if (password.toLowerCase() === 'false' ||
                password.toLowerCase() === 'none' ||
                password.length === 0 ||
                password.length > 50) {
                console.log('❌ Cannot generate password');
                return false;
            }
            console.log('✅ Password generated');
            return password;
        }
        catch (error) {
            console.error('Error guessing password:', error);
            return false;
        }
    };
    /**
     * Fallback PDF analysis using keywords
     */
    fallbackPDFAnalysis(data) {
        const text = data.text.toLowerCase();
        let docType = 'other';
        if (text.includes('invoice'))
            docType = 'invoice';
        else if (text.includes('receipt'))
            docType = 'receipt';
        else if (text.includes('statement'))
            docType = 'statement';
        else if (text.includes('1099') || text.includes('tax'))
            docType = 'tax';
        else if (text.includes('contract'))
            docType = 'contract';
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
    async classifyEmailContent(emailBody) {
        try {
            return this.classifyUsingKeywords(emailBody);
        }
        catch (error) {
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
    classifyUsingKeywords(emailBody) {
        const content = emailBody.toLowerCase();
        const financialKeywords = {
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
                if (priorityOrder[metadata.priority] >
                    priorityOrder[maxPriority]) {
                    maxPriority = metadata.priority;
                }
            }
        }
        return {
            isFinancial,
            category: matchedCategory,
            priority: maxPriority,
        };
    }
    /**
     * Call OpenAI API
     */
    async callOpenAI(prompt) {
        if (!this.openaiKey) {
            throw new Error('OpenAI API key not configured');
        }
        try {
            console.log('⟳ Calling OpenAI API...');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            });
            if (!response.ok) {
                const error = await response.json();
                console.error('OpenAI error:', error);
                throw new Error(`OpenAI failed: ${response.status} - ${error.error?.message || 'Unknown error'}`);
            }
            const data = await response.json();
            console.log('✓ OpenAI response received');
            return data.choices[0].message.content || '';
        }
        catch (error) {
            console.error('OpenAI API failed:', error);
            throw error;
        }
    }
    /**
     * Get currency code from symbol
     */
    getCurrencyCode(symbol) {
        const codes = {
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
//# sourceMappingURL=ai.service.js.map