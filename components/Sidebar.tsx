import React from 'react';

type ActiveView = 'dashboard' | 'tips' | 'schedule' | 'score' | 'qa';

interface SidebarProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
    { id: 'dashboard', label: 'Painel', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: 'tips', label: 'Dicas de Estudo', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> },
    { id: 'schedule', label: 'Cronograma', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: 'score', label: 'Simulador de Nota', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    { id: 'qa', label: 'Tira-Dúvidas', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
    
    const handleItemClick = (view: ActiveView) => {
        setActiveView(view);
        setIsOpen(false); // Fecha o menu no celular após a seleção
    };

    return (
        <>
            {/* Overlay para mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:shadow-none md:transform-none md:z-auto md:w-72 md:flex-shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 md:hidden">
                     <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Navegação</h2>
                </div>
                <nav className="mt-4 p-2">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleItemClick(item.id as ActiveView)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 my-1 rounded-md text-left font-semibold transition-colors duration-200 ${
                                        activeView === item.id 
                                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' 
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {item.icon}
                                    </svg>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                        {/* Link especial de venda */}
                        <li>
                            <a
                                href="https://kiwify.app/uit91xf?afid=asXB3ALs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 px-4 py-3 my-1 rounded-md text-left font-semibold transition-colors duration-200 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>Venda de Preparo</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};