import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Marked } from 'marked';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { QuickAnswerResponse } from '../App';

interface QuickQuestionProps {
  onGenerate: (question: string) => void;
  isLoading: boolean;
  result: QuickAnswerResponse | null;
  error: string | null;
}

const marked = new Marked();
marked.use(gfmHeadingId());
marked.use(mangle());

const buildYoutubeSearchUrl = (query: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

export const QuickQuestion: React.FC<QuickQuestionProps> = ({
  onGenerate,
  isLoading,
  result,
  error,
}) => {
  const [question, setQuestion] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onGenerate(question);
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
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: Como funciona a pontuação da redação do ENEM?"
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows={3}
          disabled={isLoading}
        ></textarea>
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="mt-4 w-full bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-700 disabled:bg-cyan-300 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Pensando...' : 'Perguntar'}
        </button>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
      {result && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-fade-in">
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={createMarkup(result.answerText)}
          />
          {result.video && (
             <div className="mt-4 border-t border-slate-200 dark:border-slate-600 pt-4 flex items-start gap-4">
                <div className="flex-shrink-0 text-red-500 dark:text-red-400 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10,16.5V7.5L16,12M20,4.4C19.4,4.2 15.7,4 12,4C8.3,4 4.6,4.2 4,4.4C3.4,4.6 3,5.4 3,6V18C3,18.6 3.4,19.4 4,19.6C4.6,19.8 8.3,20 12,20C15.7,20 19.4,19.8 20,19.6C20.6,19.4 21,18.6 21,18V6C21,5.4 20.6,4.6 20,4.4Z" />
                    </svg>
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 dark:text-white">{result.video.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-3">{result.video.description}</p>
                    <a
                        href={buildYoutubeSearchUrl(result.video.query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Buscar no YouTube
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};