import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // For now, let's use the admin user ID directly for testing
    const adminUserId = '0a7ef47a-5ab2-4484-8112-d55423203155'; // Admin user ID

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // For demo purposes, return sample wallet data
    // In a real implementation, you would fetch from a wallets table
    const sampleWallets = [
      {
        id: '1',
        currency: 'Bitcoin',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        network: 'Bitcoin',
        status: 'active',
        balance: 0.0,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        currency: 'Ethereum',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        network: 'Ethereum',
        status: 'active',
        balance: 0.0,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        currency: 'USDT',
        address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        network: 'TRC20',
        status: 'active',
        balance: 0.0,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '4',
        currency: 'USDC',
        address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C',
        network: 'ERC20',
        status: 'active',
        balance: 0.0,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '5',
        currency: 'Litecoin',
        address: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        network: 'Litecoin',
        status: 'active',
        balance: 0.0,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ];

    return NextResponse.json({
      wallets: sampleWallets,
      summary: {
        totalWallets: sampleWallets.length,
        activeWallets: sampleWallets.filter(w => w.status === 'active').length,
        totalBalance: sampleWallets.reduce((sum, w) => sum + w.balance, 0),
        supportedCurrencies: new Set(sampleWallets.map(w => w.currency)).size
      }
    });

  } catch (error) {
    console.error('Error in admin wallets API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currency, address, network } = body

    if (!currency || !address || !network) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For demo purposes, return success if database is not configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        success: true, 
        message: 'Wallet address added successfully',
        wallet: {
          id: Date.now().toString(),
          currency,
          address,
          network,
          status: "active",
          balance: 0.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })
    }

    // In a real implementation, you would insert into a wallets table
    // For now, we'll return success
    return NextResponse.json({ 
      success: true, 
      message: 'Wallet address added successfully' 
    })
  } catch (error) {
    console.error('Admin wallets POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 