import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Marked } from 'marked';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';

interface ScoreSimulatorProps {
  onGenerate: (scores: { [key: string]: number }) => void;
  isLoading: boolean;
  result: string;
  error: string | null;
}

const marked = new Marked();
marked.use(gfmHeadingId());
marked.use(mangle());

const subjects = [
    { id: 'linguagens', label: 'Linguagens', max: 45 },
    { id: 'humanas', label: 'C. Humanas', max: 45 },
    { id: 'natureza', label: 'C. Natureza', max: 45 },
    { id: 'matematica', label: 'Matemática', max: 45 },
];

export const ScoreSimulator: React.FC<ScoreSimulatorProps> = ({
  onGenerate,
  isLoading,
  result,
  error,
}) => {
  const [scores, setScores] = useState({
    linguagens: 25,
    humanas: 25,
    natureza: 25,
    matematica: 25,
    redacao: 700,
  });

  const handleScoreChange = (subject: string, value: string) => {
    const numValue = parseInt(value, 10);
    const max = subject === 'redacao' ? 1000 : 45;
    if (!isNaN(numValue) && numValue >= 0 && numValue <= max) {
      setScores(prev => ({ ...prev, [subject]: numValue }));
    } else if (value === '') {
       setScores(prev => ({ ...prev, [subject]: 0 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(scores);
  };

  const createMarkup = (markdownText: string) => {
    const rawMarkup = marked.parse(markdownText) as string;
    return { __html: rawMarkup };
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map(subject => (
                <div key={subject.id}>
                    <label htmlFor={subject.id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{subject.label}</label>
                    <input
                        type="number"
                        id={subject.id}
                        value={scores[subject.id]}
                        onChange={e => handleScoreChange(subject.id, e.target.value)}
                        max={subject.max}
                        min="0"
                        className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
                    />
                </div>
            ))}
        </div>

        <div>
            <label htmlFor="redacao" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nota da Redação: <span className="font-bold text-blue-500">{scores.redacao}</span>
            </label>
            <input
                type="range"
                id="redacao"
                value={scores.redacao}
                onChange={e => handleScoreChange('redacao', e.target.value)}
                min="0"
                max="1000"
                step="10"
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Simulando...' : 'Simular Nota'}
        </button>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
      {result && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-fade-in">
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={createMarkup(result)}
          />
        </div>
      )}
    </section>
  );
};
