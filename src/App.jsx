import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
