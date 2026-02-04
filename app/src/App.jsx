import { useState } from 'react'
import './App.css'

import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {

  const [currentView, setCurrentView] = useState('login');

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const navigateToLogin = () => {
    setCurrentView('login');
  };

  const navigateToRegister = () => {
    setCurrentView('register');
  };

  return (
    <div className="app-container">
      <header>
        <h1>JobPrep</h1>
      </header>

      <main>

        {currentView === 'login' && (
          <Login onLoginSuccess={navigateToDashboard} />
        )}

        {currentView === 'register' && (
          <Login onRegister={navigateToRegister} />
        )}

        {currentView === 'dashboard' && (
          <Dashboard onLogout={navigateToLogin} />
        )}
      </main>
    </div>
  )
}

export default App
