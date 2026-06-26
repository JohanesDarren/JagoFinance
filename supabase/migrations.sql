-- DDL Migrations for Jago Finance (Supabase PostgreSQL)

-- =========================================================================
-- TRIGGER FUNCTION FOR updated_at
-- =========================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- 1. TABLE: companies
-- =========================================================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_companies_modtime
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 2. TABLE: profiles (Extends Supabase auth.users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 3. TABLE: employees
-- =========================================================================
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    division VARCHAR(255),
    salary NUMERIC(15, 2),
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_employees_modtime
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 4. TABLE: transactions
-- =========================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    date DATE,
    merchant VARCHAR(255),
    category VARCHAR(100),
    amount NUMERIC(15, 2),
    notes TEXT,
    type VARCHAR(50) CHECK (type IN ('income', 'expense', 'reimburse')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_transactions_modtime
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 5. TABLE: connected_apps
-- =========================================================================
CREATE TABLE IF NOT EXISTS connected_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    app_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',
    webhook_url TEXT,
    api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE connected_apps ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_connected_apps_modtime
    BEFORE UPDATE ON connected_apps
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 6. TABLE: subscriptions
-- =========================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_subscriptions_modtime
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Companies RLS
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

-- Profiles RLS
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

-- Employees RLS policies
CREATE POLICY "Isolate employees per company for ALL operations"
    ON employees FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()))
    WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Transactions RLS policies
CREATE POLICY "Isolate transactions per company for ALL operations"
    ON transactions FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()))
    WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Connected Apps RLS policies
CREATE POLICY "Isolate connected apps per company for ALL operations"
    ON connected_apps FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()))
    WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Subscriptions RLS policies
CREATE POLICY "Isolate subscriptions per company for ALL operations"
    ON subscriptions FOR ALL
    USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()))
    WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));
