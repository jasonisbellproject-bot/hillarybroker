const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addSampleKYC() {
  try {
    console.log('🔍 Adding sample KYC data...');

    // Get some users to create KYC applications for
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(5);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('👥 Found users:', users.length);

    // Create sample KYC documents
    const sampleKYC = [];
    const kycStatuses = ['pending', 'under_review', 'approved', 'rejected'];
    const riskLevels = ['low', 'medium', 'high'];

    for (let i = 0; i < 10; i++) {
      const user = users[i % users.length];
      const status = kycStatuses[i % kycStatuses.length];
      const riskLevel = riskLevels[i % riskLevels.length];
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const created_at = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      sampleKYC.push({
        user_id: user.id,
        document_type: 'passport',
        document_number: `PASS${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        document_front_url: 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=ID+Front',
        document_back_url: 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=ID+Back',
        selfie_url: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=Selfie',
        status: status,
        risk_level: riskLevel,
        admin_notes: status === 'rejected' ? 'Document quality too low' : null,
        created_at: created_at,
        updated_at: created_at
      });
    }

    // Insert KYC documents
    const { data: insertedKYC, error: kycError } = await supabase
      .from('kyc_documents')
      .insert(sampleKYC)
      .select();

    if (kycError) {
      console.error('Error creating KYC documents:', kycError);
      return;
    }

    console.log('✅ Sample KYC documents created:', insertedKYC.length);
    console.log('📊 Summary:');
    console.log(`   - ${insertedKYC.length} KYC applications`);

  } catch (error) {
    console.error('❌ Error adding sample KYC data:', error);
  }
}

addSampleKYC(); 