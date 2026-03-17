import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const now = new Date();
    
    // Find all scheduled investments that should be activated
    const { data: scheduledInvestments, error: fetchError } = await supabase
      .from('investments')
      .select(`
        *,
        users(wallet_balance),
        investment_plans(name)
      `)
      .eq('status', 'scheduled')
      .lte('start_date', now.toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled investments:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch scheduled investments' }, { status: 500 });
    }

    if (!scheduledInvestments || scheduledInvestments.length === 0) {
      return NextResponse.json({ 
        message: 'No scheduled investments to activate',
        activated: 0 
      });
    }

    let activatedCount = 0;
    const errors = [];

    // Process each scheduled investment
    for (const investment of scheduledInvestments) {
      try {
        // Check if user has sufficient balance
        if (investment.users.wallet_balance < investment.amount) {
          errors.push(`Insufficient balance for investment ${investment.id}`);
          continue;
        }

        // Update investment status to active
        const { error: updateError } = await supabase
          .from('investments')
          .update({ 
            status: 'active',
            updated_at: now.toISOString()
          })
          .eq('id', investment.id);

        if (updateError) {
          errors.push(`Failed to activate investment ${investment.id}: ${updateError.message}`);
          continue;
        }

        // Deduct amount from user balance
        const { error: balanceError } = await supabase
          .from('users')
          .update({ 
            wallet_balance: investment.users.wallet_balance - investment.amount 
          })
          .eq('id', investment.user_id);

        if (balanceError) {
          errors.push(`Failed to update balance for investment ${investment.id}: ${balanceError.message}`);
          continue;
        }

        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: investment.user_id,
            type: 'investment',
            amount: investment.amount,
            currency: 'USD',
            method: investment.investment_plans.name,
            reference: `SCHEDULED-INV-${investment.id}`,
            status: 'completed',
            metadata: { 
              plan_id: investment.plan_id, 
              investment_id: investment.id,
              scheduled: true 
            }
          });

        if (transactionError) {
          console.error('Error creating transaction for scheduled investment:', transactionError);
        }

        activatedCount++;
        console.log(`Activated scheduled investment ${investment.id} for user ${investment.user_id}`);

      } catch (error) {
        errors.push(`Error processing investment ${investment.id}: ${error}`);
      }
    }

    return NextResponse.json({
      message: `Activated ${activatedCount} scheduled investments`,
      activated: activatedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in activate scheduled investments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 