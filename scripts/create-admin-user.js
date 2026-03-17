const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...');

    // Admin user details
    const adminEmail = 'admin@bitsparetron.com';
    const adminPassword = 'Admin123!';
    const adminData = {
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User',
        is_admin: true
      }
    };

    // Create user in auth.users
    console.log('👤 Creating user in auth.users...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true,
      user_metadata: adminData.user_metadata
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message);
      return;
    }

    console.log('✅ Auth user created:', authUser.user.id);

    // Create user profile in public.users
    console.log('👥 Creating user profile in public.users...');
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: adminData.email,
        first_name: adminData.user_metadata.first_name,
        last_name: adminData.user_metadata.last_name,
        is_admin: true,
        status: 'active',
        wallet_balance: 0,
        total_earned: 0,
        total_staked: 0,
        referral_code: 'ADMIN001',
        kyc_verified: true
      });

    if (profileError) {
      console.error('❌ Error creating user profile:', profileError.message);
      return;
    }

    console.log('✅ User profile created successfully!');

    // Create admin notification
    console.log('🔔 Creating admin notification...');
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: authUser.user.id,
        title: 'Welcome Admin!',
        message: 'Your admin account has been created successfully. You can now access the admin panel.',
        type: 'success'
      });

    if (notificationError) {
      console.log('⚠️  Notification creation issue:', notificationError.message);
    } else {
      console.log('✅ Admin notification created');
    }

    console.log('\n🎉 Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🆔 User ID:', authUser.user.id);
    console.log('\n💡 You can now login to the admin panel with these credentials');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

createAdminUser(); 