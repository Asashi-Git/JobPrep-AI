// src/store/useNavStore.js
import { create } from 'zustand';

// Comme expliqué dans l'article, "set" permet de fusionner l'état
export const useNavStore = create((set) => ({
  // 1. L'État initial (La page active par défaut)
  currentView: 'login',

  // 2. Les Actions (Fonctions pour changer l'état)
  goToLogin: () => set({ currentView: 'login' }),
  goToRegister: () => set({ currentView: 'register' }),
  goToDashboard: () => set({ currentView: 'dashboard' }),
}));
