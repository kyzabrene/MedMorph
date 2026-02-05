
import React, { useState, useEffect } from 'react';
import { UserProfile, VisualBoard as VisualBoardType } from '../types';
import { getVisualBoardData } from '../services/intelligence';
import { greedySegment, findMorphemeMatch } from '../services/morphology';
import Penguin from '../components/Penguin';
import VisualBoard from '../components/VisualBoard';

interface DecoderProps {
  initialTerm?: string;
  profile: UserProfile;
}

const Decoder: React.FC<DecoderProps> = ({ initialTerm, profile }) => {
  const [term, setTerm] = useState(initialTerm || '');
  const [isLoading, setIsLoading] = useState(false);
  const [boardData, setBoardData] = useState<VisualBoardType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const normalizeInput = (input: string) => {
    // Basic normalization: lowercase, strip punctuation, handle some common plural endings
    let clean = input.trim().toLowerCase().replace(/[.,!?;:]/g, '');
    if (clean.endsWith('s') && clean.length > 4) {
      // Very basic plural strip for medical terms like 'atheroscleroses' -> 'atherosclerosis'
      if (clean.endsWith('ies')) clean = clean.replace(/ies$/, 'y');
      else if (clean.endsWith('es')) clean = clean.replace(/es$/, 'is');
    }
    return clean;
  };

  const handleDecode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!term.trim()) return;

    setIsLoading(true);
    setError(null);
    setBoardData(null);

    try {
      const normalized = normalizeInput(term);
      const segments = greedySegment(normalized);
      const matchedMorphemes = segments.map(seg => findMorphemeMatch(seg)).filter(Boolean);
      
      const data = await getVisualBoardData(term, profile, matchedMorphemes);
      setBoardData(data);
    } catch (err: any) {
      setError(err.message || 'Decoding failed. Our assistant is scratching its head!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTerm) {
      handleDecode();
    }
  }, [initialTerm]);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all duration-500">
        <form onSubmit={handleDecode} className="space-y-6">
          <div className="relative group">
            <input 
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter medical jargon (e.g. Myocardial)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl px-8 py-6 text-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all pr-32"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isLoading || !term.trim()}
              className="absolute right-4 top-4 bottom-4 px-8 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
            >
              Decode
            </button>
          </div>
          <div className="flex justify-center gap-6">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
              <i className="fa-solid fa-spell-check mr-2 text-orange-500"></i>
              Fuzzy spell-check enabled
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
              <i className="fa-solid fa-brain mr-2 text-blue-500"></i>
              Morpheme Analysis
            </p>
          </div>
        </form>
      </section>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <Penguin state="thinking" size="lg" />
          <h3 className="mt-8 text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Processing...</h3>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-3xl p-12 text-center">
          <i className="fa-solid fa-triangle-exclamation text-4xl text-orange-600 mb-4"></i>
          <h3 className="text-xl font-bold text-orange-900 dark:text-orange-200 mb-2">Engine Error</h3>
          <p className="text-orange-800/70 mb-8">{error}</p>
          <button onClick={handleDecode} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Retry</button>
        </div>
      )}

      {boardData && !isLoading && <VisualBoard data={boardData} />}
    </div>
  );
};

export default Decoder;
