-- Clean up old conflicting tables if they exist
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS finance_settings CASCADE;
DROP TABLE IF EXISTS connected_apps CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS broadcast_notifications CASCADE;
DROP TABLE IF EXISTS payroll_history CASCADE;
DROP TABLE IF EXISTS reimbursement_claims CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- 1. COMPANIES (Tenants)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'Free' CHECK (subscription_tier IN ('Free', 'Starter', 'Pro')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 2. BRANCHES
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES (Extends auth.users)
-- Create if completely new
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Clean up old role constraint if it exists from older migrations
ALTER TABLE profiles DROP COLUMN IF EXISTS role CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS company_id CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS branch_id CASCADE;

-- Ensure necessary columns exist
ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(100),
    ADD COLUMN IF NOT EXISTS location TEXT,
    ADD COLUMN IF NOT EXISTS base_salary NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add the new role column with the correct constraint
ALTER TABLE profiles ADD COLUMN role VARCHAR(50) DEFAULT 'karyawan' CHECK (role IN ('super_admin', 'admin_corp', 'karyawan'));

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper Function: Get User's Company ID
CREATE OR REPLACE FUNCTION user_company_id()
RETURNS UUID AS $$
    SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper Function: Get User's Role
CREATE OR REPLACE FUNCTION user_role()
RETURNS VARCHAR AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. TRANSACTIONS
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('inbound', 'outbound', 'payroll', 'reimbursement')),
    amount NUMERIC(15, 2) NOT NULL,
    category VARCHAR(100),
    merchant VARCHAR(255),
    notes TEXT,
    receipt_url TEXT,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 5. REIMBURSEMENT CLAIMS
CREATE TABLE reimbursement_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    receipt_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE reimbursement_claims ENABLE ROW LEVEL SECURITY;

-- 6. PAYROLL HISTORY
CREATE TABLE payroll_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    period_month INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year INT NOT NULL,
    base_salary NUMERIC(15, 2) DEFAULT 0,
    allowance NUMERIC(15, 2) DEFAULT 0,
    deduction NUMERIC(15, 2) DEFAULT 0,
    net_salary NUMERIC(15, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE payroll_history ENABLE ROW LEVEL SECURITY;

-- 7. BROADCAST NOTIFICATIONS
CREATE TABLE broadcast_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_type VARCHAR(50) DEFAULT 'all' CHECK (target_type IN ('all', 'branch', 'specific_users')),
    target_branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE broadcast_notifications ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- RLS POLICIES
-- =========================================================================

-- Drop old policies to avoid conflicts if they exist
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Users can view branches in their company" ON branches;
DROP POLICY IF EXISTS "Super Admins can manage branches" ON branches;
DROP POLICY IF EXISTS "Users can view profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Users can view transactions in their company" ON transactions;
DROP POLICY IF EXISTS "Admins can manage transactions" ON transactions;
DROP POLICY IF EXISTS "Employees can view their own claims" ON reimbursement_claims;
DROP POLICY IF EXISTS "Employees can insert their own claims" ON reimbursement_claims;
DROP POLICY IF EXISTS "Admins can view and manage all claims in their company" ON reimbursement_claims;
DROP POLICY IF EXISTS "Employees can view their own payroll" ON payroll_history;
DROP POLICY IF EXISTS "Admins can manage payrolls" ON payroll_history;
DROP POLICY IF EXISTS "Users can view broadcasts in their company" ON broadcast_notifications;
DROP POLICY IF EXISTS "Super Admins can send broadcasts" ON broadcast_notifications;

-- Companies: Users can only see their own company
CREATE POLICY "Users can view their own company"
    ON companies FOR SELECT
    USING (id = user_company_id());

-- Branches: Visible if in the same company
CREATE POLICY "Users can view branches in their company"
    ON branches FOR SELECT
    USING (company_id = user_company_id());

CREATE POLICY "Super Admins can manage branches"
    ON branches FOR ALL
    USING (company_id = user_company_id() AND user_role() = 'super_admin');

-- Profiles: Users can see profiles in their company
CREATE POLICY "Users can view profiles in their company"
    ON profiles FOR SELECT
    USING (company_id = user_company_id());

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles in their company"
    ON profiles FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));

-- Transactions
CREATE POLICY "Users can view transactions in their company"
    ON transactions FOR SELECT
    USING (company_id = user_company_id());

CREATE POLICY "Admins can manage transactions"
    ON transactions FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));

-- Reimbursement Claims
CREATE POLICY "Employees can view their own claims"
    ON reimbursement_claims FOR SELECT
    USING (employee_id = auth.uid());

CREATE POLICY "Employees can insert their own claims"
    ON reimbursement_claims FOR INSERT
    WITH CHECK (employee_id = auth.uid() AND company_id = user_company_id());

CREATE POLICY "Admins can view and manage all claims in their company"
    ON reimbursement_claims FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));

-- Payroll History
CREATE POLICY "Employees can view their own payroll"
    ON payroll_history FOR SELECT
    USING (employee_id = auth.uid());

CREATE POLICY "Admins can manage payrolls"
    ON payroll_history FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));

-- Broadcast Notifications
CREATE POLICY "Users can view broadcasts in their company"
    ON broadcast_notifications FOR SELECT
    USING (company_id = user_company_id());

CREATE POLICY "Super Admins can send broadcasts"
    ON broadcast_notifications FOR ALL
    USING (company_id = user_company_id() AND user_role() = 'super_admin');
