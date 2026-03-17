-- Quick fix for RLS policy issues
-- Run this in your Supabase SQL editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own deposits" ON public.deposits;
DROP POLICY IF EXISTS "Users can insert own withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Users can insert own investments" ON public.investments;
DROP POLICY IF EXISTS "Users can insert own KYC documents" ON public.kyc_documents;

-- Create more permissive policies for inserts
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own deposits" ON public.deposits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON public.investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC documents" ON public.kyc_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert (for admin creation)
CREATE POLICY "Service role can insert profiles" ON public.users
    FOR INSERT WITH CHECK (true);

-- Temporarily disable email confirmation requirement
-- Go to Supabase Dashboard > Authentication > Settings > Email Auth
-- Set "Enable email confirmations" to OFF for testing 