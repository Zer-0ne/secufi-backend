# Complete Email Processing API Reference with Attachments

## Base URL

```
http://localhost:5000/api/email-processing
```

***

## Main Endpoints

### 1. Analyze All Emails with Attachments

**Endpoint:** `POST /api/email-processing/analyze/:userId`

**Description:** Automatically fetch emails from Gmail, process all financial attachments (PDFs, images, spreadsheets), extract text, analyze with AI, and save everything to database.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID |

**Request Body:**
```json
{
  "limit": 30
}
```

**Body Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 20 | Number of emails to process |

**Request Example:**
```bash
curl -X POST "http://localhost:5000/api/email-processing/analyze/9494410c-9996-4d13-afc3-2937c2470807" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 50
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Processed 18 out of 50 emails",
  "results": [
    {
      "emailId": "185ea3d5e2b85c53",
      "subject": "Invoice #INV-001 from ABC Corp",
      "processed": true,
      "transactionId": "550e8400-e29b-41d4-a716-446655440000",
      "emailAnalysis": {
        "success": true,
        "extractedData": {
          "transactionType": "invoice",
          "amount": 5000,
          "currency": "USD",
          "merchant": "ABC Corp",
          "description": "Monthly subscription and services",
          "date": "2025-10-30",
          "accountNumber": "INV-001",
          "confidence": 95
        },
        "keyPoints": [
          "Professional services invoice",
          "Amount: $5,000.00",
          "Payment due: Nov 30, 2025"
        ],
        "summary": "Identified invoice of 5000 USD from ABC Corp"
      },
      "attachmentAnalyses": [
        {
          "pdfDocumentId": "550e8400-e29b-41d4-a716-446655440010",
          "documentId": "550e8400-e29b-41d4-a716-446655440011",
          "fileName": "Invoice_ABC_Corp_Oct2025.pdf",
          "analysis": {
            "success": true,
            "extractedData": {
              "transactionType": "invoice",
              "confidence": 98
            },
            "keyPoints": [
              "Invoice document with detailed itemization",
              "Line items: 3",
              "Total: $5,000.00",
              "Tax: $400.00"
            ],
            "summary": "invoice with 5 financial figures identified"
          }
        },
        {
          "pdfDocumentId": "550e8400-e29b-41d4-a716-446655440012",
          "documentId": "550e8400-e29b-41d4-a716-446655440013",
          "fileName": "Supporting_Documentation.pdf",
          "analysis": {
            "extractedData": {
              "transactionType": "invoice",
              "confidence": 85
            }
          }
        }
      ],
      "totalAttachments": 2
    },
    {
      "emailId": "185ea3d5e2b85c54",
      "subject": "Bank Statement - October 2025",
      "processed": true,
      "transactionId": "550e8400-e29b-41d4-a716-446655440001",
      "emailAnalysis": {
        "extractedData": {
          "transactionType": "statement",
          "amount": 15000,
          "currency": "USD",
          "merchant": "Bank Name",
          "confidence": 92
        }
      },
      "attachmentAnalyses": [
        {
          "pdfDocumentId": "550e8400-e29b-41d4-a716-446655440014",
          "documentId": "550e8400-e29b-41d4-a716-446655440015",
          "fileName": "Statement_Oct_2025.pdf",
          "analysis": {
            "extractedData": {
              "transactionType": "statement",
              "confidence": 96
            }
          }
        }
      ],
      "totalAttachments": 1
    },
    {
      "emailId": "185ea3d5e2b85c55",
      "subject": "Payment Receipt",
      "processed": false,
      "reason": "Not a financial email"
    }
  ],
  "summary": {
    "totalEmails": 50,
    "processedEmails": 18,
    "failedEmails": 32
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authenticated. Please connect Google account first."
}
```

**What Happens Behind the Scenes:**
- Fetches emails from Gmail
- Classifies each email as financial or not
- Extracts all attachments (PDFs, images, spreadsheets)
- Checks if attachment is financial document
- Extracts text from each attachment
- Sends both email + attachments to AI for analysis
- Saves transaction + all documents to database
- Returns complete analysis

**Frontend Implementation:**
```typescript
async function analyzeAllFinancialEmails(userId: string) {
  const response = await fetch(
    `http://localhost:5000/api/email-processing/analyze/${userId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 100 }),
    }
  );

  const { success, results, summary } = await response.json();

  if (success) {
    console.log(`✓ Processed ${summary.processedEmails} emails`);
    
    results.forEach((result) => {
      if (result.processed) {
        const totalAttachments = result.totalAttachments || 0;
        const amount = result.emailAnalysis?.extractedData?.amount;
        
        console.log(`📧 ${result.subject}`);
        console.log(`   Amount: $${amount}`);
        console.log(`   Attachments: ${totalAttachments}`);
        
        result.attachmentAnalyses?.forEach((attachment) => {
          console.log(`   📄 ${attachment.fileName}`);
          console.log(`      Confidence: ${attachment.analysis.extractedData.confidence}%`);
        });
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Total: ${summary.totalEmails}`);
    console.log(`   Processed: ${summary.processedEmails}`);
    console.log(`   Failed: ${summary.failedEmails}`);
  }
}
```

***

### 2. Get All Financial Data

**Endpoint:** `GET /api/email-processing/financial-data/:userId`

**Description:** Retrieve all processed financial data including transactions and documents with optional filtering

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | string | No | - | Filter start date (YYYY-MM-DD) |
| endDate | string | No | - | Filter end date (YYYY-MM-DD) |
| transactionType | string | No | - | Filter by type (invoice\|receipt\|payment\|statement\|tax\|bill) |
| limit | number | No | 50 | Max results |

**Request Examples:**
```bash
# Get all financial data
curl -X GET "http://localhost:5000/api/email-processing/financial-data/9494410c-9996-4d13-afc3-2937c2470807"

# Get only invoices
curl -X GET "http://localhost:5000/api/email-processing/financial-data/9494410c-9996-4d13-afc3-2937c2470807?transactionType=invoice"

# Get data from October
curl -X GET "http://localhost:5000/api/email-processing/financial-data/9494410c-9996-4d13-afc3-2937c2470807?startDate=2025-10-01&endDate=2025-10-31"

# Get invoices from October with limit
curl -X GET "http://localhost:5000/api/email-processing/financial-data/9494410c-9996-4d13-afc3-2937c2470807?transactionType=invoice&startDate=2025-10-01&endDate=2025-10-31&limit=100"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Financial data retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "9494410c-9996-4d13-afc3-2937c2470807",
        "email_id": "185ea3d5e2b85c53",
        "subject": "Invoice #INV-001 from ABC Corp",
        "sender": "invoice@abccorp.com",
        "recipient": "User",
        "amount": 5000,
        "currency": "USD",
        "transaction_type": "invoice",
        "merchant": "ABC Corp",
        "description": "Monthly subscription and services",
        "transaction_date": "2025-10-30T10:30:00Z",
        "email_date": "2025-10-30T10:30:00Z",
        "status": "processed",
        "extracted_data": {
          "transactionType": "invoice",
          "amount": 5000,
          "currency": "USD",
          "merchant": "ABC Corp",
          "confidence": 95,
          "attachmentCount": 2
        },
        "raw_data": {
          "emailContent": "Invoice content...",
          "hasAttachments": 2,
          "classification": {
            "isFinancial": true,
            "category": "invoice",
            "priority": "high"
          }
        },
        "pdf_documents": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440010",
            "filename": "Invoice_ABC_Corp_Oct2025.pdf",
            "original_filename": "Invoice_ABC_Corp_Oct2025.pdf",
            "mime_type": "application/pdf",
            "file_size": "245000",
            "parsing_status": "completed",
            "extracted_data": {
              "transactionType": "invoice",
              "confidence": 98
            }
          }
        ],
        "created_at": "2025-10-30T10:30:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "user_id": "9494410c-9996-4d13-afc3-2937c2470807",
        "email_id": "185ea3d5e2b85c54",
        "subject": "Bank Statement - October 2025",
        "sender": "statements@bank.com",
        "recipient": "User",
        "amount": 15000,
        "currency": "USD",
        "transaction_type": "statement",
        "merchant": "Bank Name",
        "extracted_data": {
          "transactionType": "statement",
          "confidence": 92
        },
        "pdf_documents": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440014",
            "filename": "Statement_Oct_2025.pdf"
          }
        ]
      }
    ],
    "documents": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "user_id": "9494410c-9996-4d13-afc3-2937c2470807",
        "filename": "Invoice_ABC_Corp_Oct2025.pdf",
        "original_filename": "Invoice_ABC_Corp_Oct2025.pdf",
        "document_type": "invoice",
        "document_category": "invoice",
        "confidence_score": 98,
        "file_size": "245000",
        "page_count": 3,
        "parsing_status": "completed",
        "extracted_data": {
          "transactionType": "invoice",
          "confidence": 98
        },
        "created_at": "2025-10-30T10:30:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440015",
        "user_id": "9494410c-9996-4d13-afc3-2937c2470807",
        "filename": "Statement_Oct_2025.pdf",
        "document_type": "statement",
        "document_category": "statement",
        "confidence_score": 96,
        "file_size": "512000",
        "page_count": 5
      }
    ],
    "summary": {
      "totalTransactions": 28,
      "totalPDFs": 42,
      "totalAmount": 125000,
      "byType": {
        "invoice": 12,
        "receipt": 8,
        "payment": 5,
        "statement": 3
      }
    }
  }
}
```

**Frontend Implementation:**
```typescript
async function getFinancialSummary(userId: string) {
  const response = await fetch(
    `http://localhost:5000/api/email-processing/financial-data/${userId}`
  );

  const { data } = await response.json();

  console.log('📊 Financial Summary:');
  console.log(`Total Transactions: ${data.summary.totalTransactions}`);
  console.log(`Total Documents: ${data.summary.totalPDFs}`);
  console.log(`Total Amount: $${data.summary.totalAmount}`);
  console.log(`\nBreakdown by Type:`);
  
  Object.entries(data.summary.byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  // List recent invoices
  const invoices = data.transactions.filter(
    (t) => t.transaction_type === 'invoice'
  );
  
  console.log(`\nRecent Invoices:`);
  invoices.forEach((invoice) => {
    console.log(`  ${invoice.subject}: $${invoice.amount}`);
    invoice.pdf_documents.forEach((doc) => {
      console.log(`    📄 ${doc.filename}`);
    });
  });
}
```

***

### 3. Search Financial Data

**Endpoint:** `GET /api/email-processing/search/:userId`

**Description:** Search through all transactions and documents by keyword

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (keyword, merchant, amount, etc.) |

**Request Examples:**
```bash
# Search for invoices
curl -X GET "http://localhost:5000/api/email-processing/search/9494410c-9996-4d13-afc3-2937c2470807?q=invoice"

# Search by merchant
curl -X GET "http://localhost:5000/api/email-processing/search/9494410c-9996-4d13-afc3-2937c2470807?q=ABC%20Corp"

# Search by amount
curl -X GET "http://localhost:5000/api/email-processing/search/9494410c-9996-4d13-afc3-2937c2470807?q=5000"

# Search by document type
curl -X GET "http://localhost:5000/api/email-processing/search/9494410c-9996-4d13-afc3-2937c2470807?q=statement"

# Search by filename
curl -X GET "http://localhost:5000/api/email-processing/search/9494410c-9996-4d13-afc3-2937c2470807?q=Invoice_ABC"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Search completed",
  "data": {
    "transactions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email_id": "185ea3d5e2b85c53",
        "subject": "Invoice #INV-001 from ABC Corp",
        "merchant": "ABC Corp",
        "amount": 5000,
        "currency": "USD",
        "transaction_type": "invoice",
        "description": "Monthly subscription",
        "sender": "invoice@abccorp.com",
        "transaction_date": "2025-10-30T10:30:00Z",
        "pdf_documents": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440010",
            "filename": "Invoice_ABC_Corp_Oct2025.pdf"
          }
        ]
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "subject": "Credit Note - ABC Corp",
        "merchant": "ABC Corp",
        "amount": 500,
        "transaction_type": "receipt"
      }
    ],
    "documents": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "filename": "Invoice_ABC_Corp_Oct2025.pdf",
        "document_type": "invoice",
        "confidence_score": 98,
        "extracted_data": {
          "transactionType": "invoice",
          "confidence": 98
        }
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "filename": "ABC_Corp_Payment_Confirmation.pdf",
        "document_type": "payment",
        "confidence_score": 92
      }
    ],
    "totalResults": 4
  }
}
```

**Frontend Implementation:**
```typescript
async function searchTransactions(userId: string, keyword: string) {
  const response = await fetch(
    `http://localhost:5000/api/email-processing/search/${userId}?q=${encodeURIComponent(keyword)}`
  );

  const { data } = await response.json();

  console.log(`Found ${data.totalResults} results for "${keyword}"\n`);

  console.log('Transactions:');
  data.transactions.forEach((tx) => {
    console.log(`  ${tx.subject}`);
    console.log(`    Amount: $${tx.amount} ${tx.currency}`);
    console.log(`    Merchant: ${tx.merchant}`);
    console.log(`    Documents: ${tx.pdf_documents.length}`);
  });

  console.log('\nDocuments:');
  data.documents.forEach((doc) => {
    console.log(`  ${doc.filename}`);
    console.log(`    Type: ${doc.document_type}`);
    console.log(`    Confidence: ${doc.confidence_score}%`);
  });
}
```

***

## Document Types Supported

| Type | Examples | Extensions |
|------|----------|-----------|
| **invoice** | Invoices, bills | PDF, Image, Excel |
| **receipt** | Purchase receipts | PDF, Image |
| **statement** | Bank statements | PDF, Excel |
| **payment** | Payment confirmations | PDF, Image |
| **tax** | Tax documents | PDF |
| **bill** | Utility bills | PDF, Image |
| **contract** | Agreements | PDF |

---

## Data Flow Diagram

```
📧 Gmail Email
    ↓
✅ Classification (Financial? Yes/No)
    ↓
📎 Extract Attachments (PDF, Image, Excel)
    ↓
✅ Check if Financial Document
    ↓
💾 Save to Disk
    ↓
📝 Extract Text (OCR for images)
    ↓
🤖 AI Analysis
    ├─ Transaction Type
    ├─ Amount & Currency
    ├─ Merchant/Company
    ├─ Description
    ├─ Date
    └─ Confidence Score
    ↓
💾 Save to Database
    ├─ Transaction record
    ├─ PDF Document record
    └─ Document record
    ↓
🔍 Search & Retrieve
```

***

## Example Frontend Integration

```typescript
const userId = localStorage.getItem('userId');

// 1. Analyze all emails (automatic attachment processing)
async function processEmails() {
  const res = await fetch(
    `http://localhost:5000/api/email-processing/analyze/${userId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 100 }),
    }
  );
  const result = await res.json();
  console.log(`✓ Processed ${result.summary.processedEmails} emails`);
}

// 2. Get financial dashboard
async function getDashboard() {
  const res = await fetch(
    `http://localhost:5000/api/email-processing/financial-data/${userId}`
  );
  const { data } = await res.json();
  
  return {
    totalTransactions: data.summary.totalTransactions,
    totalDocuments: data.summary.totalPDFs,
    totalAmount: data.summary.totalAmount,
    byType: data.summary.byType,
  };
}

// 3. Search invoices from ABC Corp
async function findABCInvoices() {
  const res = await fetch(
    `http://localhost:5000/api/email-processing/search/${userId}?q=ABC%20Corp`
  );
  const { data } = await res.json();
  return data.transactions.filter(t => t.transaction_type === 'invoice');
}

// 4. Filter by date range
async function getOctoberTransactions() {
  const res = await fetch(
    `http://localhost:5000/api/email-processing/financial-data/${userId}?startDate=2025-10-01&endDate=2025-10-31`
  );
  const { data } = await res.json();
  return data.transactions;
}

// Usage
processEmails();
const dashboard = await getDashboard();
const invoices = await findABCInvoices();
const octData = await getOctoberTransactions();
```

***

## Error Codes

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Missing userId | Provide userId in URL |
| 400 | Missing search query | Add `?q=keyword` |
| 401 | Not authenticated | Connect Google first |
| 500 | AI API error | Check API keys |
| 500 | Database error | Check PostgreSQL |
