# Email Notifications Fix

## Issue
When admin approves or rejects deposits and withdrawals, emails were only being sent to admin users, not to the actual users who made the requests.

## Root Cause
The following routes were missing email notification functionality:
1. `app/api/admin/transactions/[id]/approve/route.ts` - Missing email notifications for both deposits and withdrawals
2. `app/api/admin/deposits/[id]/reject/route.ts` - Missing email notifications for deposit rejections
3. `app/api/admin/withdrawals/[id]/reject/route.ts` - Missing email notifications for withdrawal rejections
4. `app/api/admin/transactions/[id]/reject/route.ts` - Missing email notifications for both deposits and withdrawals

## Solution

### 1. Added Email Templates
Added new email templates in `lib/email.ts`:
- `depositRejected` - For deposit rejection notifications
- `withdrawalRejected` - For withdrawal rejection notifications

### 2. Added Email Service Functions
Added new email service functions in `lib/email.ts`:
- `sendDepositRejectedEmail()` - Sends deposit rejection emails
- `sendWithdrawalRejectedEmail()` - Sends withdrawal rejection emails

### 3. Updated Email Template Handler
Updated the `sendEmail()` function to handle the new rejection templates with the correct parameters.

### 4. Fixed Approval Routes
Updated `app/api/admin/transactions/[id]/approve/route.ts` to:
- Import email service
- Send deposit approved emails to users
- Send withdrawal approved emails to users
- Add proper balance updates and rollback functionality
- Add proper status validation

### 5. Fixed Rejection Routes
Updated all rejection routes to send email notifications to users:
- `app/api/admin/deposits/[id]/reject/route.ts`
- `app/api/admin/withdrawals/[id]/reject/route.ts`
- `app/api/admin/transactions/[id]/reject/route.ts`

### 6. Enhanced Transaction Rejection Route
Updated `app/api/admin/transactions/[id]/reject/route.ts` to:
- Re-enable proper authentication
- Add status validation
- Add proper timestamp and reason tracking
- Send appropriate rejection emails to users

## Email Templates Added

### Deposit Rejected Email
- Subject: "❌ Deposit Rejected"
- Includes: Amount, reference, rejection reason, next steps
- Professional styling with red color scheme

### Withdrawal Rejected Email
- Subject: "❌ Withdrawal Rejected"
- Includes: Amount, reference, rejection reason, next steps
- Professional styling with red color scheme

## Testing
Created `test-email-notifications.mjs` to test all email notification types:
- Deposit approved emails
- Withdrawal approved emails
- Deposit rejected emails
- Withdrawal rejected emails
- KYC approved emails

## Routes That Now Send User Emails

### Approval Routes
✅ `app/api/admin/deposits/[id]/approve/route.ts` - Already working
✅ `app/api/admin/withdrawals/[id]/approve/route.ts` - Already working
✅ `app/api/admin/transactions/[id]/approve/route.ts` - **FIXED**
✅ `app/api/admin/kyc/[id]/approve/route.ts` - Already working

### Rejection Routes
✅ `app/api/admin/deposits/[id]/reject/route.ts` - **FIXED**
✅ `app/api/admin/withdrawals/[id]/reject/route.ts` - **FIXED**
✅ `app/api/admin/transactions/[id]/reject/route.ts` - **FIXED**

## Email Flow
1. **User submits request** → Admin notification email sent
2. **Admin approves/rejects** → User notification email sent
3. **User receives email** → Can view transaction status in dashboard

## Error Handling
- Email failures don't prevent the approval/rejection process
- All email errors are logged for debugging
- Graceful fallback if email service is unavailable

## Environment Variables Required
Make sure these are set in your `.env` file:
```
EMAIL_HOST=smtp.hostinger.com
EMAIL_HOST_USER=support@optimusassets.live
EMAIL_HOST_PASSWORD=your_email_password
DEFAULT_FROM_EMAIL=support@optimusassets.live
ADMIN_EMAIL=ewaenpatrick5@gmail.com
ADMIN_NAME=Admin Team
```

## Testing the Fix
Run the test script to verify all email notifications work:
```bash
node test-email-notifications.mjs
```

This will test all email notification types and confirm they're working correctly. 