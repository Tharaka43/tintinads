import React, { useCallback } from 'react';
import { router } from '@inertiajs/react';

// --- Global Constants ---



// --- Types ---
interface Agent {
    id: number;
    name: string;
    email: string;
    number: string | null;
    profile_picture: string | null;
}

interface AgentsPageProps {
    agents: Agent[];
    pagination: {
        currentPage: number;
        totalItems: number;
        perPage: number;
        totalPages: number;
    };
}

// --- Sub-Components ---

const AgentCard = ({ agent }: { agent: Agent }) => {
    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (agent.number) {
            // Format number for WhatsApp (remove any non-digit characters except +)
            const cleanNumber = agent.number.replace(/[^\d+]/g, '');
            // If number doesn't start with +, assume it's a local number and add country code if needed
            const whatsappNumber = cleanNumber.startsWith('+') ? cleanNumber : `+94${cleanNumber}`;
            window.open(`https://wa.me/${whatsappNumber}`, '_blank');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                {/* Profile Picture */}
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {agent.profile_picture ? (
                            <img 
                                src={agent.profile_picture} 
                                alt={agent.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        parent.innerHTML = `<i className="fas fa-user text-4xl text-gray-400"></i>`;
                                    }
                                }}
                            />
                        ) : (
                            <i className="fas fa-user text-4xl text-gray-400"></i>
                        )}
                    </div>
                </div>
                
                {/* Agent Info */}
                <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{agent.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{agent.email}</p>
                </div>
                
                {/* WhatsApp Contact Button */}
                {agent.number ? (
                    <button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                        <i className="fab fa-whatsapp text-xl"></i>
                        <span>Contact via WhatsApp</span>
                    </button>
                ) : (
                    <div className="w-full bg-gray-300 text-gray-600 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                        <i className="fas fa-phone text-xl"></i>
                        <span>No contact number</span>
                    </div>
                )}
                
                {/* Display Number */}
                {agent.number && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                        <i className="fas fa-phone mr-2"></i>
                        {agent.number}
                    </p>
                )}
            </div>
        </div>
    );
};

const Pagination = ({ totalItems, currentPage, paginate }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / 12); // perPage is 12
    const maxPageButtons = 5; 

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    if (totalPages <= 1) return null;

    return (
        <nav className="flex justify-center mt-12 space-x-2">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
                Prev
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === number
                            ? 'bg-pink-500 text-white shadow-md border-transparent'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 border'
                    }`}
                    
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
                Next
            </button>
        </nav>
    );
};

// --- Main Component ---

const AgentsPage: React.FC<AgentsPageProps> = ({ 
    agents = [], 
    pagination = {
        currentPage: 1,
        totalItems: 0,
        perPage: 12,
        totalPages: 1,
    }
}) => {
    const handlePaginate = useCallback((pageNumber: number) => {
        router.get('/agents', {
            page: pageNumber,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    return (
        <div className="bg-[#f8f9fc] font-sans min-h-screen flex flex-col">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <a href="/" className="flex items-center">
                            <img src="/assets/siteicon.png" alt="Logo" className="h-10 sm:h-12 mr-2" />
                            <img src="/assets/sitetxt.png" alt="Text" className="h-6 sm:h-8 hidden sm:block" />
                        </a>
                        
                        {/* Navigation */}
                        <nav className="flex items-center space-x-6">
                            <a href="/" className="text-gray-600 hover:text-pink-600 font-semibold transition-colors flex items-center gap-2">
                                <i className="fas fa-home hidden sm:inline-block"></i> Home
                            </a>
                            <a href="/agents" className="text-pink-600 font-bold border-b-2 border-pink-600 pb-1 flex items-center gap-2">
                                <i className="fas fa-user-tie hidden sm:inline-block"></i> Agents
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-sm mb-4 tracking-wide uppercase shadow-sm">
                        Our Professionals
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Agents</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg sm:text-xl">
                        Connect with our verified and highly-rated agents for personalized services and secure transactions.
                    </p>
                </div>
            </div>
            
            {/* Main Content Area */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Agents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-12">
                    {agents.length > 0 ? (
                        agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <i className="fas fa-search text-gray-300 text-6xl mb-4"></i>
                            <h3 className="text-xl font-bold text-gray-700">No agents found</h3>
                            <p className="text-gray-500 mt-2">Check back later for newly registered agents.</p>
                        </div>
                    )}
                </div>
                
                {/* Pagination */}
                <Pagination 
                    totalItems={pagination.totalItems} 
                    currentPage={pagination.currentPage} 
                    paginate={handlePaginate}
                />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} ClassifiedHub. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AgentsPage;

