-- Rename table
ALTER TABLE IF EXISTS profiles RENAME TO users;

-- Recreate functions to query users instead of profiles
CREATE OR REPLACE FUNCTION user_company_id()
RETURNS UUID AS $$
    SELECT company_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION user_role()
RETURNS VARCHAR AS $$
    SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Ensure required extensions are available (pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert Dummy Company
INSERT INTO companies (id, name, subscription_tier) 
VALUES ('00000000-0000-0000-0000-000000000001', 'PT Jago Finance', 'Pro')
ON CONFLICT (id) DO NOTHING;

-- Insert Dummy Branch
INSERT INTO branches (id, company_id, name, location)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Kantor Pusat', 'Jakarta')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 1. Super Admin
-- =========================================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 
    'superadmin@jagofinance.com', extensions.crypt('password', extensions.gen_salt('bf')), now(), now(), 
    '{"provider":"email","providers":["email"]}', '{}', now(), now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) 
VALUES (
    gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', format('{"sub":"%s","email":"%s"}', '11111111-1111-1111-1111-111111111111', 'superadmin@jagofinance.com')::jsonb, 
    'email', now(), now(), now()
) ON CONFLICT DO NOTHING;

-- =========================================================================
-- 2. Admin Corp
-- =========================================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 
    'admincorp@jagofinance.com', extensions.crypt('password', extensions.gen_salt('bf')), now(), now(), 
    '{"provider":"email","providers":["email"]}', '{}', now(), now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) 
VALUES (
    gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', format('{"sub":"%s","email":"%s"}', '22222222-2222-2222-2222-222222222222', 'admincorp@jagofinance.com')::jsonb, 
    'email', now(), now(), now()
) ON CONFLICT DO NOTHING;

-- =========================================================================
-- 3. Karyawan
-- =========================================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 
    'karyawan@jagofinance.com', extensions.crypt('password', extensions.gen_salt('bf')), now(), now(), 
    '{"provider":"email","providers":["email"]}', '{}', now(), now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) 
VALUES (
    gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', format('{"sub":"%s","email":"%s"}', '33333333-3333-3333-3333-333333333333', 'karyawan@jagofinance.com')::jsonb, 
    'email', now(), now(), now()
) ON CONFLICT DO NOTHING;

-- =========================================================================
-- Insert into public.users
-- =========================================================================
INSERT INTO public.users (id, company_id, branch_id, role, full_name, email)
VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'super_admin', 'Budi Superadmin', 'superadmin@jagofinance.com'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'admin_corp', 'Siti Admin Corp', 'admincorp@jagofinance.com'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'karyawan', 'Andi Karyawan', 'karyawan@jagofinance.com')
ON CONFLICT (id) DO UPDATE SET 
    role = EXCLUDED.role, 
    full_name = EXCLUDED.full_name, 
    email = EXCLUDED.email;
