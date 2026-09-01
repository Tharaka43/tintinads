import React, { useState, useMemo } from 'react';

// --- Global Constants ---
const PINK_600 = '#DB2777';
const PINK_500 = '#EC4899';
const BLUE_500 = '#3B82F6';

// --- Types ---
type TransactionStatus = 'Pending Review' | 'Confirmed' | 'Rejected' | 'Paid Out';

interface Transaction {
    id: string;
    date: string;
    clientId: string;
    paidAmount: number;
    commissionRate: number; // as percentage (e.g., 0.15 for 15%)
    earnedAmount: number;
    status: TransactionStatus;
}

interface CommissionHistoryProps {
    transactions: Transaction[];
    totalCommissionEarned: number;
}

const STATUS_CLASSES: { [key in TransactionStatus]: { bg: string; text: string; icon: string } } = {
    'Pending Review': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'fas fa-clock' },
    'Confirmed': { bg: 'bg-green-100', text: 'text-green-800', icon: 'fas fa-check-circle' },
    'Rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: 'fas fa-times-circle' },
    'Paid Out': { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'fas fa-check-double' },
};

// --- Sub-Components ---

const TransactionStatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const { bg, text, icon } = STATUS_CLASSES[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            <i className={`${icon} mr-1`}></i>
            {status.replace('Commission ', '').replace(' Review', '')}
        </span>
    );
};

const MobileTransactionCard: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const earnedAmount = tx.earnedAmount || tx.paidAmount * tx.commissionRate;

    return (
        <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-sm font-medium text-gray-900">{tx.clientId}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <TransactionStatusBadge status={tx.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Amount Paid</p>
                                    <p className="font-medium text-gray-900">LKR {tx.paidAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Commission</p>
                                    <p className="font-medium text-gray-900">{(tx.commissionRate * 100).toFixed(0)}%</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500">Earned Amount</p>
                                    <p className="font-semibold text-lg" style={{ color: PINK_600 }}>LKR {earnedAmount.toFixed(2)}</p>
                                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const CommissionHistory: React.FC<CommissionHistoryProps> = ({ transactions = [], totalCommissionEarned = 0 }) => {
    const [filterStatus, setFilterStatus] = useState<string>('All Status');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ROWS_PER_PAGE = 6;

    // --- Memoized Filtering and Pagination ---
    const filteredTransactions = useMemo(() => {
        let list = transactions;

        // 1. Filter by Status
        if (filterStatus !== 'All Status') {
            list = list.filter(tx => tx.status === filterStatus);
        }

        // 2. Filter by Search (Date or Client ID)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            list = list.filter(tx => 
                tx.clientId.toLowerCase().includes(lowerCaseSearch) ||
                tx.date.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return list;
    }, [filterStatus, searchTerm]);

    const totalTransactions = filteredTransactions.length;
    const totalPages = Math.ceil(totalTransactions / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + ROWS_PER_PAGE);

    // Summary calculation
    const summary = useMemo(() => {
        const totalDue = filteredTransactions
            .filter(tx => tx.status === 'Pending Review')
            .reduce((sum, tx) => sum + (tx.earnedAmount || tx.paidAmount * tx.commissionRate), 0);
            
        return { totalDue: totalDue, totalEarned: totalCommissionEarned };
    }, [filteredTransactions, totalCommissionEarned]);

    // --- Handlers ---
    const handlePagination = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // Function to render pagination buttons (simplified for space)
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        
        const pageButtons = [];
        for (let i = 1; i <= totalPages; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => handlePagination(i)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${i === currentPage ? 'text-white bg-pink-600 border-transparent' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}`}
                    style={{ backgroundColor: i === currentPage ? PINK_600 : undefined }}
                >
                    {i}
                </button>
            );
        }
        return (
            <div className="flex items-center space-x-2">
                <button onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Previous</button>
                {pageButtons}
                <button onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
        );
    };


    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"><i className="fas fa-bars text-xl"></i></button>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Commission History</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm sm:text-base" style={{ backgroundColor: PINK_600 }}>
                                <i className="fas fa-download mr-2"></i>
                                <span className="hidden sm:inline">Export Report</span>
                                <span className="sm:hidden">Export</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">

                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Commission Earned</p>
                                <p className="text-2xl sm:text-3xl font-bold" style={{ color: PINK_600 }}>LKR {summary.totalEarned.toFixed(2)}</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">All-time earnings</p>
                            </div>
                            <div className="bg-pink-100 p-3 rounded-full">
                                <i className="fas fa-chart-line text-xl" style={{ color: PINK_600 }}></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                            <select 
                                value={filterStatus} 
                                onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                                style={{ ringColor: PINK_500 }}
                            >
                                <option>All Status</option>
                                <option>Pending Review</option>
                                <option>Confirmed</option>
                                <option>Rejected</option>
                            </select>
                            <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm" style={{ ringColor: PINK_500 }}/>
                            <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm" style={{ ringColor: PINK_500 }}/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text" 
                                placeholder="Search by Client ID..." 
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm w-full sm:w-auto"
                                style={{ ringColor: PINK_500 }}
                            />
                            <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Transaction History ({totalTransactions})</h2>
                    </div>
                    
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Ad ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission %</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earned Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedTransactions.map(tx => {
                                    const earnedAmount = tx.earnedAmount || tx.paidAmount * tx.commissionRate;
                                    return (
                                        <tr key={tx.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.clientId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">LKR {tx.paidAmount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(tx.commissionRate * 100).toFixed(0)}%</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: PINK_600 }}>LKR {earnedAmount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><TransactionStatusBadge status={tx.status as TransactionStatus} /></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {totalTransactions === 0 && <div className="p-6 text-center text-gray-600">No transactions found.</div>}
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-gray-200">
                        {paginatedTransactions.map(tx => <MobileTransactionCard key={tx.id} tx={tx} />)}
                        {totalTransactions === 0 && <div className="p-6 text-center text-gray-600">No transactions found.</div>}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-3 sm:space-y-0">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{Math.min(startIndex + 1, totalTransactions)}</span> to <span className="font-medium">{Math.min(startIndex + ROWS_PER_PAGE, totalTransactions)}</span> of <span className="font-medium">{totalTransactions}</span> transactions
                    </div>
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
};

export default CommissionHistory;
