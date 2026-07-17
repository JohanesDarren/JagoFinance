CREATE TABLE IF NOT EXISTS public.finance_settings (
    id SERIAL PRIMARY KEY,
    current_balance NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.finance_settings (id, current_balance) 
VALUES (1, 150000000)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE public.finance_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users" ON public.finance_settings
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow update for admin_corp and super_admin" ON public.finance_settings
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND (users.role = 'admin_corp' OR users.role = 'super_admin')
        )
    );
