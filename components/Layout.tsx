
import React from 'react';
import { APP_DISCLAIMER } from '../constants';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, profile, onUpdateProfile }) => {
  const toggleTheme = () => {
    onUpdateProfile({ ...profile, theme: profile.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${profile.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b sticky top-0 z-50 transition-colors duration-300 ${profile.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
              M
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              MedMorph
            </h1>
          </div>
          
          <nav className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${activePage === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('decoder')}
              className={`text-sm font-medium transition-colors ${activePage === 'decoder' ? 'text-blue-600' : 'text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400'}`}
            >
              Decoder
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 ${profile.theme === 'dark' ? 'bg-slate-800 text-orange-400' : 'bg-slate-100 text-slate-500'}`}
              title="Toggle Theme"
            >
              <i className={`fa-solid fa-lightbulb ${profile.theme === 'dark' ? '' : 'fa-regular'}`}></i>
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-full transition-colors ${activePage === 'settings' ? 'bg-blue-600 text-white' : profile.theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
            >
              <i className="fa-solid fa-gear"></i>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className={`border-t py-8 transition-colors duration-300 ${profile.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className={`border rounded-xl p-4 mb-6 ${profile.theme === 'dark' ? 'bg-orange-950/20 border-orange-900/30' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex gap-3">
              <i className="fa-solid fa-triangle-exclamation text-orange-500 mt-1"></i>
              <p className={`text-sm leading-relaxed italic ${profile.theme === 'dark' ? 'text-orange-200/70' : 'text-orange-800'}`}>
                {APP_DISCLAIMER}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <p>© 2024 MedMorph Educational Project</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
