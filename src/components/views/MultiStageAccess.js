import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
export function MultiStageAccess() {
    const [accessPaths, setAccessPaths] = useState([]);
    const [agents, setAgents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        source_agent_id: '',
        target_agent_id: '',
        access_type: 'lateral_movement',
        description: '',
    });
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const [agentsResponse, pathsResponse] = await Promise.all([
                supabase.from('agents').select('*'),
                supabase.from('access_paths').select('*').order('created_at', { ascending: false }),
            ]);
            if (agentsResponse.error)
                throw agentsResponse.error;
            if (pathsResponse.error)
                throw pathsResponse.error;
            setAgents(agentsResponse.data || []);
            setAccessPaths(pathsResponse.data || []);
        }
        catch (err) {
            console.error(err instanceof Error ? err.message : 'Failed to fetch data');
        }
    };
    const handleAddPath = async (e) => {
        e.preventDefault();
        if (!formData.source_agent_id || !formData.target_agent_id) {
            alert('Please select both source and target agents');
            return;
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
            ]);
            if (insertError)
                throw insertError;
            setFormData({
                source_agent_id: '',
                target_agent_id: '',
                access_type: 'lateral_movement',
                description: '',
            });
            setShowForm(false);
            await fetchData();
        }
        catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to add access path');
        }
    };
    const getAccessTypeColor = (type) => {
        switch (type) {
            case 'direct':
                return 'bg-green-900/30 text-green-400';
            case 'lateral_movement':
                return 'bg-blue-900/30 text-blue-400';
            case 'privilege_escalation':
                return 'bg-red-900/30 text-red-400';
            default:
                return 'bg-slate-900/30 text-slate-400';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'successful':
                return 'text-green-400';
            case 'failed':
                return 'text-red-400';
            case 'attempted':
                return 'text-amber-400';
            default:
                return 'text-slate-400';
        }
    };
    const getAgentName = (id) => {
        return agents.find(a => a.id === id)?.name || 'Unknown';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Total Paths" }), _jsx("div", { className: "text-3xl font-bold text-white mt-2", children: accessPaths.length })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Successful" }), _jsx("div", { className: "text-3xl font-bold text-green-400 mt-2", children: accessPaths.filter(p => p.status === 'successful').length })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Lateral Movements" }), _jsx("div", { className: "text-3xl font-bold text-blue-400 mt-2", children: accessPaths.filter(p => p.access_type === 'lateral_movement').length })] })] }), _jsx("div", { className: "flex gap-4", children: _jsxs("button", { onClick: () => setShowForm(!showForm), className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Access Path"] }) }), showForm && (_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "Create Access Path" }), _jsxs("form", { onSubmit: handleAddPath, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Source Agent" }), _jsxs("select", { value: formData.source_agent_id, onChange: (e) => setFormData({ ...formData, source_agent_id: e.target.value }), className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { value: "", children: "Select source..." }), agents.map((agent) => (_jsx("option", { value: agent.id, children: agent.name }, agent.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Target Agent" }), _jsxs("select", { value: formData.target_agent_id, onChange: (e) => setFormData({ ...formData, target_agent_id: e.target.value }), className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { value: "", children: "Select target..." }), agents.map((agent) => (_jsx("option", { value: agent.id, children: agent.name }, agent.id)))] })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Access Type" }), _jsxs("select", { value: formData.access_type, onChange: (e) => setFormData({ ...formData, access_type: e.target.value }), className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { value: "direct", children: "Direct Access" }), _jsx("option", { value: "lateral_movement", children: "Lateral Movement" }), _jsx("option", { value: "privilege_escalation", children: "Privilege Escalation" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Details about this access path", rows: 3, className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors", children: "Create Path" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), className: "px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 transition-colors", children: "Cancel" })] })] })] })), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-800 flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Access Flow Visualization" }), _jsx("button", { onClick: fetchData, className: "p-2 hover:bg-slate-800 rounded-lg transition-colors", children: _jsx(RefreshCw, { className: "w-4 h-4 text-slate-300" }) })] }), _jsx("div", { className: "p-6", children: accessPaths.length === 0 ? (_jsx("div", { className: "text-center py-12 text-slate-400", children: _jsx("p", { children: "No access paths defined. Create your first path to visualize the network." }) })) : (_jsx("div", { className: "space-y-4", children: accessPaths.map((path) => (_jsxs("div", { className: "flex items-center gap-4 p-4 bg-charcoal border border-slate-800 rounded-lg hover:border-indigo-500/30 transition-colors", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm text-slate-400", children: "Source" }), _jsx("div", { className: "font-mono text-white", children: getAgentName(path.source_agent_id) })] }), _jsx("div", { className: "text-indigo-500", children: "\u2192" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm text-slate-400", children: "Target" }), _jsx("div", { className: "font-mono text-white", children: getAgentName(path.target_agent_id) })] })] }), _jsxs("div", { className: "mt-3 flex items-center gap-4", children: [_jsx("span", { className: `inline-block px-3 py-1 rounded text-xs font-semibold ${getAccessTypeColor(path.access_type)}`, children: path.access_type.replace('_', ' ').toUpperCase() }), _jsx("span", { className: `text-xs font-semibold ${getStatusColor(path.status)}`, children: path.status.toUpperCase() }), path.description && _jsx("p", { className: "text-xs text-slate-400", children: path.description })] })] }), _jsx("button", { className: "p-2 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, path.id))) })) })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "Network Graph" }), _jsx("div", { className: "h-96 flex items-center justify-center border border-slate-800 rounded-lg bg-charcoal", children: _jsxs("div", { className: "text-center", children: [_jsx("svg", { className: "w-32 h-32 mx-auto text-slate-700 mb-4 opacity-50", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), _jsx("p", { className: "text-slate-400", children: "Network graph visualization" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Connect agents to visualize relationships" })] }) })] })] }));
}
