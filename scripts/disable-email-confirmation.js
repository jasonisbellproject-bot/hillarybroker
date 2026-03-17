const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function disableEmailConfirmation() {
  try {
    console.log('🔧 Disabling email confirmation for admin user...');

    const adminEmail = 'admin@bitsparetron.com';

    // Update the user to confirm their email
    const { data: userData, error: userError } = await supabase.auth.admin.updateUserById(
      'c7750996-2ecc-4889-9be6-8d506acb9a9a', // Admin user ID
      {
        email_confirm: true,
        email_confirmed_at: new Date().toISOString()
      }
    );

    if (userError) {
      console.error('❌ Error updating user:', userError.message);
      return;
    }

    console.log('✅ Email confirmation disabled for admin user');
    console.log('📧 Email:', userData.user.email);
    console.log('✅ Email confirmed:', userData.user.email_confirmed_at);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

disableEmailConfirmation(); 