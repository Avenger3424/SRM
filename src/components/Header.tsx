import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="bg-charcoal border-b border-slate-800 px-8 py-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-xs text-slate-400 mt-1">Enterprise Red Team Operations</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents, payloads..."
            className="bg-slate-850 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-500/10"
          />
        </div>

        <button className="p-2 hover:bg-slate-850 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  )
}
