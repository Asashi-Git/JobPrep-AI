// src/App.jsx
import { useState } from 'react'
import './App.css'

import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  // 1. L'ÉTAT (La mémoire de l'écran actuel)
  // 'currentView' stocke le nom de l'écran affiché : 'login' ou 'dashboard'
  const [currentView, setCurrentView] = useState('login');

  // 2. LES FONCTIONS DE NAVIGATION (La télécommande)
  const navigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const navigateToLogin = () => {
    setCurrentView('login');
  };

  // 3. LE RENDU (L'Affichage)
  return (
    <div className="app-container">
      <header>
        <h1>JobPrep</h1>
      </header>

      <main>
        {/* C'est ici que la magie du Rendu Conditionnel opère */}
        
        {currentView === 'login' && (
          <Login onLoginSuccess={navigateToDashboard} />
        )}

        {currentView === 'dashboard' && (
          <Dashboard onLogout={navigateToLogin} />
        )}
      </main>
    </div>
  )
}

export default App
