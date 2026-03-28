import { Shield, Gauge, Zap, Network, Server as ServerIcon, LogOut } from 'lucide-react'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'mission-control', label: 'Mission Control', icon: Gauge },
    { id: 'payload-factory', label: 'Payload Factory', icon: Zap },
    { id: 'multi-stage', label: 'Multi-Stage Access', icon: Network },
    { id: 'infrastructure', label: 'Infrastructure', icon: ServerIcon },
  ]

  return (
    <div className="w-64 bg-charcoal border-r border-slate-800 h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-indigo-500" />
          <div>
            <h1 className="text-xl font-bold text-white">RTOps</h1>
            <p className="text-xs text-slate-400">Red Team Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === id
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
