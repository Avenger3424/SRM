/*
  # Create agents table for Mission Control

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text) - Agent identifier/hostname
      - `status` (text) - online, offline, compromised
      - `last_heartbeat` (timestamp)
      - `created_at` (timestamp)
      - `environment` (text) - Windows, Linux, macOS
      - `internal_ip` (text)
      - `external_ip` (text)
      
  2. Security
    - Enable RLS on `agents` table
    - Add policy for authenticated users to read all agents
*/

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'offline',
  last_heartbeat timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  environment text NOT NULL,
  internal_ip text,
  external_ip text
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read agents"
  ON agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
