
import React, { useState, useEffect, useRef } from 'react';
import { VisualBoard as VisualBoardType, MorphemeType, Morpheme } from '../types';

interface VisualBoardProps {
  data: VisualBoardType;
}

const VisualBoard: React.FC<VisualBoardProps> = ({ data }) => {
  const [activeLevel, setActiveLevel] = useState<'elementary' | 'highschool' | 'professional'>('highschool');
  const [tiles, setTiles] = useState<Morpheme[]>(data.morphemeBreakdown);
  const [expandedTile, setExpandedTile] = useState<number | null>(null);
  const [playingSyllable, setPlayingSyllable] = useState<number | null>(null);
  const [lastSyllablePlayed, setLastSyllablePlayed] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.8);

  useEffect(() => {
    setTiles(data.morphemeBreakdown);
  }, [data]);

  const moveTile = (from: number, to: number) => {
    const newTiles = [...tiles];
    const [removed] = newTiles.splice(from, 1);
    newTiles.splice(to, 0, removed);
    setTiles(newTiles);
  };

  const playKaraoke = async () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    for (let i = 0; i < data.pronunciation.syllables.length; i++) {
      setPlayingSyllable(i);
      setLastSyllablePlayed(i);
      const syl = data.pronunciation.syllables[i].replace(/['ˈ]/g, '');
      const utterance = new SpeechSynthesisUtterance(syl);
      utterance.rate = playbackSpeed;
      
      const playNext = new Promise<void>((resolve) => {
        utterance.onend = () => resolve();
      });

      window.speechSynthesis.speak(utterance);
      await playNext;
    }
    setPlayingSyllable(null);
  };

  const playSingleSyllable = (idx: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPlayingSyllable(idx);
    setLastSyllablePlayed(idx);
    const syl = data.pronunciation.syllables[idx].replace(/['ˈ]/g, '');
    const utterance = new SpeechSynthesisUtterance(syl);
    utterance.rate = playbackSpeed;
    utterance.onend = () => setPlayingSyllable(null);
    window.speechSynthesis.speak(utterance);
  };

  const playFullWordNormal = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data.originalTerm);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const getDefinitionAtLevel = () => {
    return data.rephraseOptions[activeLevel];
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Main Display & Definition Toggles */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12 relative z-10">
          <div className="space-y-6 flex-1">
            <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
              {data.originalTerm}
            </h2>
            
            {/* Pronunciation Controls */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                  {data.pronunciation.syllables.map((syl, i) => (
                    <button
                      key={i}
                      onClick={() => playSingleSyllable(i)}
                      className={`px-4 py-2 rounded-xl text-sm font-black transition-all hover:scale-105 active:scale-95
                        ${i === data.pronunciation.stressedSyllableIndex ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'}
                        ${playingSyllable === i ? 'ring-4 ring-blue-400 ring-offset-2 dark:ring-offset-slate-900 animate-pulse' : ''}
                      `}
                    >
                      {syl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={playKaraoke}
                  className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg"
                  title="Syllable-by-syllable Playback"
                >
                  <i className="fa-solid fa-play"></i> Karaoke
                </button>
                <button 
                  onClick={playFullWordNormal}
                  className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                  title="Listen to full word at normal speed"
                >
                  <i className="fa-solid fa-volume-high"></i> Normal Full
                </button>
                <button 
                  onClick={() => setPlaybackSpeed(s => s === 0.8 ? 0.4 : 0.8)}
                  className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${playbackSpeed < 0.8 ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
                >
                  {playbackSpeed < 0.8 ? 'Slow' : 'Speed: Normal'}
                </button>
                {lastSyllablePlayed !== null && (
                  <button 
                    onClick={() => playSingleSyllable(lastSyllablePlayed)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Repeat Last Syllable
                  </button>
                )}
              </div>
            </div>

            {data.pronunciation.commonMistakes && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-3 rounded-r-xl">
                <p className="text-[10px] text-orange-800 dark:text-orange-300 font-bold uppercase tracking-tight">
                  <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                  Common Mistake: {data.pronunciation.commonMistakes}
                </p>
              </div>
            )}
          </div>

          {/* Level Switcher */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-[2rem] flex flex-col gap-2 min-w-[220px] shadow-inner border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-400 uppercase px-4 pt-2 tracking-widest">Meaning Level</span>
            {(['elementary', 'highschool', 'professional'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-6 py-3 rounded-2xl text-xs font-black capitalize transition-all text-left flex justify-between items-center ${activeLevel === lvl ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {lvl}
                {activeLevel === lvl && <i className="fa-solid fa-check-circle text-blue-500"></i>}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800 transition-all hover:shadow-xl">
          <div className="absolute top-4 right-6 flex gap-2">
             <i className="fa-solid fa-quote-right text-4xl text-blue-200 dark:text-blue-800 opacity-50"></i>
          </div>
          <p className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 leading-tight font-bold italic pr-8">
            "{getDefinitionAtLevel()}"
          </p>
        </div>
      </div>

      {/* 2. Interactive Morpheme Lab */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-8 h-[2px] bg-orange-500"></span>
            Morpheme Laboratory
          </h3>
          <p className="text-[10px] text-slate-400 italic">Drag/Reorder tiles to experiment</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((m, idx) => (
            <div 
              key={`${m.term}-${idx}`}
              className={`bg-white dark:bg-slate-900 border-2 rounded-[2rem] p-8 transition-all duration-500 group
                ${expandedTile === idx ? 'border-orange-400 ring-8 ring-orange-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-blue-400'}
              `}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border-2 ${
                  m.type === MorphemeType.PF ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' :
                  m.type === MorphemeType.RT ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                  'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                }`}>
                  {m.type === 'PF' ? 'Prefix' : m.type === 'RT' ? 'Root' : 'Suffix'}
                </span>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                   {idx > 0 && <button onClick={() => moveTile(idx, idx-1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><i className="fa-solid fa-chevron-left"></i></button>}
                   {idx < tiles.length - 1 && <button onClick={() => moveTile(idx, idx+1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><i className="fa-solid fa-chevron-right"></i></button>}
                </div>
              </div>

              <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">{m.term}</h4>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-snug mb-6">{m.shortDefinition}</p>
              
              <button 
                onClick={() => setExpandedTile(expandedTile === idx ? null : idx)}
                className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${expandedTile === idx ? 'bg-slate-900 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-orange-500 hover:text-white'}
                `}
              >
                {expandedTile === idx ? 'Close Details' : 'View Deep Trace'}
              </button>

              {expandedTile === idx && (
                <div className="mt-8 pt-8 border-t-2 border-slate-50 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Definition</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">{m.definition}</p>
                  </div>
                  {m.alternatives && (
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alternatives</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {m.alternatives.map((alt, i) => (
                          <span key={i} className="text-[10px] px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-bold border border-blue-100 dark:border-blue-800">{alt}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.misspellings && (
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Common Typo Alert</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {m.misspellings.map((miss, i) => (
                          <span key={i} className="text-[10px] font-bold text-red-700 dark:text-red-300 line-through opacity-60 italic">{miss}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                    <span className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">Position: {m.whereFound}</span>
                    <span className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">ID: {m.sourceInfo}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Branching Word Network */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-10 w-px h-full bg-slate-50 dark:bg-slate-800"></div>
          <h3 className="self-start text-xl font-black text-slate-900 dark:text-white mb-16 flex items-center gap-4 relative z-10">
            <i className="fa-solid fa-diagram-project text-blue-600 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-[1.5rem] shadow-sm"></i>
            Lexical Connectivity Web
          </h3>
          
          <div className="relative h-[450px] w-full flex items-center justify-center">
             {/* Center Word Node */}
             <div className="z-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[2.5rem] font-black text-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-none animate-bounce">
                {data.originalTerm}
             </div>
             
             {/* Dynamic SVG Connections */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {data.similarWords.map((_, i) => {
                  const angle = (i * 2 * Math.PI) / data.similarWords.length;
                  const x = 50 + 38 * Math.cos(angle);
                  const y = 50 + 38 * Math.sin(angle);
                  return (
                    <line key={i} x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6" className="dark:stroke-slate-700 animate-pulse" />
                  );
                })}
             </svg>
             
             {data.similarWords.map((sw, i) => {
                const angle = (i * 2 * Math.PI) / data.similarWords.length;
                const x = 50 + 38 * Math.cos(angle);
                const y = 50 + 38 * Math.sin(angle);
                return (
                  <div 
                    key={i} 
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className="bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-800 px-6 py-3 rounded-[1.5rem] shadow-lg hover:border-orange-500 hover:scale-110 transition-all cursor-pointer">
                      <span className="text-sm font-black text-slate-800 dark:text-slate-100 italic tracking-tighter">{sw.word}</span>
                    </div>
                    {/* Hover Card */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 bg-slate-900 text-white p-5 rounded-3xl w-56 shadow-2xl z-30">
                      <div className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest">Shared Roots</div>
                      <div className="flex flex-wrap gap-1">
                        {sw.morphemes.map(m => <span key={m} className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">{m}</span>)}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                         <span className="text-[8px] font-bold text-slate-500 uppercase">{sw.status} TERM</span>
                         <i className="fa-solid fa-magnifying-glass text-[10px] text-blue-500"></i>
                      </div>
                    </div>
                  </div>
                );
             })}
          </div>
        </div>

        {/* 4. Side Panels: Mnemonic, Confusables, Media */}
        <div className="space-y-8">
          {data.mnemonic && (
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-[3rem] p-10 shadow-2xl shadow-orange-200 dark:shadow-none relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <h4 className="text-[10px] font-black uppercase mb-6 tracking-[0.3em] flex items-center gap-2 opacity-80">
                <i className="fa-solid fa-brain"></i> Memory Hook
              </h4>
              <p className="text-2xl font-black leading-tight italic tracking-tighter">
                "{data.mnemonic}"
              </p>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
               <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
               Confusables Panel
             </h4>
             <div className="space-y-8">
                {data.confusables.map((c, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{c.term}</span>
                       <span className="text-[10px] text-slate-400 lowercase">vs. this root</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-blue-600 font-black mr-2">Diff:</span>
                      {c.difference}
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 5. Classroom Usage Templates */}
      <section className="bg-slate-900 text-white rounded-[4rem] p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Contextual Matrix</h3>
              <h2 className="text-4xl font-black italic tracking-tighter">Where you'll see this word</h2>
           </div>
           <p className="max-w-xs text-slate-400 text-sm font-medium leading-relaxed">
             Our intelligence engine maps linguistic structures to real-world clinical documentation styles.
           </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { label: 'Patient Dialogue', key: 'patientFriendly', icon: 'fa-hospital-user', color: 'text-orange-400' },
            { label: 'Medical Textbook', key: 'textbook', icon: 'fa-book-medical', color: 'text-blue-400' },
            { label: 'Clinical Chart', key: 'chartNote', icon: 'fa-file-waveform', color: 'text-emerald-400' }
          ].map(item => (
            <div key={item.key} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${item.icon} ${item.color}`}></i>
                </div>
                <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{item.label}</span>
              </div>
              <p className="text-lg leading-snug text-slate-200 font-bold italic">
                "{data.usage[item.key as keyof typeof data.usage]}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Export / Study Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
         <button 
          onClick={() => {
            const md = `# MedMorph Study Report: ${data.originalTerm}\n\n## Summary\n${getDefinitionAtLevel()}\n\n## Syllables\n${data.pronunciation.syllables.join('-')}\n\n## Breakdown\n${tiles.map(m => `- **${m.term}** (${m.type}): ${m.definition}`).join('\n')}\n\n## Usage\n- *Patient:* ${data.usage.patientFriendly}\n- *Textbook:* ${data.usage.textbook}\n- *Chart:* ${data.usage.chartNote}`;
            navigator.clipboard.writeText(md);
            alert('Study report copied! Ready for Notion/Google Docs.');
          }}
          className="bg-slate-900 text-white px-12 py-5 rounded-3xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95"
         >
           <i className="fa-solid fa-file-export"></i> Export Study Note (MD)
         </button>
         
         <button 
          onClick={() => {
            const csv = "Front,Back,Tags\n" + tiles.map(m => `"${m.term}","${m.definition} (${m.type})","medmorph,${data.originalTerm}"`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `MedMorph_${data.originalTerm}_Anki.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-12 py-5 rounded-3xl font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-4 active:scale-95"
         >
           <i className="fa-solid fa-layer-group"></i> Flashcards for Anki (CSV)
         </button>

         <button 
          onClick={() => window.print()}
          className="bg-orange-500 text-white px-8 py-5 rounded-3xl font-black text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-4 active:scale-95"
         >
           <i className="fa-solid fa-file-pdf"></i> Save PDF
         </button>
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-2 opacity-50 hover:opacity-100 transition-opacity">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Morphology Trace Engine v3.0</p>
         <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
            Logic: {data.splitReasoning}
         </p>
      </div>
    </div>
  );
};

export default VisualBoard;
