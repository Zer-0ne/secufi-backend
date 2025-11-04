# SMS Service Integration

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)
- [Production Integration](#production-integration)

## Overview
The SMS Service provides a flexible interface for sending SMS messages through various providers. The current implementation includes a simulation mode for development and testing, with easy integration points for production SMS providers like Twilio, Nexmo, or AWS SNS.

## Installation

### Prerequisites
- Node.js 16+
- Environment configuration for your preferred SMS provider

### Install Dependencies
```bash
# For Twilio integration (optional)
npm install twilio @types/twilio --save

# For AWS SNS integration (optional)
npm install @aws-sdk/client-sns --save
```

## Configuration

### Environment Variables
Configure these in your `.env` file:

```env
# Required for simulation mode
NODE_ENV=development

# Twilio Configuration (optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# AWS SNS Configuration (optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Rate limiting
SMS_RATE_LIMIT=5    # Max messages per minute
SMS_RATE_WINDOW=60   # Time window in seconds
```

## API Reference

### Base URL
```
/api/sms
```

### Send SMS Message

#### POST /api/sms/send
Sends an SMS message using the configured provider.

**Authentication:** JWT Bearer Token (if enabled in config)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>  # If authentication enabled
```

**Request Body:**
```json
{
  "to": "+1234567890",
  "message": "Your verification code is 123456",
  "from": "APP_NAME",  // Optional: Override default sender
  "provider": "twilio" // Optional: Override default provider
}
```

**Parameters:**
- `to`: `string` (required) - Recipient phone number in E.164 format
- `message`: `string` (required) - Message content (max 1600 chars)
- `from`: `string` (optional) - Sender ID or phone number
- `provider`: `string` (optional) - Force specific provider ('twilio', 'aws', 'simulator')
- `metadata`: `object` (optional) - Additional provider-specific options

**Response (200 OK):**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "id": "msg_1234567890",
    "to": "+1234567890",
    "from": "APP_NAME",
    "message": "Your verification code is 123456",
    "provider": "twilio",
    "timestamp": "2023-01-01T12:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Failed to send SMS

### Check SMS Status

#### GET /api/sms/status/:messageId
Gets the delivery status of a sent message.

**Parameters:**
- `messageId`: `string` (required) - The message ID from the send response

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "msg_1234567890",
    "status": "delivered",
    "to": "+1234567890",
    "sentAt": "2023-01-01T12:00:00Z",
    "deliveredAt": "2023-01-01T12:00:05Z",
    "error": null
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "SMS_SEND_FAILED",
    "message": "Failed to send SMS",
    "details": {
      "provider": "twilio",
      "errorCode": "12345",
      "errorMessage": "Invalid phone number format"
    }
  }
}
```

### Common Error Codes
- `INVALID_PHONE_NUMBER`: Malformed or unsupported phone number
- `MESSAGE_TOO_LONG`: Message exceeds maximum length
- `PROVIDER_ERROR`: Error from the SMS provider
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INSUFFICIENT_CREDITS`: Account has insufficient credits/balance

## Usage Examples

### Using the SMSService Directly
```typescript
import { SMSService } from '../services/sms.service';

// Send SMS with default provider
const result = await SMSService.send({
  to: '+1234567890',
  message: 'Your verification code is 123456'
});

// Send with specific provider
const result = await SMSService.send({
  to: '+1234567890',
  message: 'Your order has shipped!',
  provider: 'twilio',
  metadata: {
    // Provider-specific options
  }
});

// Check status
const status = await SMSService.getStatus('msg_1234567890');
```

### Using the API Endpoint
```javascript
// Using fetch
const response = await fetch('/api/sms/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_jwt_token'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Your verification code is 123456'
  })
});

const result = await response.json();
```

## Production Integration

### Twilio Integration
1. Sign up for a Twilio account at https://www.twilio.com/
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Configure environment variables:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### AWS SNS Integration
1. Set up AWS credentials with SNS access
2. Configure environment variables:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

### Rate Limiting
- Default: 5 messages per minute per recipient
- Configure via environment variables:
  ```
  SMS_RATE_LIMIT=10
  SMS_RATE_WINDOW=60  // seconds
  ```

### Message Templates
For better maintainability, consider using message templates:

```typescript
const templates = {
  WELCOME: (name: string) => `Welcome to App, ${name}! Your account is now active.`,
  VERIFICATION: (code: string) => `Your verification code is: ${code}`,
  PASSWORD_RESET: (url: string) => `Reset your password: ${url}`
};

// Usage
const message = templates.VERIFICATION('123456');
await SMSService.send({ to: '+1234567890', message });
```

## Best Practices
1. Always validate phone numbers before sending
2. Implement proper error handling and retry logic
3. Monitor delivery status for important messages
4. Respect user preferences for SMS communications
5. Keep messages concise and clear
6. Include opt-out instructions for marketing messages

## Testing
In development mode, messages are logged to the console instead of being sent. You can also use the simulator:

```typescript
// Force simulator in test environment
process.env.NODE_ENV = 'test';
const result = await SMSService.send({
  to: '+1234567890',
  message: 'Test message',
  provider: 'simulator'  // Force simulator
});
```

## Security Considerations
- Never log sensitive message content
- Validate all input to prevent injection attacks
- Use HTTPS for all API requests
- Implement proper authentication and authorization
- Monitor for abuse or unusual sending patterns
