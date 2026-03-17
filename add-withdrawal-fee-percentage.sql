-- Add withdrawal_fee_percentage column to platform_settings table
ALTER TABLE public.platform_settings 
ADD COLUMN IF NOT EXISTS withdrawal_fee_percentage DECIMAL(5,2) DEFAULT 30.00;

-- Update existing records to have a default percentage if withdrawal_fee_percentage is NULL
UPDATE public.platform_settings 
SET withdrawal_fee_percentage = 30.00 
WHERE withdrawal_fee_percentage IS NULL;

-- Add comment to explain the new column
COMMENT ON COLUMN public.platform_settings.withdrawal_fee_percentage IS 'Withdrawal fee as percentage of user balance (e.g., 30.00 for 30%)'; 