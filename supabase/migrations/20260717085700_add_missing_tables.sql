-- Create connected_apps table
CREATE TABLE IF NOT EXISTS public.connected_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
    api_key VARCHAR(255),
    webhook_url TEXT,
    monthly_revenue NUMERIC(15, 2) DEFAULT 0,
    payment_gateway VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
    cycle VARCHAR(50) DEFAULT 'bulanan',
    next_billing DATE,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Alter users table to add missing fields for Employee mapping
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS division VARCHAR(100),
    ADD COLUMN IF NOT EXISTS bank_account VARCHAR(100),
    ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);

-- Set up RLS for connected_apps
ALTER TABLE public.connected_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view connected_apps in their company" ON public.connected_apps FOR SELECT USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can manage connected_apps" ON public.connected_apps FOR ALL USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()) AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin', 'admin_corp'));

-- Set up RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view subscriptions in their company" ON public.subscriptions FOR SELECT USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()) AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin', 'admin_corp'));
