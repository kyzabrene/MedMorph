
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Decoder from './pages/Decoder';
import SelectionPopup from './components/SelectionPopup';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('home');
  const [initialTerm, setInitialTerm] = useState<string | undefined>();
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('medmorph-profile');
    return saved ? JSON.parse(saved) : {
      ageGroup: 'adult',
      occupation: 'high-school',
      readingLevel: 'simple',
      theme: 'light',
      dyslexiaFont: false,
      goal: 'curiosity',
      useAnalogies: true
    };
  });

  useEffect(() => {
    localStorage.setItem('medmorph-profile', JSON.stringify(profile));
    
    // Theme
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Accessibility
    document.body.setAttribute('data-dyslexia', profile.dyslexiaFont ? 'true' : 'false');
  }, [profile]);

  const handleStartDecoding = (exampleTerm?: string) => {
    setInitialTerm(exampleTerm);
    setActivePage('decoder');
  };

  const handleGlobalSearch = (text: string) => {
    setInitialTerm(text);
    setActivePage('decoder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onStart={handleStartDecoding} />;
      case 'settings':
        return <Settings profile={profile} onUpdate={setProfile} />;
      case 'decoder':
        return <Decoder initialTerm={initialTerm} profile={profile} />;
      default:
        return <Home onStart={handleStartDecoding} />;
    }
  };

  const navigateTo = (page: string) => {
    if (page !== 'decoder') setInitialTerm(undefined);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout activePage={activePage} onNavigate={navigateTo} profile={profile} onUpdateProfile={setProfile}>
      {renderPage()}
      <SelectionPopup onSearch={handleGlobalSearch} />
    </Layout>
  );
};

export default App;
