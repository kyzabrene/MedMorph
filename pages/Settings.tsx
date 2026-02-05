
import React from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdate }) => {
  const occupations: UserProfile['occupation'][] = [
    'high-school', 'undergrad', 'grad', 'professional', 'retired', 'elderly'
  ];

  const goals: UserProfile['goal'][] = ['exam', 'patient-ed', 'curiosity', 'clinical'];
  const themes: UserProfile['theme'][] = ['light', 'dark'];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Preferences</h2>
        <p className="text-slate-500 dark:text-slate-400">Tailor the MedMorph engine to your unique learning path.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl space-y-10">
        
        {/* Learning Goal */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Primary Goal</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => onUpdate({ ...profile, goal: g })}
                className={`px-4 py-4 rounded-2xl border-2 text-xs font-black capitalize transition-all ${
                  profile.goal === g 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-400'
                }`}
              >
                {g.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Occupation */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Background</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {occupations.map((occ) => (
              <button
                key={occ}
                onClick={() => onUpdate({ ...profile, occupation: occ })}
                className={`px-4 py-3 rounded-2xl border-2 text-xs font-black capitalize transition-all ${
                  profile.occupation === occ 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-orange-400'
                }`}
              >
                {occ.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
           <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl">
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 dark:text-white text-sm">Dyslexia Friendly</h4>
                <p className="text-[10px] text-slate-500">Enable heavy-bottom fonts for clarity.</p>
              </div>
              <button 
                onClick={() => onUpdate({ ...profile, dyslexiaFont: !profile.dyslexiaFont })}
                className={`w-14 h-8 rounded-full transition-all relative ${profile.dyslexiaFont ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.dyslexiaFont ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           
           <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl">
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 dark:text-white text-sm">Everyday Analogies</h4>
                <p className="text-[10px] text-slate-500">Explain medical concepts like household items.</p>
              </div>
              <button 
                onClick={() => onUpdate({ ...profile, useAnalogies: !profile.useAnalogies })}
                className={`w-14 h-8 rounded-full transition-all relative ${profile.useAnalogies ? 'bg-orange-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.useAnalogies ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
        </div>

        {/* Theme */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Interface Mode</label>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => onUpdate({ ...profile, theme: t })}
                className={`flex-1 px-4 py-4 rounded-2xl border-2 text-xs font-black capitalize transition-all flex items-center justify-center gap-2 ${
                  profile.theme === t 
                    ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-xl' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                <i className={`fa-solid ${t === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-[2rem] p-8 shadow-2xl shadow-blue-200 dark:shadow-none flex items-center gap-6">
        <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center text-white text-3xl shrink-0">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <div>
          <h4 className="text-xl font-black italic tracking-tighter uppercase">Curriculum Ready</h4>
          <p className="text-sm text-blue-100/80 leading-snug">Your decoder settings are now active. Gemini will prioritize {profile.goal} language and {profile.occupation} assumptions.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
