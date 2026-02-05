
import React from 'react';
import Penguin from '../components/Penguin';

interface HomeProps {
  onStart: (example?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const examples = [
    "Atherosclerosis",
    "Gastroenteritis",
    "Cardiovascular",
    "Nephrectomy"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
          <Penguin state="idle" size="md" />
        </div>
        <h1 className="text-5xl font-extrabold text-black dark:text-white leading-tight">
          Speak the Language of Medicine <br/>
          <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Root by Root
          </span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          MedMorph helps you decode complex medical jargon into its Greek and Latin building blocks. Clear explanations for everyone.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => onStart()}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
          >
            Start Decoding
          </button>
        </div>
      </section>

      {/* Guide Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'fa-magnifying-glass', color: 'text-blue-600', title: 'Enter a Word', desc: 'Type any complex medical term you encountered.' },
          { icon: 'fa-scissors', color: 'text-orange-500', title: 'Break it Down', desc: 'Our engine segments the term into building blocks.' },
          { icon: 'fa-brain', color: 'text-blue-500', title: 'Learn Meaning', desc: 'Get a plain-language explanation tailored to you.' }
        ].map((step, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-4 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
            <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center ${step.color} mx-auto`}>
              <i className={`fa-solid ${step.icon} text-xl`}></i>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">{step.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </section>

      {/* Examples Section */}
      <section className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8">Try an example:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {examples.map((ex, idx) => (
              <button 
                key={idx}
                onClick={() => onStart(ex)}
                className="bg-white/10 border border-white/20 px-6 py-4 rounded-2xl hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all text-sm font-semibold"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </section>
    </div>
  );
};

export default Home;
