import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Marked } from 'marked';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';

interface ScheduleGeneratorProps {
  onGenerate: (routine: string) => void;
  isLoading: boolean;
  result: string;
  error: string | null;
}

const marked = new Marked();
marked.use(gfmHeadingId());
marked.use(mangle());

export const ScheduleGenerator: React.FC<ScheduleGeneratorProps> = ({
  onGenerate,
  isLoading,
  result,
  error,
}) => {
  const [routine, setRoutine] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (routine.trim()) {
      onGenerate(routine);
    }
  };

  const createMarkup = (markdownText: string) => {
    const rawMarkup = marked.parse(markdownText) as string;
    return { __html: rawMarkup };
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <textarea
          value={routine}
          onChange={(e) => setRoutine(e.target.value)}
          placeholder="Ex: Tenho aulas de manhã (8h-12h), trabalho à tarde (14h-18h) e gosto de treinar à noite. Finais de semana são mais livres."
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows={4}
          disabled={isLoading}
        ></textarea>
        <button
          type="submit"
          disabled={isLoading || !routine.trim()}
          className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Criando...' : 'Criar Cronograma'}
        </button>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
      {result && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg overflow-x-auto animate-fade-in">
          <div
            className="prose prose-slate dark:prose-invert max-w-none prose-table:w-full prose-td:px-2 prose-td:py-1 prose-th:px-2 prose-th:py-1"
            dangerouslySetInnerHTML={createMarkup(result)}
          />
        </div>
      )}
    </section>
  );
};
