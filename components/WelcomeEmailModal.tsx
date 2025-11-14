import React from 'react';

interface User {
  username: string;
  email: string;
}

interface WelcomeEmailModalProps {
  user: User;
  onClose: () => void;
}

export const WelcomeEmailModal: React.FC<WelcomeEmailModalProps> = ({ user, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Sua caixa de entrada (simulada)</h2>
          <button onClick={onClose} aria-label="Fechar modal" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </header>

        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-xl">
                      G
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">Guia de Estudos ENEM</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">para {user.username}</p>
                  </div>
              </div>
               <span className="text-xs text-slate-500 dark:text-slate-400">agora mesmo</span>
            </div>

            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Bem-vindo(a) ao seu Guia de Estudos Inteligente!
            </h4>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>Olá {user.username},</p>
              <p>
                É um prazer ter você conosco! Sua jornada para a aprovação no ENEM acaba de ficar mais fácil e organizada.
                Aqui você encontrará ferramentas poderosas para:
              </p>
              <ul>
                <li>Receber dicas de estudo personalizadas.</li>
                <li>Criar um cronograma de estudos que se adapta à sua rotina.</li>
                <li>Simular sua nota com base na TRI.</li>
                <li>Tirar dúvidas rápidas sobre qualquer matéria.</li>
              </ul>
              <p>
                Explore a plataforma e comece a se preparar de forma mais inteligente hoje mesmo.
              </p>
              <p>Bons estudos!</p>
              <p>
                <strong>Equipe Guia de Estudos ENEM</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};