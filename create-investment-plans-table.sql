-- Create investment_plans table
CREATE TABLE IF NOT EXISTS investment_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  min_investment DECIMAL(15,2) NOT NULL,
  max_investment DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(5,2) NOT NULL,
  duration INTEGER NOT NULL, -- in days
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_investors INTEGER DEFAULT 0,
  total_invested DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_investment_plans_status ON investment_plans(status);
CREATE INDEX IF NOT EXISTS idx_investment_plans_created_at ON investment_plans(created_at);

-- Insert some sample investment plans
INSERT INTO investment_plans (name, description, min_investment, max_investment, daily_return, duration, status) VALUES
('Starter Plan', 'Perfect for beginners. Low risk with steady returns.', 100, 1000, 2.5, 30, 'active'),
('Professional Plan', 'For experienced investors. Higher returns with moderate risk.', 1000, 10000, 3.5, 60, 'active'),
('Premium Plan', 'High-yield investment plan for serious investors.', 10000, 50000, 4.5, 90, 'active'),
('VIP Plan', 'Exclusive plan with maximum returns for VIP members.', 50000, 100000, 5.5, 120, 'active');

-- Enable Row Level Security (RLS)
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read investment plans
CREATE POLICY "Allow authenticated users to read investment plans" ON investment_plans
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow only admins to insert/update/delete investment plans
CREATE POLICY "Allow admins to manage investment plans" ON investment_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  ); 