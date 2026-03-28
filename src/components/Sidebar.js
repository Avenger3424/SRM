import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Shield, Gauge, Zap, Network, Server as ServerIcon, LogOut } from 'lucide-react';
export function Sidebar({ currentView, onViewChange }) {
    const navItems = [
        { id: 'mission-control', label: 'Mission Control', icon: Gauge },
        { id: 'payload-factory', label: 'Payload Factory', icon: Zap },
        { id: 'multi-stage', label: 'Multi-Stage Access', icon: Network },
        { id: 'infrastructure', label: 'Infrastructure', icon: ServerIcon },
    ];
    return (_jsxs("div", { className: "w-64 bg-charcoal border-r border-slate-800 h-screen flex flex-col", children: [_jsx("div", { className: "p-6 border-b border-slate-800", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Shield, { className: "w-8 h-8 text-indigo-500" }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-white", children: "RTOps" }), _jsx("p", { className: "text-xs text-slate-400", children: "Red Team Platform" })] })] }) }), _jsx("nav", { className: "flex-1 p-4 space-y-2", children: navItems.map(({ id, label, icon: Icon }) => (_jsxs("button", { onClick: () => onViewChange(id), className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentView === id
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-slate-300 hover:bg-slate-850 hover:text-white'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm font-medium", children: label })] }, id))) }), _jsx("div", { className: "p-4 border-t border-slate-800", children: _jsxs("button", { className: "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200", children: [_jsx(LogOut, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm font-medium", children: "Sign Out" })] }) })] }));
}
