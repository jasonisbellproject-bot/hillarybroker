-- Sample Copy Traders Data
-- Run this in your Supabase SQL Editor after creating the copy_traders table

-- First, let's get some existing user IDs to associate with copy traders
-- This will create copy traders for existing users in your database

-- Insert sample copy traders
INSERT INTO public.copy_traders (
    user_id,
    display_name,
    description,
    total_followers,
    total_copied_trades,
    success_rate,
    total_profit,
    min_copy_amount,
    max_copy_amount,
    copy_fee_percentage,
    is_verified,
    is_active
) VALUES 
-- Copy Trader 1: Professional Crypto Trader
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 0),
    'CryptoMaster Pro',
    'Professional crypto trader with 5+ years experience. Specializing in DeFi and yield farming strategies. Proven track record of consistent returns through market cycles.',
    156,
    342,
    87.5,
    15420.50,
    50.00,
    5000.00,
    3.5,
    true,
    true
),

-- Copy Trader 2: DeFi Expert
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 1),
    'DeFi Explorer',
    'Early DeFi adopter and yield optimizer. Focus on sustainable long-term strategies. Expert in liquidity mining and protocol analysis.',
    89,
    198,
    92.3,
    23450.75,
    100.00,
    10000.00,
    5.0,
    true,
    true
),

-- Copy Trader 3: Staking Specialist
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 2),
    'Staking Specialist',
    'Expert in staking strategies and passive income generation. Low risk, steady returns approach. Perfect for conservative investors.',
    234,
    567,
    95.8,
    8750.25,
    25.00,
    2500.00,
    2.5,
    false,
    true
),

-- Copy Trader 4: Aggressive Trader
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 3),
    'Trading Ninja',
    'Aggressive trading strategies with high risk/reward ratio. Not for the faint-hearted. Specializes in swing trading and momentum strategies.',
    67,
    123,
    78.9,
    45680.00,
    200.00,
    15000.00,
    7.0,
    true,
    true
),

-- Copy Trader 5: Conservative Investor
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 4),
    'Conservative Investor',
    'Safe and steady investment approach. Perfect for beginners and risk-averse investors. Focus on blue-chip crypto and stable returns.',
    445,
    789,
    96.2,
    12340.80,
    10.00,
    1000.00,
    2.0,
    false,
    true
),

-- Copy Trader 6: NFT Trader
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 0),
    'NFT Hunter',
    'Specialized in NFT trading and flipping. Expert in identifying undervalued collections and timing market entries. High volatility, high rewards.',
    78,
    156,
    82.4,
    28950.30,
    75.00,
    7500.00,
    4.5,
    true,
    true
),

-- Copy Trader 7: Technical Analyst
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 1),
    'Chart Master',
    'Technical analysis expert using advanced charting and indicators. Swing trading with precise entry and exit points. Risk management focused.',
    123,
    234,
    88.7,
    18750.60,
    150.00,
    8000.00,
    4.0,
    true,
    true
),

-- Copy Trader 8: Arbitrage Specialist
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 2),
    'Arbitrage Pro',
    'Cross-exchange arbitrage and market making specialist. Low-risk strategies exploiting price differences across platforms.',
    56,
    89,
    94.1,
    9870.45,
    300.00,
    12000.00,
    3.0,
    true,
    true
),

-- Copy Trader 9: Yield Farmer
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 3),
    'Yield Farmer',
    'DeFi yield farming expert. Maximizing returns through liquidity provision, staking, and protocol incentives.',
    167,
    298,
    91.3,
    32150.90,
    80.00,
    6000.00,
    3.8,
    true,
    true
),

-- Copy Trader 10: Scalper
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 4),
    'Scalp Master',
    'High-frequency scalping strategies. Quick in and out trades with tight stop losses. Requires constant monitoring.',
    34,
    67,
    76.5,
    15680.20,
    500.00,
    20000.00,
    6.5,
    false,
    true
);

-- Create some sample copy trading subscriptions
-- This will create subscriptions between users and copy traders

INSERT INTO public.copy_trading_subscriptions (
    follower_id,
    trader_id,
    copy_percentage,
    max_amount_per_trade,
    is_active,
    auto_copy
) VALUES 
-- User 1 subscribes to multiple traders
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.copy_traders WHERE display_name = 'CryptoMaster Pro' LIMIT 1),
    100.00,
    1000.00,
    true,
    true
),
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.copy_traders WHERE display_name = 'Conservative Investor' LIMIT 1),
    75.00,
    500.00,
    true,
    true
),

-- User 2 subscribes to different traders
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 1),
    (SELECT id FROM public.copy_traders WHERE display_name = 'DeFi Explorer' LIMIT 1),
    100.00,
    2000.00,
    true,
    true
),
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 1),
    (SELECT id FROM public.copy_traders WHERE display_name = 'Yield Farmer' LIMIT 1),
    50.00,
    1500.00,
    true,
    false
),

-- User 3 subscribes to conservative traders
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 2),
    (SELECT id FROM public.copy_traders WHERE display_name = 'Staking Specialist' LIMIT 1),
    100.00,
    800.00,
    true,
    true
),
(
    (SELECT id FROM public.users LIMIT 1 OFFSET 2),
    (SELECT id FROM public.copy_traders WHERE display_name = 'Conservative Investor' LIMIT 1),
    100.00,
    600.00,
    true,
    true
);

-- Create some sample copy trader trades
INSERT INTO public.copy_trader_trades (
    trader_id,
    trade_type,
    asset_type,
    asset_symbol,
    asset_name,
    amount,
    price,
    total_value,
    status,
    profit_loss,
    trade_notes,
    executed_at
) VALUES 
-- CryptoMaster Pro trades
(
    (SELECT id FROM public.copy_traders WHERE display_name = 'CryptoMaster Pro' LIMIT 1),
    'buy',
    'crypto',
    'ETH',
    'Ethereum',
    2.5,
    3200.00,
    8000.00,
    'executed',
    450.00,
    'Bought ETH on dip, strong support at 3200',
    NOW() - INTERVAL '2 days'
),
(
    (SELECT id FROM public.copy_traders WHERE display_name = 'CryptoMaster Pro' LIMIT 1),
    'sell',
    'crypto',
    'BTC',
    'Bitcoin',
    0.1,
    65000.00,
    6500.00,
    'executed',
    800.00,
    'Took profits on BTC rally',
    NOW() - INTERVAL '1 day'
),

-- DeFi Explorer trades
(
    (SELECT id FROM public.copy_traders WHERE display_name = 'DeFi Explorer' LIMIT 1),
    'stake',
    'defi',
    'UNI',
    'Uniswap',
    100.00,
    12.50,
    1250.00,
    'executed',
    125.00,
    'Staked UNI for governance rewards',
    NOW() - INTERVAL '3 days'
),

-- Staking Specialist trades
(
    (SELECT id FROM public.copy_traders WHERE display_name = 'Staking Specialist' LIMIT 1),
    'stake',
    'staking',
    'ADA',
    'Cardano',
    5000.00,
    0.45,
    2250.00,
    'executed',
    112.50,
    'Long-term ADA staking for passive income',
    NOW() - INTERVAL '5 days'
),

-- Trading Ninja trades
(
    (SELECT id FROM public.copy_traders WHERE display_name = 'Trading Ninja' LIMIT 1),
    'buy',
    'crypto',
    'SOL',
    'Solana',
    50.00,
    180.00,
    9000.00,
    'executed',
    -450.00,
    'SOL trade hit stop loss',
    NOW() - INTERVAL '1 day'
);

-- Success message
SELECT 'Sample copy traders data inserted successfully!' as status;
