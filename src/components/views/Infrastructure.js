import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw, CreditCard as Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
export function Infrastructure() {
    const [infrastructure, setInfrastructure] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'redirector',
        ip_address: '',
        port: '',
        description: '',
    });
    useEffect(() => {
        fetchInfrastructure();
    }, []);
    const fetchInfrastructure = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('infrastructure')
                .select('*')
                .order('created_at', { ascending: false });
            if (fetchError)
                throw fetchError;
            setInfrastructure(data || []);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch infrastructure');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddInfra = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.ip_address) {
            alert('Please fill in all required fields');
            return;
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
            ]);
            if (insertError)
                throw insertError;
            setFormData({
                name: '',
                type: 'redirector',
                ip_address: '',
                port: '',
                description: '',
            });
            setShowForm(false);
            await fetchInfrastructure();
        }
        catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to add infrastructure');
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'redirector':
                return 'bg-cyan-900/30 text-cyan-400';
            case 'worker':
                return 'bg-purple-900/30 text-purple-400';
            case 'c2_server':
                return 'bg-red-900/30 text-red-400';
            default:
                return 'bg-slate-900/30 text-slate-400';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-green-400';
            case 'inactive':
                return 'text-gray-400';
            case 'compromised':
                return 'text-amber-400';
            default:
                return 'text-slate-400';
        }
    };
    const c2Servers = infrastructure.filter(i => i.type === 'c2_server');
    const redirectors = infrastructure.filter(i => i.type === 'redirector');
    const workers = infrastructure.filter(i => i.type === 'worker');
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Total Nodes" }), _jsx("div", { className: "text-3xl font-bold text-white mt-2", children: infrastructure.length })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "C2 Servers" }), _jsx("div", { className: "text-3xl font-bold text-red-400 mt-2", children: c2Servers.length })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Redirectors" }), _jsx("div", { className: "text-3xl font-bold text-cyan-400 mt-2", children: redirectors.length })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Worker Nodes" }), _jsx("div", { className: "text-3xl font-bold text-purple-400 mt-2", children: workers.length })] })] }), _jsx("div", { className: "flex gap-4", children: _jsxs("button", { onClick: () => setShowForm(!showForm), className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Infrastructure"] }) }), showForm && (_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "Add Infrastructure Node" }), _jsxs("form", { onSubmit: handleAddInfra, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Node Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g., C2-Primary-01", className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Type" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { value: "redirector", children: "Redirector" }), _jsx("option", { value: "worker", children: "Worker Node" }), _jsx("option", { value: "c2_server", children: "C2 Server" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "IP Address" }), _jsx("input", { type: "text", value: formData.ip_address, onChange: (e) => setFormData({ ...formData, ip_address: e.target.value }), placeholder: "192.168.1.1", className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Port (Optional)" }), _jsx("input", { type: "number", value: formData.port, onChange: (e) => setFormData({ ...formData, port: e.target.value }), placeholder: "8080", className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Infrastructure details and configuration", rows: 3, className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors", children: "Add Node" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), className: "px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 transition-colors", children: "Cancel" })] })] })] })), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-800 flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Infrastructure Nodes" }), _jsx("button", { onClick: fetchInfrastructure, className: "p-2 hover:bg-slate-800 rounded-lg transition-colors", children: _jsx(RefreshCw, { className: "w-4 h-4 text-slate-300" }) })] }), loading ? (_jsx("div", { className: "p-8 text-center text-slate-400", children: "Loading infrastructure..." })) : error ? (_jsx("div", { className: "p-8 text-center text-red-400", children: error })) : infrastructure.length === 0 ? (_jsx("div", { className: "p-8 text-center text-slate-400", children: "No infrastructure nodes configured" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "border-b border-slate-800 bg-slate-900/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "IP Address" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Port" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Created" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Actions" })] }) }), _jsx("tbody", { children: infrastructure.map((node) => (_jsxs("tr", { className: "border-b border-slate-800 hover:bg-slate-900/30 transition-colors", children: [_jsx("td", { className: "px-6 py-4 text-white font-medium", children: node.name }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded text-xs font-semibold ${getTypeColor(node.type)}`, children: node.type.replace('_', ' ').toUpperCase() }) }), _jsx("td", { className: "px-6 py-4 text-slate-300 font-mono", children: node.ip_address }), _jsx("td", { className: "px-6 py-4 text-slate-300 font-mono", children: node.port || '—' }), _jsx("td", { className: `px-6 py-4 font-semibold ${getStatusColor(node.status)}`, children: node.status.toUpperCase() }), _jsx("td", { className: "px-6 py-4 text-slate-400 text-xs", children: new Date(node.created_at).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 flex gap-2", children: [_jsx("button", { className: "p-2 hover:bg-slate-800 rounded-lg transition-colors", children: _jsx(Edit2, { className: "w-4 h-4 text-slate-300" }) }), _jsx("button", { className: "p-2 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, node.id))) })] }) }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "C2 Network Topology" }), _jsx("div", { className: "space-y-3", children: c2Servers.length === 0 ? (_jsx("p", { className: "text-slate-400 text-sm", children: "No C2 servers configured" })) : (c2Servers.map((server) => (_jsxs("div", { className: "p-3 bg-charcoal rounded border border-red-700/30", children: [_jsx("p", { className: "text-sm font-mono text-red-400", children: server.name }), _jsxs("p", { className: "text-xs text-slate-400 mt-1", children: [server.ip_address, ":", server.port] })] }, server.id)))) })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "Redirectors" }), _jsx("div", { className: "space-y-3", children: redirectors.length === 0 ? (_jsx("p", { className: "text-slate-400 text-sm", children: "No redirectors configured" })) : (redirectors.map((redirector) => (_jsxs("div", { className: "p-3 bg-charcoal rounded border border-cyan-700/30", children: [_jsx("p", { className: "text-sm font-mono text-cyan-400", children: redirector.name }), _jsxs("p", { className: "text-xs text-slate-400 mt-1", children: [redirector.ip_address, ":", redirector.port] })] }, redirector.id)))) })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "Worker Nodes" }), _jsx("div", { className: "space-y-3", children: workers.length === 0 ? (_jsx("p", { className: "text-slate-400 text-sm", children: "No worker nodes configured" })) : (workers.map((worker) => (_jsxs("div", { className: "p-3 bg-charcoal rounded border border-purple-700/30", children: [_jsx("p", { className: "text-sm font-mono text-purple-400", children: worker.name }), _jsxs("p", { className: "text-xs text-slate-400 mt-1", children: [worker.ip_address, ":", worker.port] })] }, worker.id)))) })] })] })] }));
}
