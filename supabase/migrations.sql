-- DDL Migrations for Jago Finance (Supabase PostgreSQL)

-- 1. TABLE: companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    current_balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 2. TABLE: profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. TABLE: transactions (Ledger)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    merchant VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('income', 'expense', 'reimburse')),
    status VARCHAR(50) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    receipt_url TEXT,
    notes TEXT,
    staff_name VARCHAR(255),
    staff_email VARCHAR(255),
    timeline JSONB, -- Stores structured timeline events: [{label, date, done, active}]
    reject_reason TEXT,
    recipient_name VARCHAR(255),
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    transfer_receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. TABLE: employees (For Payroll management)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    division VARCHAR(255) NOT NULL,
    salary DECIMAL(15, 2) NOT NULL,
    bank_account VARCHAR(100),
    bank_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- 5. TABLE: connected_apps (Integrations)
CREATE TABLE IF NOT EXISTS connected_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
    api_key VARCHAR(255),
    webhook_url TEXT,
    monthly_revenue DECIMAL(15, 2) DEFAULT 0.00,
    payment_gateway VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on connected_apps
ALTER TABLE connected_apps ENABLE ROW LEVEL SECURITY;

-- 6. TABLE: subscriptions (Recurring costs)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(15, 2) NOT NULL,
    cycle VARCHAR(50) DEFAULT 'bulanan',
    next_billing DATE,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'warning', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;


-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Profiles RLS policies
CREATE POLICY "Allow users to insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to view profiles in their company"
    ON profiles FOR SELECT
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow users to update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Companies RLS policies
CREATE POLICY "Allow authenticated users to create a company"
    ON companies FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to view their own company details"
    ON companies FOR SELECT
    USING (id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow admin users to update their company"
    ON companies FOR UPDATE
    USING (
        id = (SELECT company_id FROM profiles WHERE id = auth.uid())
        AND 'admin' = (SELECT role FROM profiles WHERE id = auth.uid())
    );

-- Transactions RLS policies
CREATE POLICY "Isolate transactions per company"
    ON transactions FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Employees RLS policies
CREATE POLICY "Isolate employees per company"
    ON employees FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Connected Apps RLS policies
CREATE POLICY "Isolate connected apps per company"
    ON connected_apps FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Subscriptions RLS policies
CREATE POLICY "Isolate subscriptions per company"
    ON subscriptions FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));
