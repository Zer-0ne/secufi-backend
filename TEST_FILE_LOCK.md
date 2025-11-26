# Testing File Lock Detection API

## Test Cases

### 1. Test Check Lock - Unlocked File
```bash
# Test with a regular PDF (not password protected)
curl -X POST http://localhost:5000/api/file-upload/check-lock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/unlocked.pdf"

# Expected Response: 200 OK
{
  "success": true,
  "isLocked": false,
  "needsPassword": false,
  "canOpen": true,
  "message": "File is accessible"
}
```

### 2. Test Check Lock - Password Protected File
```bash
# Test with a password-protected PDF (no password provided)
curl -X POST http://localhost:5000/api/file-upload/check-lock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/locked.pdf"

# Expected Response: 403 Forbidden
{
  "success": false,
  "isLocked": true,
  "needsPassword": true,
  "canOpen": false,
  "error": "File is password protected",
  "message": "File requires password to open"
}
```

### 3. Test Check Lock - With Wrong Password
```bash
# Test with password-protected PDF + wrong password
curl -X POST http://localhost:5000/api/file-upload/check-lock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/locked.pdf" \
  -F "password=wrongpassword"

# Expected Response: 403 Forbidden
{
  "success": false,
  "isLocked": true,
  "needsPassword": true,
  "canOpen": false,
  "error": "File is password protected",
  "message": "Incorrect password provided"
}
```

### 4. Test Check Lock - With Correct Password
```bash
# Test with password-protected PDF + correct password
curl -X POST http://localhost:5000/api/file-upload/check-lock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/locked.pdf" \
  -F "password=correctpassword"

# Expected Response: 200 OK
{
  "success": true,
  "isLocked": false,
  "needsPassword": false,
  "canOpen": true,
  "message": "File is accessible"
}
```

### 5. Test Upload - Locked File Without Password
```bash
# Try to upload locked file without password
curl -X POST http://localhost:5000/api/file-upload/upload-and-extract \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/locked.pdf"

# Expected Response: 403 Forbidden
{
  "success": false,
  "error": "File is password protected",
  "message": "File is password protected. Please provide correct password.",
  "data": {
    "filename": "locked.pdf",
    "isLocked": true,
    "needsPassword": true,
    "canOpen": false
  }
}
```

### 6. Test Upload - Locked File With Correct Password
```bash
# Upload locked file with correct password
curl -X POST http://localhost:5000/api/file-upload/upload-and-extract \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/locked.pdf" \
  -F "password=correctpassword"

# Expected Response: 200 OK
{
  "success": true,
  "message": "File uploaded and content extracted successfully",
  "data": {
    "filename": "locked.pdf",
    "mimeType": "application/pdf",
    "size": 12345,
    "extractedContent": { ... },
    "metadata": { ... }
  }
}
```

## Debugging Tips

### Check Server Logs
The server logs will show:
- `🔐 Checking if file is locked: [filename]`
- `📊 Extraction result - Success: true/false, Text length: X`
- `📝 Python stdout: ...`
- `⚠️  Python stderr: ...`

### Common Issues

1. **File shows as "cannot be opened" but it's fine**
   - Check if `extractionResult.metadata?.success` is `true`
   - Check if text length is > 100 characters
   - Review Python stdout/stderr logs

2. **Password protected file not detected**
   - Check if Python extractor returns password error
   - Look for keywords: "password protected", "encrypted", "incorrect password"

3. **File extraction takes too long**
   - Timeout is set to 5 minutes (300000ms)
   - Check Python process logs

### Manual Testing with Postman

1. Create new request: `POST http://localhost:5000/api/file-upload/check-lock`
2. Add header: `Authorization: Bearer YOUR_JWT_TOKEN`
3. Body: form-data
   - Key: `file`, Type: File, Value: Select your PDF
   - Key: `password` (optional), Type: Text, Value: yourpassword
4. Send request
5. Check response status and body

## Expected Behavior Summary

| File Type | Password Provided | Expected Status | isLocked | canOpen |
|-----------|-------------------|----------------|----------|---------|
| Unlocked PDF | N/A | 200 | false | true |
| Locked PDF | None | 403 | true | false |
| Locked PDF | Wrong | 403 | true | false |
| Locked PDF | Correct | 200 | false | true |
| Corrupt PDF | N/A | 403 | false | false |
| Non-PDF | N/A | 200 | false | true |

