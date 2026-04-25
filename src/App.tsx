import React from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { NewsApp } from './pages/NewsApp';
import { PinEntry } from './pages/PinEntry';
import { SafetyDashboard } from './pages/SafetyDashboard';

const AppContent: React.FC = () => {
  const { mode } = useAppContext();

  switch (mode) {
    case 'NEWS':
      return <NewsApp />;
    case 'PIN_ENTRY':
      return <PinEntry />;
    case 'SAFETY':
      return <SafetyDashboard />;
    default:
      return <NewsApp />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
