import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Plus, Trash2, Copy, Download, RefreshCw, ListFilter as Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
export function PayloadFactory() {
    const [payloads, setPayloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'exe',
        delivery_method: 'http',
        payload_hash: '',
        description: '',
    });
    useEffect(() => {
        fetchPayloads();
    }, []);
    const fetchPayloads = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('payloads')
                .select('*')
                .order('created_at', { ascending: false });
            if (fetchError)
                throw fetchError;
            setPayloads(data || []);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch payloads');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddPayload = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.payload_hash) {
            alert('Please fill in all required fields');
            return;
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
            ]);
            if (insertError)
                throw insertError;
            setFormData({
                name: '',
                type: 'exe',
                delivery_method: 'http',
                payload_hash: '',
                description: '',
            });
            setShowForm(false);
            await fetchPayloads();
        }
        catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to add payload');
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'exe':
                return 'bg-red-900/30 text-red-400';
            case 'dll':
                return 'bg-orange-900/30 text-orange-400';
            case 'ps1':
                return 'bg-blue-900/30 text-blue-400';
            case 'sh':
                return 'bg-green-900/30 text-green-400';
            default:
                return 'bg-slate-900/30 text-slate-400';
        }
    };
    const getDeliveryColor = (method) => {
        switch (method) {
            case 'http':
                return 'text-cyan-400';
            case 'email':
                return 'text-amber-400';
            case 'smb':
                return 'text-purple-400';
            case 'dns':
                return 'text-green-400';
            default:
                return 'text-slate-400';
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Total Payloads" }), _jsx("div", { className: "text-3xl font-bold text-white mt-2", children: payloads.length })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Active" }), _jsx("div", { className: "text-3xl font-bold text-green-400 mt-2", children: payloads.filter(p => p.status === 'active').length })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Delivery Methods" }), _jsx("div", { className: "text-3xl font-bold text-indigo-400 mt-2", children: new Set(payloads.map(p => p.delivery_method)).size })] }), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Payload Types" }), _jsx("div", { className: "text-3xl font-bold text-amber-400 mt-2", children: new Set(payloads.map(p => p.type)).size })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("button", { onClick: () => setShowForm(!showForm), className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Payload"] }), _jsxs("button", { className: "inline-flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 rounded-lg transition-colors", children: [_jsx(Filter, { className: "w-4 h-4" }), "Filter"] })] }), showForm && (_jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "Create New Payload" }), _jsxs("form", { onSubmit: handleAddPayload, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Payload Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g., Agent-v2-x64", className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Type" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "exe" }), _jsx("option", { children: "dll" }), _jsx("option", { children: "ps1" }), _jsx("option", { children: "sh" }), _jsx("option", { children: "py" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Delivery Method" }), _jsxs("select", { value: formData.delivery_method, onChange: (e) => setFormData({ ...formData, delivery_method: e.target.value }), className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "http" }), _jsx("option", { children: "email" }), _jsx("option", { children: "smb" }), _jsx("option", { children: "dns" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Hash (SHA256)" }), _jsx("input", { type: "text", value: formData.payload_hash, onChange: (e) => setFormData({ ...formData, payload_hash: e.target.value }), placeholder: "Auto-generated if empty", className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Payload details and notes", rows: 3, className: "w-full bg-charcoal border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors", children: "Create Payload" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), className: "px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 transition-colors", children: "Cancel" })] })] })] })), _jsxs("div", { className: "bg-slate-850 border border-slate-800 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-slate-800 flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Payload Inventory" }), _jsx("button", { onClick: fetchPayloads, className: "p-2 hover:bg-slate-800 rounded-lg transition-colors", children: _jsx(RefreshCw, { className: "w-4 h-4 text-slate-300" }) })] }), loading ? (_jsx("div", { className: "p-8 text-center text-slate-400", children: "Loading payloads..." })) : error ? (_jsx("div", { className: "p-8 text-center text-red-400", children: error })) : payloads.length === 0 ? (_jsx("div", { className: "p-8 text-center text-slate-400", children: "No payloads created yet" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "border-b border-slate-800 bg-slate-900/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Delivery" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Hash" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Created" }), _jsx("th", { className: "px-6 py-3 text-left text-slate-300 font-medium", children: "Actions" })] }) }), _jsx("tbody", { children: payloads.map((payload) => (_jsxs("tr", { className: "border-b border-slate-800 hover:bg-slate-900/30 transition-colors", children: [_jsx("td", { className: "px-6 py-4 text-white font-medium", children: payload.name }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded text-xs font-semibold ${getTypeColor(payload.type)}`, children: payload.type.toUpperCase() }) }), _jsx("td", { className: `px-6 py-4 text-sm font-mono ${getDeliveryColor(payload.delivery_method)}`, children: payload.delivery_method }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "inline-block px-3 py-1 rounded text-xs bg-green-900/30 text-green-400", children: payload.status }) }), _jsxs("td", { className: "px-6 py-4 text-slate-400 font-mono text-xs", children: [payload.payload_hash.substring(0, 16), "..."] }), _jsx("td", { className: "px-6 py-4 text-slate-400 text-xs", children: new Date(payload.created_at).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 flex gap-2", children: [_jsx("button", { className: "p-2 hover:bg-slate-800 rounded-lg transition-colors", title: "Copy hash", children: _jsx(Copy, { className: "w-4 h-4 text-slate-300" }) }), _jsx("button", { className: "p-2 hover:bg-slate-800 rounded-lg transition-colors", title: "Download", children: _jsx(Download, { className: "w-4 h-4 text-slate-300" }) }), _jsx("button", { className: "p-2 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, payload.id))) })] }) }))] })] }));
}
