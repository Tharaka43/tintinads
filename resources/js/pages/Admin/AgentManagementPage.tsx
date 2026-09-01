import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

type AgentStatus = 'Active' | 'Blocked' | 'Pending Approval';

interface Agent {
    id: string;
    name: string;
    email: string;
    status: AgentStatus;
    totalAds?: number;
    totalCommission?: number;
    avatar?: string;
    isActive: boolean;
    advertisements_count?: number;
    ad_transactions_sum_commission?: number;
}

const StatusBadge: React.FC<{ status: AgentStatus }> = ({ status }) => {
    const classes = useMemo(() => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Blocked': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending Approval': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }, [status]);

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${classes}`}>
            {status}
        </span>
    );
};

const AgentManagementPage: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadAgents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/admin/api/agents');
            if (response.data.success) {
                setAgents(response.data.agents);
            }
        } catch (err) {
            console.error('Failed to load agents', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadAgents(); }, []);

    const toggleStatus = async (id: string, currentIsActive: boolean) => {
        try {
            const response = await axios.patch(`/admin/api/agents/${id}/toggle-status`, {
                is_active: !currentIsActive,
            });
            if (response.data.success) {
                loadAgents();
            }
        } catch (err) {
            alert('Failed to update agent status.');
        }
    };

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const matchesStatus = statusFilter === 'All Statuses' || agent.status === statusFilter;
            const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  agent.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [agents, statusFilter, searchTerm]);

    const stats = useMemo(() => {
        const total = agents.length;
        const active = agents.filter(a => a.status === 'Active').length;
        const pending = agents.filter(a => a.status === 'Pending Approval').length;
        const blocked = agents.filter(a => a.status === 'Blocked').length;
        return { total, active, pending, blocked };
    }, [agents]);

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Agent Management
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage platform agents, verify accounts, and monitor activity.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[80px]">
                        <div className="text-xs text-gray-500 font-medium">Total</div>
                        <div className="text-xl font-bold text-gray-900">{stats.total}</div>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-center min-w-[80px]">
                        <div className="text-xs text-green-600 font-medium">Active</div>
                        <div className="text-xl font-bold text-green-700">{stats.active}</div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-center min-w-[80px]">
                        <div className="text-xs text-amber-600 font-medium">Pending</div>
                        <div className="text-xl font-bold text-amber-700">{stats.pending}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between shrink-0">
                <div className="flex space-x-2 overflow-x-auto pb-1">
                    {['All Statuses', 'Active', 'Pending Approval', 'Blocked'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                                statusFilter === status
                                    ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search agents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        🔍
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                ) : filteredAgents.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-3">👥</div>
                        <h3 className="text-lg font-semibold text-gray-900">No agents found</h3>
                        <p className="text-gray-500 mt-1 text-sm">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredAgents.map(agent => (
                            <div key={agent.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                            {agent.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 leading-tight">{agent.name}</h3>
                                            <p className="text-xs text-gray-500">{agent.email}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={agent.status} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Total Ads</p>
                                        <p className="text-lg font-bold text-gray-800">{agent.advertisements_count || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Commission Earned</p>
                                        <p className="text-lg font-bold text-pink-600">Rs. {agent.ad_transactions_sum_commission?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xs font-medium text-gray-500">Account Access</span>
                                    <button
                                        onClick={() => toggleStatus(agent.id, agent.isActive)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                            agent.isActive ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                agent.isActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentManagementPage;
