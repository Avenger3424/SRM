import { useEffect, useState } from 'react'
import { Activity, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle, Plus, Trash2, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Agent } from '../../types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function MissionControl() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAgents = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setAgents(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-900/30 text-green-400 border-green-700/50'
      case 'offline':
        return 'bg-gray-900/30 text-gray-400 border-gray-700/50'
      case 'compromised':
        return 'bg-indigo-900/30 text-indigo-400 border-indigo-700/50'
      default:
        return 'bg-slate-900/30 text-slate-400 border-slate-700/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />
      case 'offline':
        return <XCircle className="w-4 h-4" />
      case 'compromised':
        return <Activity className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const onlineCount = agents.filter(a => a.status === 'online').length

  const chartData = [
    { time: '00:00', agents: 12 },
    { time: '04:00', agents: 15 },
    { time: '08:00', agents: 20 },
    { time: '12:00', agents: 18 },
    { time: '16:00', agents: 22 },
    { time: '20:00', agents: onlineCount },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Active Agents</span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-white">{onlineCount}</div>
          <p className="text-xs text-slate-500 mt-2">of {agents.length} total</p>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Compromised</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-white">
            {agents.filter(a => a.status === 'compromised').length}
          </div>
          <p className="text-xs text-slate-500 mt-2">Systems infiltrated</p>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Heartbeat Status</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white">98%</div>
          <p className="text-xs text-slate-500 mt-2">Network reliability</p>
        </div>
      </div>

      <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Agent Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a5a7f" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #3a5a7f' }}
              labelStyle={{ color: '#e0e0e0' }}
            />
            <Line type="monotone" dataKey="agents" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-850 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Connected Agents</h3>
          <button
            onClick={fetchAgents}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading agents...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400 mb-4">No agents connected</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Add Agent
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Agent</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Environment</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Internal IP</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">External IP</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Last Heartbeat</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id} className="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 text-white font-mono text-xs">{agent.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(agent.status)}`}>
                        {getStatusIcon(agent.status)}
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{agent.environment}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{agent.internal_ip}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{agent.external_ip}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(agent.last_heartbeat).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
