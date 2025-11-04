# AI Service API Reference

This document provides comprehensive documentation for the AI-powered services used in the application, including detailed API references, usage examples, and best practices.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Key Classes and Interfaces](#key-classes-and-interfaces)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Rate Limiting and Quotas](#rate-limiting-and-quotas)

## Overview
The AI Service provides a robust interface for various AI-powered functionalities, including but not limited to:
- Financial document analysis and data extraction
- Email content classification and processing
- Secure password strength evaluation
- PDF document processing and text extraction
- Natural language understanding and processing

The service leverages OpenAI's powerful language models to provide accurate and efficient processing of various document types and content.

## Getting Started

### Prerequisites
- Node.js 14.0.0 or later
- An OpenAI API key (for production use)
- Required environment variables set in your `.env` file

### Installation
```bash
# Install required dependencies
npm install openai pdf-parse

# Set up environment variables
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
```

### Basic Setup
```typescript
import { AIService } from '../services/aiService';

// Initialize with API key from environment variables
const aiService = new AIService();

// Or initialize with a specific API key
const aiServiceWithKey = new AIService('your-openai-api-key');
```

## Key Classes and Interfaces

### AIService Class
Core service class that provides AI-powered functionality.

#### Constructor
```typescript
new AIService(openaiKey?: string, config?: AIServiceConfig)
```

**Parameters:**
- `openaiKey`: `string` (optional) - Your OpenAI API key. If not provided, uses `process.env.OPENAI_API_KEY`
- `config`: `AIServiceConfig` (optional) - Configuration object for the AI service

**Configuration Options:**
```typescript
interface AIServiceConfig {
  model?: string;           // Default: 'gpt-4-1106-preview'
  temperature?: number;     // Default: 0.2
  maxTokens?: number;       // Default: 2000
  timeout?: number;         // Default: 30000 (30 seconds)
  maxRetries?: number;      // Default: 3
  retryDelay?: number;      // Default: 1000 (1 second)
  organization?: string;    // OpenAI organization ID
}
```

## API Reference

### analyzeFinancialEmail
Analyzes financial emails and extracts structured transaction data.

```typescript
async analyzeFinancialEmail(data: FinancialAnalysisRequest): Promise<AnalysisResult>
```

**Parameters:**
- `data`: `FinancialAnalysisRequest` - The request object containing email content and analysis parameters

**Returns:** `Promise<AnalysisResult>` - The analysis result with extracted transaction data

**Request Interface:**
```typescript
interface FinancialAnalysisRequest {
  emailContent: string;       // Raw email content to analyze
  emailMetadata?: {
    subject?: string;         // Email subject
    from?: string;            // Sender email address
    date?: string;            // Email date
    attachments?: Array<{
      filename: string;       // Attachment filename
      contentType: string;    // MIME type
      size: number;           // File size in bytes
      content: string;        // Base64-encoded content
    }>;
  };
  options?: {
    extractItems?: boolean;   // Whether to extract line items (default: true)
    currency?: string;        // Default currency (e.g., 'USD', 'EUR')
    language?: string;        // Language code (e.g., 'en', 'fr', 'de')
    timeout?: number;         // Request timeout in milliseconds
  };
}
```

**Response Interface:**
```typescript
interface AnalysisResult {
  success: boolean;           // Whether the analysis was successful
  transaction: {
    type: 'invoice' | 'receipt' | 'payment' | 'other';
    amount: number;           // Transaction amount
    currency: string;         // Currency code (e.g., 'USD')
    date: string;             // ISO date string
    vendor: {
      name: string;           // Vendor/business name
      taxId?: string;         // Tax/VAT ID if available
      address?: string;       // Vendor address
    };
    items?: Array<{
      description: string;     // Item description
      quantity: number;       // Item quantity
      unitPrice: number;      // Price per unit
      amount: number;         // Total amount (quantity * unitPrice)
      taxRate?: number;       // Tax rate percentage
      taxAmount?: number;     // Tax amount
    }>;
    subtotal?: number;        // Subtotal before tax
    taxTotal?: number;        // Total tax amount
    total: number;            // Grand total
    paymentMethod?: string;   // Payment method if specified
    reference?: string;       // Invoice/receipt number
    dueDate?: string;         // Due date for payment (ISO string)
  };
  metadata: {
    processingTime: number;   // Processing time in milliseconds
    model: string;            // AI model used for analysis
    confidence: number;       // Confidence score (0-1)
    rawData?: any;            // Raw response from AI model
  };
  warnings?: string[];        // Any non-critical warnings
  error?: {
    code: string;            // Error code
    message: string;         // Human-readable error message
    details?: any;           // Additional error details
  };
}
```

**Example Usage:**
```typescript
try {
  const result = await aiService.analyzeFinancialEmail({
    emailContent: 'Invoice #12345 from Example Corp...',
    emailMetadata: {
      subject: 'Invoice #12345 from Example Corp',
      from: 'billing@example.com',
      date: '2025-11-02T10:30:00Z'
    },
    options: {
      currency: 'USD',
      language: 'en',
      extractItems: true
    }
  });

  if (result.success) {
    console.log('Transaction amount:', result.transaction.amount);
    console.log('Vendor:', result.transaction.vendor.name);
    result.transaction.items?.forEach(item => {
      console.log(`- ${item.quantity}x ${item.description}: $${item.amount}`);
    });
  } else {
    console.error('Analysis failed:', result.error?.message);
  }
} catch (error) {
  console.error('Error analyzing email:', error);
}
```
- `data`: FinancialAnalysisRequest object containing:
  - `emailContent`: string (email body text)
  - `subject`: string (email subject)
  - `sender`: string (email sender)
  - `attachmentContents`: AttachmentContent[] (optional, attachment data)
  - `documentType`: string (type of document)

**Returns:** AnalysisResult with extracted financial data

**Response Structure:**
```typescript
{
  success: boolean,
  extractedData: {
    transactionType: 'invoice' | 'payment' | 'receipt' | 'statement' | 'bill' | 'tax' | 'credit_card' | 'other',
    amount: number | null,
    currency: string,
    merchant: string,
    description: string,
    date: string,
    accountNumber: string | null,
    confidence: number,
    assetCategory: 'asset' | 'liability' | 'insurance' | 'other',
    assetType: string,
    assetSubType: string | null,
    financialMetadata: {
      isRecurring: boolean,
      frequency?: 'monthly' | 'quarterly' | 'yearly' | 'one-time',
      dueDate?: string,
      gracePeriod?: number,
      penaltyAmount?: number,
      interestRate?: number,
      maturityDate?: string,
      policyNumber?: string,
      coverageAmount?: number,
      premium?: number,
      beneficiary?: string,
      outstandingBalance?: number,
      minimumPayment?: number,
      creditLimit?: number,
      currentValue?: number,
      purchasePrice?: number,
      appreciationRate?: number
    }
  },
  keyPoints: string[],
  summary: string,
  attachmentAnalyses?: any[]
}
```

### analyzePDFDocument(data: PDFAnalysisRequest): Promise<AnalysisResult>
Analyzes PDF documents and extracts structured data.

**Parameters:**
- `data`: PDFAnalysisRequest object containing:
  - `text`: string (extracted text from PDF)
  - `documentType`: string (optional, type of document)

**Returns:** AnalysisResult with extracted document data

### guessPassword(subject: string, body: string, userId: string): Promise<string | false>
Attempts to guess password for password-protected attachments based on email instructions and user details.

**Parameters:**
- `subject`: string (email subject)
- `body`: string (email body)
- `userId`: string (user ID to fetch details from database)

**Returns:** Password string or false if unable to guess

### classifyEmailContent(emailBody: string): Promise<{isFinancial: boolean, category: string, priority: 'high' | 'medium' | 'low'}>
Classifies email content to determine if it's financial and assigns priority.

**Parameters:**
- `emailBody`: string (email content to classify)

**Returns:** Classification result

## Asset Categories

### Asset Category Types
- **liquid_asset**: Cash, savings, checking account, fixed deposits, money market
- **investment**: Stocks, bonds, mutual funds, ETF, SIP, 401k, retirement accounts
- **real_estate**: House, land, commercial property, rental property
- **vehicle**: Car, bike, commercial vehicle
- **precious_metal**: Gold, silver, platinum holdings
- **business**: Business ownership, partnership shares
- **digital_asset**: Cryptocurrency, NFT, domain names
- **receivable**: Money owed to you, loans given, security deposits

### Liability Category Types
- **home_loan**: Mortgage, home equity loan
- **vehicle_loan**: Car loan, bike loan, auto finance
- **personal_loan**: Unsecured personal loan, peer loan
- **credit_card**: Credit card debt, outstanding balance
- **education_loan**: Student loan, education financing
- **business_loan**: Business credit, commercial loan
- **medical_debt**: Hospital bills, medical financing
- **utility_bill**: Electricity, water, gas, internet, phone
- **tax_liability**: Income tax, property tax, GST
- **emi**: EMI payments for any purchase
- **payable**: Money you owe, vendor payments

### Insurance Category Types
- **life_insurance**: Term, whole life, endowment, ULIP
- **health_insurance**: Medical, hospitalization, family floater
- **vehicle_insurance**: Car, bike insurance (comprehensive/third-party)
- **home_insurance**: Property, fire, earthquake coverage
- **travel_insurance**: International, domestic travel
- **business_insurance**: Professional indemnity, liability
- **critical_illness**: Cancer, heart disease coverage
- **accident_insurance**: Personal accident, disability
- **liability_insurance**: Public liability, professional liability

## Transaction Types
- `invoice`: Billing documents
- `payment`: Payment confirmations
- `receipt`: Purchase receipts
- `statement`: Account/bank statements
- `bill`: Utility bills, credit card bills
- `tax`: Tax documents, 1099 forms
- `credit_card`: Credit card related documents
- `other`: Unclassified documents

## Error Handling
- OpenAI API failures fall back to keyword-based analysis
- Missing API keys result in warnings but don't break functionality
- Invalid responses are handled with fallback methods

## Dependencies
- OpenAI API for advanced analysis
- Prisma for user data access
- Custom utility functions for data processing
