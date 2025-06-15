import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import WelcomePage from './components/landing/WelcomePage';

function AppContent() {
  const { hasEntered } = useAppContext();

  return hasEntered ? <Dashboard /> : <WelcomePage />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
