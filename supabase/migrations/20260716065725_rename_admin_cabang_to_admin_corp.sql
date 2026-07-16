-- 1. Drop old constraints on users table
ALTER TABLE users DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- 2. Update existing data
UPDATE users SET role = 'admin_corp' WHERE role = 'admin_cabang';

-- 3. Add new constraint
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('super_admin', 'admin_corp', 'karyawan'));

-- 4. Recreate policies that used admin_cabang

-- Policy for Users (was profiles)
DROP POLICY IF EXISTS "Admins can manage profiles in their company" ON users;
CREATE POLICY "Admins can manage profiles in their company"
    ON users FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));

-- Policy for Transactions
DROP POLICY IF EXISTS "Admins can manage transactions" ON transactions;
CREATE POLICY "Admins can manage transactions"
    ON transactions FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));

-- Policy for Reimbursement Claims
DROP POLICY IF EXISTS "Admins can view and manage all claims in their company" ON reimbursement_claims;
CREATE POLICY "Admins can view and manage all claims in their company"
    ON reimbursement_claims FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));

-- Policy for Payroll History
DROP POLICY IF EXISTS "Admins can manage payrolls" ON payroll_history;
CREATE POLICY "Admins can manage payrolls"
    ON payroll_history FOR ALL
    USING (company_id = user_company_id() AND user_role() IN ('super_admin', 'admin_corp'));
