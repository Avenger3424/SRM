import { useEffect, useState } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { AccessPath, Agent } from '../../types'

export function MultiStageAccess() {
  const [accessPaths, setAccessPaths] = useState<AccessPath[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    source_agent_id: '',
    target_agent_id: '',
    access_type: 'lateral_movement',
    description: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [agentsResponse, pathsResponse] = await Promise.all([
        supabase.from('agents').select('*'),
        supabase.from('access_paths').select('*').order('created_at', { ascending: false }),
      ])

      if (agentsResponse.error) throw agentsResponse.error
      if (pathsResponse.error) throw pathsResponse.error

      setAgents(agentsResponse.data || [])
      setAccessPaths(pathsResponse.data || [])
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Failed to fetch data')
    }
  }

  const handleAddPath = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.source_agent_id || !formData.target_agent_id) {
      alert('Please select both source and target agents')
      return
    }

    try {
      const { error: insertError } = await supabase.from('access_paths').insert([
        {
          source_agent_id: formData.source_agent_id,
          target_agent_id: formData.target_agent_id,
          access_type: formData.access_type,
          description: formData.description,
          status: 'attempted',
        },
      ])

      if (insertError) throw insertError

      setFormData({
        source_agent_id: '',
        target_agent_id: '',
        access_type: 'lateral_movement',
        description: '',
      })
      setShowForm(false)
      await fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add access path')
    }
  }

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'direct':
        return 'bg-green-900/30 text-green-400'
      case 'lateral_movement':
        return 'bg-blue-900/30 text-blue-400'
      case 'privilege_escalation':
        return 'bg-red-900/30 text-red-400'
      default:
        return 'bg-slate-900/30 text-slate-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
      case 'attempted':
        return 'text-amber-400'
      default:
        return 'text-slate-400'
    }
  }

  const getAgentName = (id: string) => {
    return agents.find(a => a.id === id)?.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Total Paths</span>
          <div className="text-3xl font-bold text-white mt-2">{accessPaths.length}</div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Successful</span>
          <div className="text-3xl font-bold text-green-400 mt-2">
            {accessPaths.filter(p => p.status === 'successful').length}
          </div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Lateral Movements</span>
          <div className="text-3xl font-bold text-blue-400 mt-2">
            {accessPaths.filter(p => p.access_type === 'lateral_movement').length}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Access Path
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Create Access Path</h3>
          <form onSubmit={handleAddPath} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Source Agent</label>
                <select
                  value={formData.source_agent_id}
                  onChange={(e) => setFormData({ ...formData, source_agent_id: e.target.value })}
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select source...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Target Agent</label>
                <select
                  value={formData.target_agent_id}
                  onChange={(e) => setFormData({ ...formData, target_agent_id: e.target.value })}
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select target...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-slate-300 mb-2">Access Type</label>
                <select
                  value={formData.access_type}
                  onChange={(e) => setFormData({ ...formData, access_type: e.target.value })}
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="direct">Direct Access</option>
                  <option value="lateral_movement">Lateral Movement</option>
                  <option value="privilege_escalation">Privilege Escalation</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details about this access path"
                rows={3}
                className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Create Path
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-850 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Access Flow Visualization</h3>
          <button onClick={fetchData} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        <div className="p-6">
          {accessPaths.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No access paths defined. Create your first path to visualize the network.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accessPaths.map((path) => (
                <div
                  key={path.id}
                  className="flex items-center gap-4 p-4 bg-charcoal border border-slate-800 rounded-lg hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-slate-400">Source</div>
                        <div className="font-mono text-white">{getAgentName(path.source_agent_id)}</div>
                      </div>

                      <div className="text-indigo-500">→</div>

                      <div className="flex-1">
                        <div className="text-sm text-slate-400">Target</div>
                        <div className="font-mono text-white">{getAgentName(path.target_agent_id)}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getAccessTypeColor(path.access_type)}`}>
                        {path.access_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs font-semibold ${getStatusColor(path.status)}`}>
                        {path.status.toUpperCase()}
                      </span>
                      {path.description && <p className="text-xs text-slate-400">{path.description}</p>}
                    </div>
                  </div>

                  <button className="p-2 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Network Graph</h3>
        <div className="h-96 flex items-center justify-center border border-slate-800 rounded-lg bg-charcoal">
          <div className="text-center">
            <svg className="w-32 h-32 mx-auto text-slate-700 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-slate-400">Network graph visualization</p>
            <p className="text-xs text-slate-500 mt-1">Connect agents to visualize relationships</p>
          </div>
        </div>
      </div>
    </div>
  )
}
