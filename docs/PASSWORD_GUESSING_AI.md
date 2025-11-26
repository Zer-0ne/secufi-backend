# 🔐 AI-Powered Password Guessing

## Overview

AI service mein intelligent password guessing functionality add ki gayi hai jo PDF files ke liye passwords guess karti hai. Ye 3 attempts mein passwords try karti hai aur previous failed attempts ko track karke better guesses provide karti hai.

## Features

✅ **AI-Powered Analysis** - AWS Bedrock Claude model use karke intelligent password guessing
✅ **3 Retry Attempts** - Automatically 3 attempts mein different strategies try karta hai
✅ **Context-Aware** - Previous failed attempts ko track karke duplicate passwords avoid karta hai
✅ **Bank-Specific Patterns** - Bank aur institution ke hisab se password patterns detect karta hai
✅ **DOB Format Variations** - Multiple date of birth formats try karta hai (DDMMYYYY, DDMMYY, YYYYMMDD, etc.)
✅ **Fallback Strategy** - Agar AI fail ho jaye to automatic fallback patterns use karta hai
✅ **Detailed Logging** - Har attempt ke reasoning aur passwords log hote hain

## Usage

```typescript
import { AIService } from '@/services/ai.service';

const aiService = new AIService();

// Password guessing with AI
const result = await aiService.guessPasswordWithAI(
  'HDFC_Statement_2024.pdf',
  {
    name: 'John Doe',
    date_of_birth: '1990-06-15',
    phone: '+91-9876543210',
    account_number: '12345678901234',
    customer_id: 'HDFC12345',
    pan_number: 'ABCDE1234F',
    ifsc_code: 'HDFC0001234',
    crn_number: 'CRN123456',
    policy_number: 'POL987654',
    folio_number: 'FOL456789',
    aadhar_number: '1234-5678-9012'
  },
  {
    errorMessage: 'Password protected PDF',
    fileSize: 245678,
    extractedText: 'Some partial text...'
  },
  3 // max attempts (default: 3)
);

console.log('Success:', result.success);
console.log('Total Passwords:', result.passwords.length);
console.log('All Passwords:', result.passwords);

// Check each attempt
result.attempts.forEach((attempt) => {
  console.log(`\nAttempt ${attempt.attemptNumber}:`);
  console.log('Passwords:', attempt.passwords);
  console.log('Reasoning:', attempt.reasoning);
});

if (result.finalRecommendation) {
  console.log('\nFinal Recommendation:', result.finalRecommendation);
}
```

## Response Structure

```typescript
{
  success: boolean;
  passwords: string[];  // All unique passwords from all attempts
  attempts: [
    {
      attemptNumber: 1,
      passwords: ['15061990', '150690', '1990', ...],
      reasoning: 'Trying standard DOB formats based on user data...'
    },
    {
      attemptNumber: 2,
      passwords: ['john1506', 'JOHN1506', 'John1506', ...],
      reasoning: 'Previous DOB patterns failed, trying name+DOB combinations...'
    },
    {
      attemptNumber: 3,
      passwords: ['15-06-1990', '15/06/1990', ...],
      reasoning: 'Trying special character variations and defaults...'
    }
  ],
  finalRecommendation?: 'All AI attempts exhausted. Consider: ...'
}
```

## Password Patterns Detected

### 1️⃣ **First Attempt** - Basic Patterns
- DOB formats: DDMMYYYY, DDMMYY, YYYY, YYYYMMDD, MMDDYYYY
- Account number (full & last 4 digits)
- Phone number (last 10 & last 4 digits)

### 2️⃣ **Second Attempt** - Name Combinations
- name(4 chars) + DDMM
- name(4 chars) + account_last_4
- PAN number (uppercase/lowercase)
- Customer ID / CRN number

### 3️⃣ **Third Attempt** - Special Variations
- DOB with special characters: DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
- Reverse DOB formats: YYMMDD, MMYY
- Policy/Folio numbers
- IFSC codes
- Aadhar last 4 digits
- Common defaults: password, Password, 123456, 0000, 1111

## Bank-Specific Patterns

AI automatically detects bank from filename and applies specific patterns:

| Bank | Common Password Patterns |
|------|-------------------------|
| **SBI** | Account number, Mobile number |
| **HDFC** | Customer ID, Name(4) + Card_last_4 |
| **ICICI** | Name(4) + DDMM |
| **Axis** | Name(4) + Account_last_4 |
| **IDFC** | DDMMYYYY, DDMMYY |
| **Kotak** | CRN number |
| **LIC** | Policy number, DOB variants |
| **EPF** | UAN number, DOB |
| **NPS** | PRAN number |

## DOB Format Examples

For DOB: `15-06-1990`

AI tries these variations:
```
15061990      // DDMMYYYY
150690        // DDMMYY
1990          // YYYY
19900615      // YYYYMMDD
06151990      // MMDDYYYY
15-06-1990    // DD-MM-YYYY
15/06/1990    // DD/06/YYYY
150690        // DDMMYY
900615        // YYMMDD
0690          // MMYY
```

## How It Works

1. **Attempt 1:** AI analyzes user data and filename to generate most likely passwords
2. **Attempt 2:** AI learns from failed attempt 1, generates new untested variations
3. **Attempt 3:** AI tries remaining patterns, special characters, and fallback defaults

Each attempt:
- ✅ Tracks previous failures
- ✅ Avoids duplicate passwords
- ✅ Generates 5-10 unique passwords
- ✅ Provides reasoning for choices
- ✅ Adapts based on available user data

## Error Handling

- If AI call fails → Automatic fallback to rule-based password generation
- If AI returns empty → Uses attempt-specific fallback strategies
- If parsing fails → Continues with next attempt using fallback

## Integration with File Upload

```typescript
import { AIService } from '@/services/ai.service';

// When PDF password protected
const aiService = new AIService();

const passwordResult = await aiService.guessPasswordWithAI(
  filename,
  user, // User object with all fields
  {
    errorMessage: pdfError.message,
    fileSize: fileBuffer.length
  }
);

// Try each password
for (const password of passwordResult.passwords) {
  try {
    const pdfDoc = await PDFDocument.load(fileBuffer, { password });
    console.log(`✅ Password found: ${password}`);
    break;
  } catch (err) {
    // Password failed, try next
    continue;
  }
}
```

## Best Practices

1. **Provide Complete User Data** - More fields = Better password guesses
2. **Check Filename** - Bank/institution name in filename helps detection
3. **Use All 3 Attempts** - Each attempt tries different strategies
4. **Log Attempts** - Review reasoning to understand why passwords failed
5. **Handle Empty Password** - Sometimes PDF password is empty string `""`

## Performance

- **AI Call Time:** ~2-5 seconds per attempt
- **Total Time:** ~6-15 seconds for 3 attempts
- **Passwords Generated:** 15-30 unique passwords across all attempts
- **Success Rate:** High for standard bank PDFs with correct user data

## Limitations

- Requires accurate user data (DOB, account number, etc.)
- AI may not work for custom/random passwords
- Limited to 3 attempts to avoid excessive API calls
- Depends on AWS Bedrock availability

## Future Improvements

- [ ] Cache successful passwords per bank
- [ ] Learn from successful patterns
- [ ] Support for custom password hints
- [ ] Brute force option for common passwords
- [ ] Integration with external password databases
