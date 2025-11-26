# File Lock Detection API Documentation

## Overview
Two new endpoints have been added to detect and handle password-protected/locked files:
1. **Check Lock Status** - Only checks if file is locked
2. **Upload and Extract** - Enhanced to validate file accessibility before processing

---

## 🔒 1. Check File Lock Status

### Endpoint
```
POST /api/file-upload/check-lock
```

### Purpose
Checks if a file is password protected or locked WITHOUT saving it to database.

### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### Request Body (Form-Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ Yes | The file to check (PDF, DOCX, etc.) |
| `password` | String | ❌ No | Optional password to test if it unlocks the file |

### Response Examples

#### ✅ Success (File is accessible - 200 OK)
```json
{
  "success": true,
  "isLocked": false,
  "needsPassword": false,
  "canOpen": true,
  "message": "File is accessible"
}
```

#### 🔒 Error (File is password protected - 403 Forbidden)
```json
{
  "success": false,
  "isLocked": true,
  "needsPassword": true,
  "canOpen": false,
  "error": "File is password protected",
  "message": "File requires password to open"
}
```

#### ❌ Error (Incorrect password - 403 Forbidden)
```json
{
  "success": false,
  "isLocked": true,
  "needsPassword": true,
  "canOpen": false,
  "error": "File is password protected",
  "message": "Incorrect password provided"
}
```

#### ❌ Error (File cannot be opened - 403 Forbidden)
```json
{
  "success": false,
  "isLocked": false,
  "needsPassword": false,
  "canOpen": false,
  "error": "File could not be opened",
  "message": "File may be corrupt or in unsupported format"
}
```

---

## 📤 2. Upload and Extract (Enhanced)

### Endpoint
```
POST /api/file-upload/upload-and-extract
```

### Purpose
Uploads and extracts content from file. Now includes automatic lock detection and validation.

### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### Request Body (Form-Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ Yes | The file to upload and process |
| `password` | String | ❌ No | Password for protected files |

### New Validation Flow
```
1. Check if file is locked → 403 if locked
2. Check if file can be opened → 403 if cannot open
3. Extract content
4. Verify if financial data → Skip if not financial
5. Save to database
```

### Response Examples

#### ✅ Success (File processed - 200 OK)
```json
{
  "success": true,
  "message": "File uploaded and content extracted successfully",
  "data": {
    "filename": "statement.pdf",
    "mimeType": "application/pdf",
    "size": 51234,
    "extractedContent": { ... },
    "metadata": { ... }
  }
}
```

#### 🔒 Error (Password protected - 403 Forbidden)
```json
{
  "success": false,
  "error": "File is password protected",
  "message": "File is password protected. Please provide correct password.",
  "data": {
    "filename": "statement.pdf",
    "isLocked": true,
    "needsPassword": true,
    "canOpen": false
  }
}
```

#### ❌ Error (Incorrect password - 403 Forbidden)
```json
{
  "success": false,
  "error": "File is password protected",
  "message": "File could not be opened. It may be corrupt or have incorrect password.",
  "data": {
    "filename": "statement.pdf",
    "isLocked": true,
    "needsPassword": true,
    "canOpen": false
  }
}
```

#### ❌ Error (File corrupt/cannot open - 403 Forbidden)
```json
{
  "success": false,
  "error": "File could not be opened",
  "message": "File could not be opened. It may be corrupt or have incorrect password.",
  "data": {
    "filename": "statement.pdf",
    "isLocked": false,
    "needsPassword": false,
    "canOpen": false
  }
}
```

---

## 🔍 Lock Detection Logic

### Detected as Locked when:
- Content contains: "password protected"
- Content contains: "incorrect password"
- Content contains: "encrypted"
- Content contains: "password required"
- Extraction metadata indicates password error

### Detected as Cannot Open when:
- Content contains: "extraction failed"
- Content contains: "cannot read"
- Content contains: "corrupt"
- Extracted content length < 100 characters
- Extraction metadata indicates failure

---

## 📝 Usage Examples

### Example 1: Check if file is locked (no password)
```bash
curl -X POST http://localhost:5000/api/file-upload/check-lock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/statement.pdf"
```

### Example 2: Check with password
```bash
curl -X POST http://localhost:5000/api/file-upload/check-lock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/statement.pdf" \
  -F "password=mypassword123"
```

### Example 3: Upload file (unlocked)
```bash
curl -X POST http://localhost:5000/api/file-upload/upload-and-extract \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/statement.pdf"
```

### Example 4: Upload file with password
```bash
curl -X POST http://localhost:5000/api/file-upload/upload-and-extract \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/statement.pdf" \
  -F "password=mypassword123"
```

---

## 🛡️ Error Codes Summary

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | Success | File processed successfully |
| 400 | Bad Request | Missing file or invalid request |
| 403 | Forbidden | File is locked/password protected OR cannot be opened |
| 500 | Server Error | Internal processing error |

---

## 🎯 Key Features

1. ✅ **Pre-validation**: Checks file accessibility BEFORE processing
2. ✅ **Password Support**: Handles password-protected files
3. ✅ **Clear Error Messages**: Specific feedback for different failure scenarios
4. ✅ **Lock Detection**: Identifies locked files immediately
5. ✅ **Separate Check Endpoint**: Test file without uploading
6. ✅ **403 Status Code**: Proper HTTP status for access denied scenarios

---

## 🔧 Technical Details

### Files Modified
1. `src/services/file-extraction.service.ts` - Added `checkFileLocked()` method
2. `src/controllers/file-upload.controller.ts` - Added `checkFileLock()` controller
3. `src/routes/file-upload.routes.ts` - Added `/check-lock` route

### New Method: `checkFileLocked()`
```typescript
async checkFileLocked(options: FileProcessingOptions): Promise<{
    isLocked: boolean;
    needsPassword: boolean;
    canOpen: boolean;
    error?: string;
    message: string;
}>
```

Returns detailed status about file accessibility.

---

## 🚀 Testing Recommendations

1. **Test unlocked file**: Should return 200 and process successfully
2. **Test locked file (no password)**: Should return 403 with needsPassword=true
3. **Test locked file (wrong password)**: Should return 403 with "Incorrect password"
4. **Test locked file (correct password)**: Should return 200 and process successfully
5. **Test corrupt file**: Should return 403 with canOpen=false
6. **Test non-PDF file**: Should skip lock check and process normally

---

## 📌 Notes

- Lock detection currently works best with PDF files
- Other file types (DOCX, XLSX) will skip lock check
- Password validation happens during extraction attempt
- File is NOT saved to database if locked or cannot be opened
- Check lock endpoint is useful for pre-upload validation

