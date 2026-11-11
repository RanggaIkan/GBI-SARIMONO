-- ============================================================
-- Database Schema for GBI Samirono (`jemaat` & `inventaris`)
-- Run this SQL inside the Supabase SQL Editor
-- ============================================================

-- 1. Create the `jemaat` table
CREATE TABLE IF NOT EXISTS public.jemaat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap TEXT NOT NULL,
  tanggal_lahir TEXT,
  alamat TEXT NOT NULL,
  no_telp TEXT NOT NULL,
  komsel TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add columns if `jemaat` already exists
ALTER TABLE public.jemaat
  ADD COLUMN IF NOT EXISTS tanggal_lahir TEXT,
  ADD COLUMN IF NOT EXISTS komsel TEXT;

-- Enable Row Level Security (RLS) for `jemaat`
ALTER TABLE public.jemaat ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users full access to jemaat" ON public.jemaat;

CREATE POLICY "Allow authenticated users full access to jemaat"
  ON public.jemaat
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 2. Create the `inventaris` table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inventaris (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_barang TEXT NOT NULL,
  kategori TEXT NOT NULL,
  jumlah INTEGER NOT NULL DEFAULT 1,
  kondisi TEXT NOT NULL DEFAULT 'Baik',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for `inventaris`
ALTER TABLE public.inventaris ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users full access to inventaris" ON public.inventaris;

CREATE POLICY "Allow authenticated users full access to inventaris"
  ON public.inventaris
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
