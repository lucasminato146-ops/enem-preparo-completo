import React, { useState, useCallback, useMemo } from 'react';
import { InfoCard } from './components/InfoCard';
import { StudyTipsGenerator } from './components/StudyTipsGenerator';
import { ScheduleGenerator } from './components/ScheduleGenerator';
import { ScoreSimulator } from './components/ScoreSimulator';
import { QuickQuestion } from './components/QuickQuestion';
import { WelcomeEmailModal } from './components/WelcomeEmailModal';
import { Sidebar } from './components/Sidebar';
import { generateStudyTips, generateStudySchedule, generateTriScoreSimulation, generateQuickAnswer } from './services/geminiService';
import { ENEM_SUBJECTS } from './constants';

interface User {
  username: string;
  email: string;
}

export interface YoutubeSuggestion {
  title: string;
  description: string;
  query: string;
}

export interface StudyTipWithVideo {
  tip: string;
  video: YoutubeSuggestion;
}

export interface QuickAnswerResponse {
    answerText: string;
    video?: YoutubeSuggestion;
}


interface AppProps {
  user: User;
  onLogout: () => void;
  showWelcomeModal: boolean;
  onCloseWelcomeModal: () => void;
}

type ActiveView = 'dashboard' | 'tips' | 'schedule' | 'score' | 'qa';

const Header: React.FC<{ user: User; onLogout: () => void; onMenuClick: () => void }> = ({ user, onLogout, onMenuClick }) => (
  <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-md sticky top-0 z-30">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              Guia de Estudos ENEM
            </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Bem-vindo(a), <span className="font-semibold">{user.username}</span>!
            </p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  </header>
);

const App: React.FC<AppProps> = ({ user, onLogout, showWelcomeModal, onCloseWelcomeModal }) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [studyTips, setStudyTips] = useState<StudyTipWithVideo[]>([]);
  const [schedule, setSchedule] = useState<string>('');
  const [scoreResult, setScoreResult] = useState<string>('');
  const [qaResult, setQAResult] = useState<QuickAnswerResponse | null>(null);

  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState<{[key: string]: string | null}>({});

  const handleGenerateTips = useCallback(async (subject: string) => {
    setIsLoading(prev => ({ ...prev, tips: true }));
    setError(prev => ({ ...prev, tips: null }));
    setStudyTips([]);
    
    try {
        const result = await generateStudyTips(subject);
        setStudyTips(result);
    } catch (err) {
        console.error(`Failed to generate content for tips tab:`, err);
        setError(prev => ({ ...prev, tips: 'Ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente.' }));
    } finally {
        setIsLoading(prev => ({ ...prev, tips: false }));
    }
  }, []);
  
  const handleGenerateSchedule = useCallback(async (routine: string) => {
    setIsLoading(prev => ({ ...prev, schedule: true }));
    setError(prev => ({ ...prev, schedule: null }));
    try {
        const result = await generateStudySchedule(routine);
        setSchedule(result);
    } catch (err) {
        setError(prev => ({...prev, schedule: 'Falha ao gerar cronograma.'}));
    } finally {
        setIsLoading(prev => ({...prev, schedule: false}));
    }
  }, []);

  const handleGenerateScore = useCallback(async (scores: { [key: string]: number }) => {
    setIsLoading(prev => ({ ...prev, score: true }));
    setError(prev => ({ ...prev, score: null }));
    try {
        const result = await generateTriScoreSimulation(scores);
        setScoreResult(result);
    } catch (err) {
        setError(prev => ({...prev, score: 'Falha ao simular nota.'}));
    } finally {
        setIsLoading(prev => ({...prev, score: false}));
    }
  }, []);

  const handleGenerateQA = useCallback(async (question: string) => {
    setIsLoading(prev => ({ ...prev, qa: true }));
    setError(prev => ({ ...prev, qa: null }));
    setQAResult(null);
    try {
        const result = await generateQuickAnswer(question);
        setQAResult(result);
    } catch (err) {
        setError(prev => ({...prev, qa: 'Falha ao buscar resposta.'}));
    } finally {
        setIsLoading(prev => ({...prev, qa: false}));
    }
  }, []);

  const viewContent = useMemo(() => {
    const pageTitleMap: Record<ActiveView, string> = {
        dashboard: 'Painel de Controle',
        tips: 'Gerador de Dicas de Estudo',
        schedule: 'Gerador de Cronograma',
        score: 'Simulador de Nota TRI',
        qa: 'Tira-Dúvidas Rápido'
    };

    const PageWrapper: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
        <>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-slate-800 dark:text-white">{title}</h2>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
                {children}
            </div>
        </>
    );

    switch(activeView) {
      case 'dashboard':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-slate-800 dark:text-white">{pageTitleMap.dashboard}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoCard title="O que é o ENEM?">
                    <p>O Exame Nacional do Ensino Médio (ENEM) é a maior prova do Brasil e serve como um passaporte para o futuro acadêmico. Ele avalia competências em diversas áreas do conhecimento e sua nota é a chave para ingressar na universidade.</p>
                </InfoCard>
                <InfoCard title="História e Importância">
                  <p>Criado em 1998 para avaliar o Ensino Médio, o ENEM evoluiu para se tornar a principal via de acesso ao ensino superior. Suas notas são essenciais para programas como:</p>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li><b>Sisu:</b> Vagas em universidades públicas.</li>
                    <li><b>ProUni:</b> Bolsas em instituições privadas.</li>
                    <li><b>FIES:</b> Financiamento da graduação.</li>
                  </ul>
                </InfoCard>
                <InfoCard title="Estrutura da Prova">
                  <p>Dividida em dois dias, a prova abrange quatro áreas de conhecimento mais a redação:</p>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li>Linguagens, Códigos e suas Tecnologias</li>
                    <li>Ciências Humanas e suas Tecnologias</li>
                    <li>Ciências da Natureza e suas Tecnologias</li>
                    <li>Matemática e suas Tecnologias</li>
                  </ul>
                </InfoCard>
                <InfoCard title="Principais Temas por Área">
                  <p>Focar nos temas mais recorrentes é uma estratégia inteligente. Veja alguns exemplos:</p>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li><b>Linguagens:</b> Interpretação de texto, figuras de linguagem, e variações linguísticas.</li>
                    <li><b>Humanas:</b> História do Brasil, globalização, e questões sociais.</li>
                    <li><b>Natureza:</b> Ecologia, genética, e termodinâmica.</li>
                    <li><b>Matemática:</b> Razão e proporção, funções, e geometria.</li>
                  </ul>
                </InfoCard>
            </div>
          </>
        );
      case 'tips':
        return (
          <PageWrapper title={pageTitleMap.tips}>
            <StudyTipsGenerator
              subjects={ENEM_SUBJECTS}
              onGenerate={handleGenerateTips}
              isLoading={!!isLoading.tips}
              result={studyTips}
              error={error.tips ?? null}
            />
          </PageWrapper>
        );
      case 'schedule':
        return (
          <PageWrapper title={pageTitleMap.schedule}>
            <ScheduleGenerator
              onGenerate={handleGenerateSchedule}
              isLoading={!!isLoading.schedule}
              result={schedule}
              error={error.schedule ?? null}
            />
          </PageWrapper>
        );
      case 'score':
        return (
          <PageWrapper title={pageTitleMap.score}>
            <ScoreSimulator
              onGenerate={handleGenerateScore}
              isLoading={!!isLoading.score}
              result={scoreResult}
              error={error.score ?? null}
            />
          </PageWrapper>
        );
      case 'qa':
        return (
          <PageWrapper title={pageTitleMap.qa}>
            <QuickQuestion
              onGenerate={handleGenerateQA}
              isLoading={!!isLoading.qa}
              result={qaResult}
              error={error.qa ?? null}
            />
          </PageWrapper>
        );
      default:
        return null;
    }
  }, [activeView, isLoading, error, studyTips, schedule, scoreResult, qaResult, handleGenerateTips, handleGenerateSchedule, handleGenerateScore, handleGenerateQA]);


  return (
    <>
      <div className="min-h-screen flex flex-col font-sans bg-slate-100 dark:bg-slate-900">
        <Header user={user} onLogout={onLogout} onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-1 max-w-7xl w-full mx-auto overflow-hidden">
            <Sidebar 
              activeView={activeView} 
              setActiveView={setActiveView} 
              isOpen={isSidebarOpen}
              setIsOpen={setSidebarOpen}
            />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {viewContent}
            </main>
        </div>
      </div>
      {showWelcomeModal && (
        <WelcomeEmailModal user={user} onClose={onCloseWelcomeModal} />
      )}
    </>
  );
};

export default App;