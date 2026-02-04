// src/App.jsx
import './App.css'
import { useNavStore } from './store/useNavStore';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const currentView = useNavStore((state) => state.currentView);

  return (
    <div className="app-container">
      <header>
        <h1>Le Blog de Jahed</h1>
      </header>

      <main>
        {/* Rendu Conditionnel basé sur le Store Global */}
        
        {currentView === 'login' && <Login />}
        
        {currentView === 'register' && <Register />}
        
        {currentView === 'dashboard' && <Dashboard />}
      </main>
    </div>
  )
}

export default App;