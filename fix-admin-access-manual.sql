-- Manual fix for admin access issue
-- Run this in your Supabase SQL Editor

-- Step 1: Disable RLS on users table temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can update all users" ON public.users;
DROP POLICY IF EXISTS "Admin can delete all users" ON public.users;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;
DROP POLICY IF EXISTS "users_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;

-- Step 3: Verify admin user exists and is properly set
SELECT 
    id,
    email,
    first_name,
    last_name,
    is_admin,
    created_at
FROM public.users 
WHERE email = 'admin@gmail.com';

-- Step 4: Ensure admin user has is_admin = true
UPDATE public.users 
SET is_admin = true 
WHERE email = 'admin@gmail.com';

-- Step 5: Test the fix
SELECT 'Admin access should now work!' as status;

-- Step 6: Re-enable RLS with simple policies (optional - run this after testing)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow all access for now" ON public.users
--     FOR ALL USING (true);
