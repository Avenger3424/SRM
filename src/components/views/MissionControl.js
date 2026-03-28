import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Activity, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle, Plus, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export function MissionControl() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchAgents();
        const interval = setInterval(fetchAgents, 5000);
        return () => clearInterval(interval);
    }, []);
    const fetchAgents = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('agents')
                .select('*')
                .order('created_at', { ascending: false });
            if (fetchError)
                throw fetchError;
            setAgents(data || []);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch agents');
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'bg-green-900/30 text-green-400 border-green-700/50';
            case 'offline':
                return 'bg-gray-900/30 text-gray-400 border-gray-700/50';
            case 'compromised':
                return 'bg-indigo-900/30 text-indigo-400 border-indigo-700/50';
            default:
                return 'bg-slate-900/30 text-slate-400 border-slate-700/50';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'online':
                return _jsx(CheckCircle, { className: "w-4 h-4" });
            case 'offline':
                return _jsx(XCircle, { className: "w-4 h-4" });
            case 'compromised':
                return _jsx(Activity, { className: "w-4 h-4" });
            default:
                return _jsx(AlertCircle, { className: "w-4 h-4" });
        }
    };
    const onlineCount = agents.filter(a => a.status === 'online').length;
    const chartData = [
        { time: '00:00', agents: 12 },
        { time: '04:00', agents: 15 },
        { time: '08:00', agents: 20 },
        { time: '12:00', agents: 18 },
        { time: '16:00', agents: 22 },
        { time: '20:00', agents: onlineCount },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Active Agents" }), _jsx(Activity, { className: "w-5 h-5 text-indigo-500" })] }), _jsx("div", { className: "text-3xl font-bold text-white", children: onlineCount }), _jsxs("p", { className: "text-xs text-slate-500 mt-2", children: ["of ", agents.length, " total"] })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Compromised" }), _jsx(AlertCircle, { className: "w-5 h-5 text-amber-500" })] }), _jsx("div", { className: "text-3xl font-bold text-white", children: agents.filter(a => a.status === 'compromised').length }), _jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Systems infiltrated" })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Heartbeat Status" }), _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" })] }), _jsx("div", { className: "text-3xl font-bold text-white", children: "98%" }), _jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Network reliability" })] })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-sm font-semibold text-white mb-4", children: "Agent Timeline" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#3a5a7f" }), _jsx(XAxis, { dataKey: "time", stroke: "#94a3b8" }), _jsx(YAxis, { stroke: "#94a3b8" }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1a1f2e', border: '1px solid #3a5a7f' }, labelStyle: { color: '#e0e0e0' } }), _jsx(Line, { type: "monotone", dataKey: "agents", stroke: "#6366F1", strokeWidth: 2, dot: { fill: '#6366F1' } })] }) })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-800 flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Connected Agents" }), _jsx("button", { onClick: fetchAgents, className: "p-2 hover:bg-slate-800 rounded-lg transition-colors", children: _jsx(RefreshCw, { className: "w-4 h-4 text-slate-300" }) })] }), loading ? (_jsx("div", { className: "p-8 text-center text-slate-400", children: "Loading agents..." })) : error ? (_jsx("div", { className: "p-8 text-center text-red-400", children: error })) : agents.length === 0 ? (_jsxs("div", { className: "p-8 text-center", children: [_jsx("p", { className: "text-slate-400 mb-4", children: "No agents connected" }), _jsxs("button", { className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Agent"] })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "border-b border-slate-800 bg-slate-900/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Agent" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Environment" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Internal IP" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "External IP" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Last Heartbeat" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Actions" })] }) }), _jsx("tbody", { children: agents.map((agent) => (_jsxs("tr", { className: "border-b border-slate-800 hover:bg-slate-900/30 transition-colors", children: [_jsx("td", { className: "px-6 py-4 text-white font-mono text-xs", children: agent.name }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(agent.status)}`, children: [getStatusIcon(agent.status), agent.status] }) }), _jsx("td", { className: "px-6 py-4 text-slate-300", children: agent.environment }), _jsx("td", { className: "px-6 py-4 text-slate-300 font-mono text-xs", children: agent.internal_ip }), _jsx("td", { className: "px-6 py-4 text-slate-300 font-mono text-xs", children: agent.external_ip }), _jsx("td", { className: "px-6 py-4 text-slate-400 text-xs", children: new Date(agent.last_heartbeat).toLocaleTimeString() }), _jsx("td", { className: "px-6 py-4", children: _jsx("button", { className: "p-2 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }, agent.id))) })] }) }))] })] }));
}
