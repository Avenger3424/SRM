import { useEffect, useState } from 'react'
import { Plus, Trash2, RefreshCw, CreditCard as Edit2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Infrastructure } from '../../types'

export function Infrastructure() {
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'redirector',
    ip_address: '',
    port: '',
    description: '',
  })

  useEffect(() => {
    fetchInfrastructure()
  }, [])

  const fetchInfrastructure = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('infrastructure')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setInfrastructure(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch infrastructure')
    } finally {
      setLoading(false)
    }
  }

  const handleAddInfra = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.ip_address) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const { error: insertError } = await supabase.from('infrastructure').insert([
        {
          name: formData.name,
          type: formData.type,
          ip_address: formData.ip_address,
          port: formData.port ? parseInt(formData.port) : null,
          description: formData.description,
          status: 'active',
        },
      ])

      if (insertError) throw insertError

      setFormData({
        name: '',
        type: 'redirector',
        ip_address: '',
        port: '',
        description: '',
      })
      setShowForm(false)
      await fetchInfrastructure()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add infrastructure')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'redirector':
        return 'bg-cyan-900/30 text-cyan-400'
      case 'worker':
        return 'bg-purple-900/30 text-purple-400'
      case 'c2_server':
        return 'bg-red-900/30 text-red-400'
      default:
        return 'bg-slate-900/30 text-slate-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400'
      case 'inactive':
        return 'text-gray-400'
      case 'compromised':
        return 'text-amber-400'
      default:
        return 'text-slate-400'
    }
  }

  const c2Servers = infrastructure.filter(i => i.type === 'c2_server')
  const redirectors = infrastructure.filter(i => i.type === 'redirector')
  const workers = infrastructure.filter(i => i.type === 'worker')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Total Nodes</span>
          <div className="text-3xl font-bold text-white mt-2">{infrastructure.length}</div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">C2 Servers</span>
          <div className="text-3xl font-bold text-red-400 mt-2">{c2Servers.length}</div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Redirectors</span>
          <div className="text-3xl font-bold text-cyan-400 mt-2">{redirectors.length}</div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Worker Nodes</span>
          <div className="text-3xl font-bold text-purple-400 mt-2">{workers.length}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Infrastructure
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Add Infrastructure Node</h3>
          <form onSubmit={handleAddInfra} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Node Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., C2-Primary-01"
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="redirector">Redirector</option>
                  <option value="worker">Worker Node</option>
                  <option value="c2_server">C2 Server</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">IP Address</label>
                <input
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  placeholder="192.168.1.1"
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Port (Optional)</label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  placeholder="8080"
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Infrastructure details and configuration"
                rows={3}
                className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Add Node
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
          <h3 className="text-sm font-semibold text-white">Infrastructure Nodes</h3>
          <button onClick={fetchInfrastructure} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading infrastructure...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : infrastructure.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No infrastructure nodes configured</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">IP Address</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Port</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Created</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {infrastructure.map((node) => (
                  <tr key={node.id} className="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{node.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getTypeColor(node.type)}`}>
                        {node.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono">{node.ip_address}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono">{node.port || '—'}</td>
                    <td className={`px-6 py-4 font-semibold ${getStatusColor(node.status)}`}>
                      {node.status.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(node.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-slate-300" />
                      </button>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">C2 Network Topology</h3>
          <div className="space-y-3">
            {c2Servers.length === 0 ? (
              <p className="text-slate-400 text-sm">No C2 servers configured</p>
            ) : (
              c2Servers.map((server) => (
                <div key={server.id} className="p-3 bg-charcoal rounded border border-red-700/30">
                  <p className="text-sm font-mono text-red-400">{server.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{server.ip_address}:{server.port}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Redirectors</h3>
          <div className="space-y-3">
            {redirectors.length === 0 ? (
              <p className="text-slate-400 text-sm">No redirectors configured</p>
            ) : (
              redirectors.map((redirector) => (
                <div key={redirector.id} className="p-3 bg-charcoal rounded border border-cyan-700/30">
                  <p className="text-sm font-mono text-cyan-400">{redirector.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{redirector.ip_address}:{redirector.port}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Worker Nodes</h3>
          <div className="space-y-3">
            {workers.length === 0 ? (
              <p className="text-slate-400 text-sm">No worker nodes configured</p>
            ) : (
              workers.map((worker) => (
                <div key={worker.id} className="p-3 bg-charcoal rounded border border-purple-700/30">
                  <p className="text-sm font-mono text-purple-400">{worker.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{worker.ip_address}:{worker.port}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
