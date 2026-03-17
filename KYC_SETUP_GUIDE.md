# KYC Setup Guide

## Current Status
✅ KYC API is working correctly (returns 401 for unauthenticated requests - this is expected)
❌ KYC table needs to be created in Supabase

## Step 1: Create KYC Table in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run this SQL:

```sql
-- Create KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'national_id')),
  document_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);

-- Enable RLS (Row Level Security)
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own KYC documents
CREATE POLICY "Users can view own KYC documents" ON kyc_documents
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own KYC documents
CREATE POLICY "Users can insert own KYC documents" ON kyc_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all KYC documents
CREATE POLICY "Admins can view all KYC documents" ON kyc_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Admins can update all KYC documents
CREATE POLICY "Admins can update all KYC documents" ON kyc_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );
```

## Step 2: Test the KYC System

1. **Login to your app** as a regular user
2. **Navigate to KYC page** (`/dashboard/kyc`)
3. **Try uploading a document** - it should work now!

## Step 3: Optional - Set up Cloudinary

If you want to use Cloudinary for file storage:

1. **Create a Cloudinary account** at [cloudinary.com](https://cloudinary.com)
2. **Get your credentials** from the dashboard
3. **Add to your `.env` file**:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. **Test Cloudinary**:
   ```bash
   node scripts/setup-cloudinary.js
   ```

## Current Features

✅ **KYC API working** - Returns proper authentication errors
✅ **File upload validation** - Checks file type and size
✅ **Database integration** - Ready for KYC documents
✅ **Admin panel integration** - Admins can review KYC documents
✅ **Security policies** - Users can only see their own documents

## Next Steps

1. **Create the KYC table** using the SQL above
2. **Test the KYC page** by logging in and uploading a document
3. **Set up Cloudinary** (optional) for better file storage
4. **Test admin functionality** by reviewing KYC documents

The KYC system is now ready to use! 🎉 