-- Add source column to rewards table
ALTER TABLE public.rewards 
ADD COLUMN IF NOT EXISTS source TEXT;

-- Update existing rewards to have proper source values
UPDATE public.rewards 
SET source = 'signup' 
WHERE type = 'bonus' AND source IS NULL;

UPDATE public.rewards 
SET source = 'referral_bonus' 
WHERE type = 'referral' AND source IS NULL; 