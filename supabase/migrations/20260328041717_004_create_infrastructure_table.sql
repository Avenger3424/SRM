/*
  # Create infrastructure table for C2 management

  1. New Tables
    - `infrastructure`
      - `id` (uuid, primary key)
      - `name` (text) - Redirector/Worker node name
      - `type` (text) - redirector, worker, c2_server
      - `ip_address` (text)
      - `port` (integer)
      - `status` (text) - active, inactive, compromised
      - `created_at` (timestamp)
      - `description` (text)
      
  2. Security
    - Enable RLS on `infrastructure` table
    - Add policy for authenticated users to manage infrastructure
*/

CREATE TABLE IF NOT EXISTS infrastructure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  ip_address text NOT NULL,
  port integer,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  description text
);

ALTER TABLE infrastructure ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read infrastructure"
  ON infrastructure FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create infrastructure"
  ON infrastructure FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update infrastructure"
  ON infrastructure FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
