# Webhook Authentication Fix Documentation

## Problem
The production signup process was failing with the error: **"Invalid payload sent to hook"**

## Root Cause Analysis
After examining the Supabase dashboard configuration, the issue was identified as missing webhook payload validation in the `/api/auth/send-email` endpoint. Supabase requires proper webhook signature verification for security.

## Current Supabase Configuration
- **Hook URI**: `https://www.querynotes.top/api/auth/send-email/`
- **Hook Secret**: `e006a8c0343efd8987026146324b066324a58988ea1911265aa1c3e4b18d2f42`
- **Hook Status**: Enabled (`hook_send_email_enabled: true`)

## Solution Implemented

### 1. Added Webhook Secret Validation
- Installed `standardwebhooks` npm package for secure payload verification
- Added proper webhook signature validation in the email endpoint
- Implemented error handling for invalid webhook signatures

### 2. Fixed Secret Format Handling
- Supabase stores webhook secrets as hex strings
- The `standardwebhooks` library expects base64 format
- Added automatic conversion from hex to base64

### 3. Updated Payload Parsing
- Modified the endpoint to handle Supabase's payload format with `user` and `email_data` objects
- Added proper TypeScript types for the webhook payload
- Improved error logging for debugging

## Code Changes

### Environment Variables
```env
# Local development (.env.local)
SEND_EMAIL_HOOK_SECRET=e006a8c0343efd8987026146324b066324a58988ea1911265aa1c3e4b18d2f42

# Production (Vercel environment variables)
SEND_EMAIL_HOOK_SECRET=e006a8c0343efd8987026146324b066324a58988ea1911265aa1c3e4b18d2f42
```

### Key Implementation Details
1. **Webhook Verification**: Uses `standardwebhooks` library to verify payload integrity
2. **Secret Conversion**: Automatically converts Supabase hex secrets to base64 format
3. **Payload Structure**: Handles the correct Supabase webhook payload format
4. **Error Handling**: Returns appropriate HTTP status codes for different failure scenarios

## Deployment Steps

### For Production (Vercel)
1. Add the environment variable `SEND_EMAIL_HOOK_SECRET` with the value from Supabase dashboard
2. Deploy the updated code to production
3. Test the signup flow to verify the fix

### Verification
The webhook endpoint now:
- ✅ Validates webhook signatures properly
- ✅ Handles Supabase's secret format correctly
- ✅ Parses the payload structure as expected by Supabase
- ✅ Returns appropriate error responses for debugging

## Expected Result
After deployment, users should be able to sign up successfully without encountering the "Invalid payload sent to hook" error. The email confirmation flow will work as intended using the Resend email service.
