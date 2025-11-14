import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoginPage } from './components/LoginPage';
import { authService } from './services/authService';

interface User {
  username: string;
  email: string;
}

const Main = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        // Lógica de tema movida para cá para executar no início do aplicativo
        const theme = localStorage.getItem('theme');
        if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }

        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsLoading(false);
    }, []);

    const handleLogin = (user: User, source: 'login' | 'register') => {
        setCurrentUser(user);
        if (source === 'register') {
            setShowWelcomeModal(true);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900" />
        );
    }
    
    return currentUser ? (
        <App 
            user={currentUser} 
            onLogout={handleLogout}
            showWelcomeModal={showWelcomeModal}
            onCloseWelcomeModal={() => setShowWelcomeModal(false)}
        />
    ) : (
        <LoginPage onLoginSuccess={handleLogin} />
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);