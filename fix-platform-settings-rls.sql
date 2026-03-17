-- Fix RLS policies for platform_settings table
-- Allow all authenticated users to read platform settings for validation purposes

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can view platform settings" ON public.platform_settings;

-- Create new policy that allows all authenticated users to read platform settings
CREATE POLICY "Authenticated users can view platform settings" ON public.platform_settings
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Keep the admin-only policies for updates and inserts
CREATE POLICY "Admins can update platform settings" ON public.platform_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = TRUE
        )
    );

CREATE POLICY "Admins can insert platform settings" ON public.platform_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = TRUE
        )
    );

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'platform_settings'; 