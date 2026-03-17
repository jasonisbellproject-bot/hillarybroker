import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Fetch all active wallet addresses
    const { data: walletAddresses, error } = await supabase
      .from('wallet_addresses')
      .select('*')
      .eq('status', 'active')
      .order('type', { ascending: true });

    if (error) {
      console.error('Error fetching wallet addresses:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch wallet addresses',
        details: error.message 
      }, { status: 500 });
    }

    // Map the database fields to the expected field names for the frontend
    const mappedAddresses = (walletAddresses || []).map(address => ({
      id: address.id,
      name: address.name,
      type: address.type,
      wallet_address: address.address, // Map 'address' to 'wallet_address'
      network: address.network,
      fee: address.fee,
      min_amount: address.min_amount,
      max_amount: address.max_amount,
      processing_time: address.processing_time,
      status: address.status,
      description: address.description,
      icon: address.icon,
      created_at: address.created_at
    }));

    return NextResponse.json(mappedAddresses);

  } catch (error) {
    console.error('Error in wallet addresses API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 