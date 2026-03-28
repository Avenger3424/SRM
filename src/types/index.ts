export interface Agent {
  id: string
  name: string
  status: 'online' | 'offline' | 'compromised'
  last_heartbeat: string
  created_at: string
  environment: string
  internal_ip: string
  external_ip: string
}

export interface Payload {
  id: string
  name: string
  type: string
  delivery_method: string
  payload_hash: string
  created_at: string
  status: 'active' | 'inactive' | 'blocked'
  description: string
}

export interface AccessPath {
  id: string
  source_agent_id: string
  target_agent_id: string
  access_type: 'direct' | 'lateral_movement' | 'privilege_escalation'
  status: 'attempted' | 'successful' | 'failed'
  created_at: string
  description: string
}

export interface Infrastructure {
  id: string
  name: string
  type: 'redirector' | 'worker' | 'c2_server'
  ip_address: string
  port: number | null
  status: 'active' | 'inactive' | 'compromised'
  created_at: string
  description: string
}
