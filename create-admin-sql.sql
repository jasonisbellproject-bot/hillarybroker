-- Method 1: Create admin user directly in the database
-- Replace 'admin@example.com' with your desired email

-- First, create the auth user (you'll need to do this through Supabase Auth UI or API)
-- Then, insert the admin profile:

INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    kyc_verified,
    two_factor_enabled,
    is_admin,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(), -- or use a specific UUID
    'admin@example.com', -- replace with your email
    'Admin',
    'User',
    true,
    false,
    true,
    NOW(),
    NOW()
);

-- Method 2: Make an existing user an admin
-- Replace 'user@example.com' with the email of an existing user

UPDATE public.users 
SET is_admin = true 
WHERE email = 'admin@gmail.com';

-- Method 3: Check if admin user exists
SELECT * FROM public.users WHERE is_admin = true;

-- Method 4: List all users with admin status
SELECT 
    id,
    email,
    first_name,
    last_name,
    is_admin,
    created_at
FROM public.users 
ORDER BY created_at DESC; 