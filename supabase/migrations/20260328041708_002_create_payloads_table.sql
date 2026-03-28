/*
  # Create payloads table for Payload Factory

  1. New Tables
    - `payloads`
      - `id` (uuid, primary key)
      - `name` (text) - Payload identifier
      - `type` (text) - exe, dll, ps1, sh, py, etc.
      - `delivery_method` (text) - http, email, smb, dns
      - `payload_hash` (text) - SHA256 hash
      - `created_at` (timestamp)
      - `status` (text) - active, inactive, blocked
      - `description` (text)
      
  2. Security
    - Enable RLS on `payloads` table
    - Add policy for authenticated users to manage payloads
*/

CREATE TABLE IF NOT EXISTS payloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  delivery_method text NOT NULL,
  payload_hash text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  description text
);

ALTER TABLE payloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read payloads"
  ON payloads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create payloads"
  ON payloads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payloads"
  ON payloads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
