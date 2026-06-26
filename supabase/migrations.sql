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
-- 1. TABLE: finance_settings
-- =========================================================================
CREATE TABLE IF NOT EXISTS finance_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    current_balance NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE finance_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_finance_settings_modtime
    BEFORE UPDATE ON finance_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 2. TABLE: profiles (Extends Supabase auth.users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    surname VARCHAR(255),
    national_id VARCHAR(100),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Admin check helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- Finance Settings RLS
CREATE POLICY "Finance settings visible to all authenticated"
    ON finance_settings FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Finance settings writable by admins only"
    ON finance_settings FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Profiles RLS
CREATE POLICY "Users can read all profiles"
    ON profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
    ON profiles FOR UPDATE
    USING (is_admin());

-- Employees RLS policies
CREATE POLICY "Employees visible to all authenticated"
    ON employees FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Employees writable by admins only"
    ON employees FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Transactions RLS policies
CREATE POLICY "Users can view all transactions"
    ON transactions FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (
        (SELECT p.role FROM profiles p WHERE p.id = auth.uid()) = 'admin'
    );

-- Connected Apps RLS policies
CREATE POLICY "Apps visible to all authenticated"
    ON connected_apps FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Apps writable by admins only"
    ON connected_apps FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Subscriptions RLS policies
CREATE POLICY "Subscriptions visible to all authenticated"
    ON subscriptions FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Subscriptions writable by admins only"
    ON subscriptions FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
