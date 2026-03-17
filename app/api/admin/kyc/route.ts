import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin KYC API - Starting request...')
    
    // Check admin authentication
    const auth = await requireAuth(request);
    const adminUserId = auth.user.id;

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      console.log('❌ Admin access denied')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('✅ Admin access verified')

    // Get filter parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query with proper user data join
    let query = supabase
      .from('kyc_documents')
      .select(`
        *,
        users!kyc_documents_user_id_fkey(
          email,
          first_name,
          last_name
        )
      `, { count: 'exact' });

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: kycDocuments, error, count } = await query;

    if (error) {
      console.error('❌ Error fetching KYC documents:', error);
      return NextResponse.json({ error: 'Failed to fetch KYC documents' }, { status: 500 });
    }

    console.log('✅ KYC documents fetched successfully:', kycDocuments?.length || 0)

    // Format the data for the frontend
    const formattedDocuments = (kycDocuments || []).map(doc => ({
      ...doc,
      user: {
        email: doc.users?.email || 'Unknown',
        full_name: doc.users?.first_name && doc.users?.last_name 
          ? `${doc.users.first_name} ${doc.users.last_name}`.trim()
          : doc.users?.email || 'Unknown User'
      }
    }));

    return NextResponse.json({
      kycDocuments: formattedDocuments,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error in admin KYC API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 