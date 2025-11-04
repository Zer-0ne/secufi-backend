# Email Processing API Reference

This document provides comprehensive documentation for the Email Processing API, which handles email analysis, attachment processing, and financial data extraction.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)

## Overview
The Email Processing API provides powerful tools for:
- Analyzing email content for financial transactions
- Processing email attachments (PDFs, images, documents)
- Extracting structured financial data from emails
- Managing and querying processed email data
- Generating financial reports and insights

## Getting Started

### Prerequisites
- Node.js 14.0.0 or later
- MongoDB database
- Required environment variables set in your `.env` file

### Environment Variables
```env
# Email Processing
EMAIL_PROCESSING_ENABLED=true
ATTACHMENT_MAX_SIZE=10485760  # 10MB
SUPPORTED_FILE_TYPES=application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# AI Integration
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4-1106-preview

# Storage
UPLOAD_DIR=./uploads
MAX_FILE_UPLOADS=5

# Application
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

### Installation
```bash
# Install required dependencies
npm install multer pdf-parse mammoth jimp

# Create uploads directory
mkdir -p uploads
```

## API Endpoints

### Base URL
```
/api/email-processing
```

### 1. Analyze Emails

#### POST /api/email-processing/analyze/:userId
Analyze emails with attachments for financial data extraction.

**Authentication:** Bearer Token required

**Path Parameters:**
- `userId`: string (required) - ID of the user making the request

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**

| Field       | Type     | Required | Description                                                                 |
|-------------|----------|----------|-----------------------------------------------------------------------------|
| `emails`    | File[]   | Yes      | One or more email files (EML format) or raw email content                   |
| `attachments`| File[]  | No       | Additional attachments to process with the emails                           |
| `options`   | JSON     | No       | Additional processing options (see below)                                   |

**Options (JSON string):**
```json
{
  "extractTextFromPdfs": true,
  "ocrImages": true,
  "language": "en",
  "timeout": 30000,
  "maxPages": 10,
  "extractTables": true
}
```

**Example cURL Request:**
```bash
curl -X POST 'http://localhost:3000/api/email-processing/analyze/12345' \
  -H 'Authorization: Bearer your_jwt_token' \
  -F 'emails=@/path/to/email1.eml' \
  -F 'emails=@/path/to/email2.eml' \
  -F 'attachments=@/path/to/document.pdf' \
  -F 'options={"extractTextFromPdfs": true, "ocrImages": true}'
```

**Response:**

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Email analysis completed successfully",
  "data": {
    "processedEmails": 2,
    "processedAttachments": 3,
    "transactions": [
      {
        "id": "txn_123456789",
        "type": "invoice",
        "status": "unpaid",
        "date": "2025-11-02T12:00:00Z",
        "dueDate": "2025-12-02T12:00:00Z",
        "amount": 1250.75,
        "currency": "USD",
        "vendor": {
          "name": "Acme Corp",
          "email": "billing@acmecorp.com",
          "taxId": "TAX123456789"
        },
        "items": [
          {
            "description": "Web Hosting - Business Plan",
            "quantity": 1,
            "unitPrice": 99.99,
            "amount": 99.99
          },
          {
            "description": "SSL Certificate",
            "quantity": 1,
            "unitPrice": 50.00,
            "amount": 50.00
          }
        ],
        "subtotal": 149.99,
        "tax": 29.99,
        "total": 179.98,
        "paymentMethod": "Credit Card",
        "reference": "INV-2025-001",
        "notes": "Thank you for your business!",
        "source": {
          "emailId": "eml_123456789",
          "filename": "invoice_123.pdf",
          "extractedAt": "2025-11-02T12:05:30Z"
        },
        "metadata": {
          "confidence": 0.98,
          "processingTime": 1250,
          "model": "gpt-4-1106-preview"
        }
      }
    ],
    "warnings": [
      "Low confidence (0.65) in amount extraction for transaction txn_987654321"
    ],
    "summary": {
      "totalAmount": 179.98,
      "currency": "USD",
      "transactionCount": 1,
      "vendors": ["Acme Corp"],
      "dateRange": {
        "start": "2025-11-02T12:00:00Z",
        "end": "2025-12-02T12:00:00Z"
      }
    },
    "processingStats": {
      "startTime": "2025-11-02T12:00:00Z",
      "endTime": "2025-11-02T12:02:30Z",
      "documentsProcessed": 3,
      "charactersProcessed": 12500,
      "apiCalls": 5
    }
  }
}
```

**Error Responses:**

**400 Bad Request - Invalid Input**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed",
    "details": [
      {
        "field": "emails",
        "message": "At least one email file is required"
      },
      {
        "field": "options.language",
        "message": "Unsupported language code. Supported languages: en, es, fr, de, it, pt, ru, zh, ja, ko"
      }
    ]
  }
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**413 Payload Too Large**
```json
{
  "success": false,
  "error": {
    "code": "PAYLOAD_TOO_LARGE",
    "message": "Total request size exceeds 10MB limit"
  }
}
```

**429 Too Many Requests**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "retryAfter": 60
  }
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_1234567890"
  }
}
```

## Rate Limiting

- **Free Tier:** 100 requests per hour per IP
- **Standard Tier:** 1,000 requests per hour per API key
- **Enterprise Tier:** Custom rate limits available

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1635876000
Retry-After: 60
```

## Best Practices

### 1. File Preparation
- Use standard EML format for emails
- For best OCR results, ensure images are:
  - Well-lit and in focus
  - At least 300 DPI
  - In PNG or JPEG format
- Split large documents into smaller chunks if they exceed 20 pages

### 2. Error Handling
- Always check the `success` flag in the response
- Implement retry logic for rate limit (429) and server (5xx) errors
- Use the `requestId` for support inquiries

### 3. Performance Optimization
- Process multiple emails in a single request when possible
- Set appropriate timeouts based on document size
- Use webhooks for asynchronous processing of large batches

### 4. Security
- Always use HTTPS
- Keep your API keys secure
- Validate all input data
- Implement proper error handling to avoid leaking sensitive information
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Processed X out of Y emails",
  "results": [
    {
      "emailId": "string",
      "subject": "string",
      "attachmentCount": "number",
      "processed": "boolean",
      "transactionId": "string | null",
      "reason": "string | null",
      "emailAnalysis": {
        "extractedData": "object",
        "summary": "string",
        "keyPoints": ["string"]
      } | null,
      "attachmentAnalyses": [
        {
          "assetId": "string",
          "fileName": "string",
          "fileSize": "number",
          "mimeType": "string",
          "analysis": {
            "extractedData": {
              "confidence": "number",
              "transactionType": "string",
              "amount": "number",
              "currency": "string",
              "merchant": "string",
              "date": "string"
            },
            "summary": "string",
            "keyPoints": ["string"]
          }
        }
      ],
      "totalAttachments": "number",
      "assetIds": ["string"]
    }
  ],
  "summary": {
    "totalEmails": "number",
    "processedEmails": "number",
    "failedEmails": "number",
    "totalAttachments": "number",
    "totalAssetsCreated": "number"
  }
}
```

**Error Responses:**
- 400: User ID is required
- 401: Not authenticated
- 500: Failed to analyze emails

### GET /api/email-processing/financial-data/:userId
Get all financial data for a user.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Query Parameters:**
- `startDate`: string (optional, ISO date)
- `endDate`: string (optional, ISO date)
- `transactionType`: string (optional)
- `limit`: number (optional, default: 50)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Financial data retrieved successfully",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "transactionId": "string",
      "transactionType": "string",
      "amount": "number",
      "currency": "string",
      "merchant": "string",
      "date": "string",
      "description": "string",
      "category": "string",
      "confidence": "number",
      "source": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Error Responses:**
- 400: User ID is required
- 500: Failed to fetch financial data

### GET /api/email-processing/get-assets
Get all assets for the authenticated user.

**Authentication:** JWT required (Bearer token)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "fileName": "string",
      "fileSize": "number",
      "mimeType": "string",
      "filePath": "string",
      "extractedData": "object",
      "summary": "string",
      "keyPoints": ["string"],
      "confidence": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Error Responses:**
- 401: Unauthorized
- 500: Failed to fetch assets

### GET /api/email-processing/search/:userId
Search financial data.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Query Parameters:**
- `q`: string (required, search query)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Search completed",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "transactionId": "string",
      "transactionType": "string",
      "amount": "number",
      "currency": "string",
      "merchant": "string",
      "date": "string",
      "description": "string",
      "category": "string",
      "confidence": "number",
      "source": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Error Responses:**
- 400: User ID and search query are required
- 500: Failed to search

### GET /api/email-processing/statistics/:userId
Get dashboard statistics.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Query Parameters:**
- `monthsBack`: number (optional, default: 6)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalTransactions": "number",
    "totalAmount": "number",
    "averageTransaction": "number",
    "transactionsByType": {
      "income": "number",
      "expense": "number",
      "transfer": "number"
    },
    "monthlyData": [
      {
        "month": "string",
        "income": "number",
        "expense": "number",
        "net": "number"
      }
    ],
    "topMerchants": [
      {
        "merchant": "string",
        "amount": "number",
        "count": "number"
      }
    ],
    "categories": [
      {
        "category": "string",
        "amount": "number",
        "percentage": "number"
      }
    ]
  }
}
```

**Error Responses:**
- 400: User ID is required
- 500: Failed to fetch statistics

### GET /api/email-processing/transaction/:transactionId/:userId
Get transaction details with all documents.

**Authentication:** None required

**Parameters:**
- `transactionId`: string (required, path parameter)
- `userId`: string (required, path parameter)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Transaction details retrieved successfully",
  "data": {
    "transaction": {
      "id": "string",
      "userId": "string",
      "transactionId": "string",
      "transactionType": "string",
      "amount": "number",
      "currency": "string",
      "merchant": "string",
      "date": "string",
      "description": "string",
      "category": "string",
      "confidence": "number",
      "source": "string",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "documents": [
      {
        "id": "string",
        "assetId": "string",
        "fileName": "string",
        "fileSize": "number",
        "mimeType": "string",
        "extractedData": "object",
        "summary": "string",
        "keyPoints": ["string"]
      }
    ]
  }
}
```

**Error Responses:**
- 400: Transaction ID and User ID are required
- 500: Failed to fetch transaction

### DELETE /api/email-processing/transaction/:transactionId/:userId
Delete transaction and related documents.

**Authentication:** None required

**Parameters:**
- `transactionId`: string (required, path parameter)
- `userId`: string (required, path parameter)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Error Responses:**
- 400: Transaction ID and User ID are required
- 404: Transaction not found
- 500: Failed to delete transaction
