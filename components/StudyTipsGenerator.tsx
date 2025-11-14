import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Marked } from 'marked';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { StudyTipWithVideo } from '../App';


interface StudyTipsGeneratorProps {
  subjects: string[];
  onGenerate: (subject: string) => void;
  isLoading: boolean;
  result: StudyTipWithVideo[];
  error: string | null;
}

const marked = new Marked();
marked.use(gfmHeadingId());
marked.use(mangle());

const buildYoutubeSearchUrl = (query: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

export const StudyTipsGenerator: React.FC<StudyTipsGeneratorProps> = ({
  subjects,
  onGenerate,
  isLoading,
  result,
  error,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(selectedSubject);
  };

  const createMarkup = (markdownText: string) => {
    const rawMarkup = marked.parse(markdownText) as string;
    return { __html: rawMarkup };
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={isLoading}
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Gerando...' : 'Gerar Dicas'}
        </button>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
      
      {result.length > 0 && (
        <div className="mt-8 space-y-6 animate-fade-in">
          {result.map((item, index) => (
            <div key={index} className="bg-slate-100 dark:bg-slate-700/50 p-4 sm:p-6 rounded-lg">
              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={createMarkup(item.tip)}
              />
              <div className="mt-4 border-t border-slate-200 dark:border-slate-600 pt-4 flex items-start gap-4">
                  <div className="flex-shrink-0 text-red-500 dark:text-red-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10,16.5V7.5L16,12M20,4.4C19.4,4.2 15.7,4 12,4C8.3,4 4.6,4.2 4,4.4C3.4,4.6 3,5.4 3,6V18C3,18.6 3.4,19.4 4,19.6C4.6,19.8 8.3,20 12,20C15.7,20 19.4,19.8 20,19.6C20.6,19.4 21,18.6 21,18V6C21,5.4 20.6,4.6 20,4.4Z" />
                      </svg>
                  </div>
                  <div className="flex-grow">
                      <h4 className="font-bold text-slate-800 dark:text-white">{item.video.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-3">{item.video.description}</p>
                      <a
                          href={buildYoutubeSearchUrl(item.video.query)}
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
