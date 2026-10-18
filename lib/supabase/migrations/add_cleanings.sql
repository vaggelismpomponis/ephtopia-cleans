-- ============================================================
-- Ephtopia Cleans — Cleanings & Clients Management Schema
-- Run this in Supabase Dashboard → Database → SQL Editor
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. CLEANING CLIENTS TABLE (Πελάτες Airbnb & Ξενοδοχείων)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cleaning_clients (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  category       TEXT        NOT NULL CHECK (category IN ('airbnb', 'hotel')),
  name           TEXT        NOT NULL, -- Ονοματεπώνυμο ή Επωνυμία
  contact_person TEXT,                 -- Υπεύθυνος επικοινωνίας (π.χ. Reception Manager)
  phone          TEXT        NOT NULL, -- Τηλέφωνο
  email          TEXT,                 -- Email
  notes          TEXT,                 -- Γενικές σημειώσεις
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 2. CLIENT PROPERTIES TABLE (Καταλύματα / Δωμάτια ανά πελάτη)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cleaning_properties (
  id                     UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id              UUID        NOT NULL REFERENCES cleaning_clients(id) ON DELETE CASCADE,
  name                   TEXT        NOT NULL, -- π.χ. "Acropolis Penthouse", "Δωμάτιο 204"
  address                TEXT        NOT NULL, -- Οδός & Αριθμός
  area                   TEXT,                 -- Περιοχή / Πόλη
  floor                  TEXT,                 -- π.χ. "3ος", "Ισόγειο", "Διώροφη μεζονέτα"
  access_code            TEXT,                 -- Κωδικός εισόδου / Lockbox / Θυροτηλέφωνο
  entry_instructions     TEXT,                 -- Οδηγίες για τον οδηγό & καθαρίστρια
  cleaning_instructions  TEXT,                 -- Ειδικές απαιτήσεις καθαρισμού
  created_at             TIMESTAMPTZ DEFAULT now(),
  updated_at             TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 3. CLEANING RECORDS TABLE (Προγραμματισμένοι / Ολοκληρωμένοι καθαρισμοί)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cleaning_records (
  id                     UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  category               TEXT        NOT NULL CHECK (category IN ('airbnb', 'hotel')),
  client_id              UUID        REFERENCES cleaning_clients(id) ON DELETE SET NULL,
  property_id            UUID        REFERENCES cleaning_properties(id) ON DELETE SET NULL,
  
  -- Historical snapshot fields (διατηρούνται ακέραια και σε μελλοντικές αλλαγές πελάτη)
  client_name            TEXT        NOT NULL,
  client_phone           TEXT,
  property_name          TEXT        NOT NULL,
  address                TEXT        NOT NULL,
  area                   TEXT,
  floor                  TEXT,
  access_code            TEXT,
  entry_instructions     TEXT,
  cleaning_instructions  TEXT,
  
  -- Operational fields
  scheduled_date         DATE        NOT NULL, -- Ημερομηνία καθαρισμού (YYYY-MM-DD)
  scheduled_time         TEXT,                 -- π.χ. "11:00 - 14:00" ή "10:30"
  status                 TEXT        NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  priority               TEXT        NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  cleaner_name           TEXT,                 -- Όνομα καθαρίστριας / συνεργείου
  driver_name            TEXT,                 -- Όνομα οδηγού μεταφοράς
  linen_requirements     TEXT,                 -- Λευκά είδη (π.χ. "4 διπλά σεντόνια, 8 πετσέτες")
  special_notes          TEXT,                 -- Σημειώσεις ημέρας / Check-in ώρα κλπ.
  price                  NUMERIC(10, 2),       -- Τιμή καθαρισμού
  created_at             TIMESTAMPTZ DEFAULT now(),
  updated_at             TIMESTAMPTZ DEFAULT now(),
  created_by             UUID        REFERENCES auth.users(id)
);

-- ──────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at triggers
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_cleaning_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleaning_clients_updated_at
  BEFORE UPDATE ON cleaning_clients
  FOR EACH ROW EXECUTE FUNCTION update_cleaning_tables_updated_at();

CREATE TRIGGER cleaning_properties_updated_at
  BEFORE UPDATE ON cleaning_properties
  FOR EACH ROW EXECUTE FUNCTION update_cleaning_tables_updated_at();

CREATE TRIGGER cleaning_records_updated_at
  BEFORE UPDATE ON cleaning_records
  FOR EACH ROW EXECUTE FUNCTION update_cleaning_tables_updated_at();

-- ──────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────────
ALTER TABLE cleaning_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_records ENABLE ROW LEVEL SECURITY;

-- Admins can perform all actions
CREATE POLICY "Admin full access on cleaning_clients"
  ON cleaning_clients FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on cleaning_properties"
  ON cleaning_properties FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on cleaning_records"
  ON cleaning_records FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cleaning_records_date ON cleaning_records(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_cleaning_records_cat ON cleaning_records(category);
CREATE INDEX IF NOT EXISTS idx_cleaning_records_status ON cleaning_records(status);
CREATE INDEX IF NOT EXISTS idx_cleaning_properties_client ON cleaning_properties(client_id);
