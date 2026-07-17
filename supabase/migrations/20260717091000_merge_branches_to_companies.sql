-- Drop branch references from all tables
ALTER TABLE public.users DROP COLUMN IF EXISTS branch_id CASCADE;
ALTER TABLE public.transactions DROP COLUMN IF EXISTS branch_id CASCADE;
ALTER TABLE public.reimbursement_claims DROP COLUMN IF EXISTS branch_id CASCADE;
ALTER TABLE public.payroll_history DROP COLUMN IF EXISTS branch_id CASCADE;
ALTER TABLE public.broadcast_notifications DROP COLUMN IF EXISTS target_branch_id CASCADE;

-- Drop the branches table
DROP TABLE IF EXISTS public.branches CASCADE;
