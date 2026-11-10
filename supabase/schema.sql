-- ============================================================
-- Database Schema for GBI Samirono (`jemaat` table)
-- Run this SQL inside the Supabase SQL Editor
-- ============================================================

-- 1. Create the `jemaat` table
CREATE TABLE IF NOT EXISTS public.jemaat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap TEXT NOT NULL,
  alamat TEXT NOT NULL,
  no_telp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.jemaat ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies (idempotent)
DROP POLICY IF EXISTS "Allow authenticated users full access to jemaat" ON public.jemaat;

CREATE POLICY "Allow authenticated users full access to jemaat"
  ON public.jemaat
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
