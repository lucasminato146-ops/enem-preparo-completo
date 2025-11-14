import React, { useState } from 'react';
import { authService } from '../services/authService';
import { LoadingSpinner } from './LoadingSpinner';

interface User {
  username: string;
  email: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: User, source: 'login' | 'register') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLoginView) {
        if (!formData.email || !formData.password) {
            throw new Error("Por favor, preencha o e-mail e a senha.");
        }
        const user = await authService.login(formData.email, formData.password);
        onLoginSuccess(user, 'login');
      } else {
        if (!formData.username || !formData.email || !formData.password) {
            throw new Error("Por favor, preencha todos os campos.");
        }
        const user = await authService.register(formData.username, formData.email, formData.password);
        onLoginSuccess(user, 'register');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              Guia de Estudos ENEM
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Sua plataforma inteligente para o sucesso.
            </p>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">
            {isLoginView ? 'Acessar Conta' : 'Criar Conta'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginView && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                E-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Senha
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all flex justify-center items-center"
              >
                {isLoading ? <LoadingSpinner size="sm" colorClass="border-white" className="my-0" /> : (isLoginView ? 'Entrar' : 'Registrar')}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError(null);
              }}
              className="text-sm text-blue-500 hover:underline"
            >
              {isLoginView
                ? 'Não tem uma conta? Crie uma agora!'
                : 'Já tem uma conta? Faça o login!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};