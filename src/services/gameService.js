import api from './api';

// Game se related saare API calls yahan rahenge
export const gameService = {
  // Game session start karne ke liye
  startGame: async (gameName, wager) => {
    return await api.post('/games/start', { gameName, wager });
  },

  // Game ka result fetch karne ke liye
  getGameHistory: async (gameName) => {
    return await api.get(`/games/history/${gameName}`);
  },

  // Leaderboard fetch karne ke liye
  getLeaderboard: async (gameName) => {
    return await api.get(`/games/leaderboard/${gameName}`);
  },

  // Game specific bet place karne ke liye (Backend verification ke sath)
  placeBet: async (payload) => {
    return await api.post('/games/bet', payload);
  }
};