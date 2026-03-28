import { useEffect, useState } from 'react'
import { Plus, Trash2, Copy, Download, RefreshCw, ListFilter as Filter } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Payload } from '../../types'

export function PayloadFactory() {
  const [payloads, setPayloads] = useState<Payload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'exe',
    delivery_method: 'http',
    payload_hash: '',
    description: '',
  })

  useEffect(() => {
    fetchPayloads()
  }, [])

  const fetchPayloads = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('payloads')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setPayloads(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payloads')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.payload_hash) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const { error: insertError } = await supabase.from('payloads').insert([
        {
          name: formData.name,
          type: formData.type,
          delivery_method: formData.delivery_method,
          payload_hash: `sha256_${Math.random().toString(36).substr(2, 9)}`,
          description: formData.description,
          status: 'active',
        },
      ])

      if (insertError) throw insertError

      setFormData({
        name: '',
        type: 'exe',
        delivery_method: 'http',
        payload_hash: '',
        description: '',
      })
      setShowForm(false)
      await fetchPayloads()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add payload')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exe':
        return 'bg-red-900/30 text-red-400'
      case 'dll':
        return 'bg-orange-900/30 text-orange-400'
      case 'ps1':
        return 'bg-blue-900/30 text-blue-400'
      case 'sh':
        return 'bg-green-900/30 text-green-400'
      default:
        return 'bg-slate-900/30 text-slate-400'
    }
  }

  const getDeliveryColor = (method: string) => {
    switch (method) {
      case 'http':
        return 'text-cyan-400'
      case 'email':
        return 'text-amber-400'
      case 'smb':
        return 'text-purple-400'
      case 'dns':
        return 'text-green-400'
      default:
        return 'text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Total Payloads</span>
          <div className="text-3xl font-bold text-white mt-2">{payloads.length}</div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Active</span>
          <div className="text-3xl font-bold text-green-400 mt-2">
            {payloads.filter(p => p.status === 'active').length}
          </div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Delivery Methods</span>
          <div className="text-3xl font-bold text-indigo-400 mt-2">
            {new Set(payloads.map(p => p.delivery_method)).size}
          </div>
        </div>
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <span className="text-slate-400 text-sm">Payload Types</span>
          <div className="text-3xl font-bold text-amber-400 mt-2">
            {new Set(payloads.map(p => p.type)).size}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Payload
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-850 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Create New Payload</h3>
          <form onSubmit={handleAddPayload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Payload Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Agent-v2-x64"
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
                  <option>exe</option>
                  <option>dll</option>
                  <option>ps1</option>
                  <option>sh</option>
                  <option>py</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Delivery Method</label>
                <select
                  value={formData.delivery_method}
                  onChange={(e) => setFormData({ ...formData, delivery_method: e.target.value })}
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>http</option>
                  <option>email</option>
                  <option>smb</option>
                  <option>dns</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Hash (SHA256)</label>
                <input
                  type="text"
                  value={formData.payload_hash}
                  onChange={(e) => setFormData({ ...formData, payload_hash: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Payload details and notes"
                rows={3}
                className="w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Create Payload
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
          <h3 className="text-sm font-semibold text-white">Payload Inventory</h3>
          <button onClick={fetchPayloads} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading payloads...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : payloads.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No payloads created yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Delivery</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Hash</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Created</th>
                  <th className="px-6 py-3 text-left text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payloads.map((payload) => (
                  <tr key={payload.id} className="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{payload.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getTypeColor(payload.type)}`}>
                        {payload.type.toUpperCase()}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-mono ${getDeliveryColor(payload.delivery_method)}`}>
                      {payload.delivery_method}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded text-xs bg-green-900/30 text-green-400">
                        {payload.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{payload.payload_hash.substring(0, 16)}...</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(payload.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" title="Copy hash">
                        <Copy className="w-4 h-4 text-slate-300" />
                      </button>
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4 text-slate-300" />
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
    </div>
  )
}
