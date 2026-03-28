/*
  # Create access paths table for Multi-Stage Access

  1. New Tables
    - `access_paths`
      - `id` (uuid, primary key)
      - `source_agent_id` (uuid) - Reference to agents table
      - `target_agent_id` (uuid) - Reference to agents table
      - `access_type` (text) - direct, lateral_movement, privilege_escalation
      - `status` (text) - attempted, successful, failed
      - `created_at` (timestamp)
      - `description` (text)
      
  2. Security
    - Enable RLS on `access_paths` table
    - Add policy for authenticated users to manage access paths
*/

CREATE TABLE IF NOT EXISTS access_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_agent_id uuid NOT NULL REFERENCES agents(id),
  target_agent_id uuid NOT NULL REFERENCES agents(id),
  access_type text NOT NULL,
  status text NOT NULL DEFAULT 'attempted',
  created_at timestamptz DEFAULT now(),
  description text
);

ALTER TABLE access_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read access paths"
  ON access_paths FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create access paths"
  ON access_paths FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update access paths"
  ON access_paths FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
