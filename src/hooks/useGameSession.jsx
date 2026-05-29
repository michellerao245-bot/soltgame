import { useState } from 'react';
import { gameService } from '../services';

export const useGameSession = () => {
  const [loading, setLoading] = useState(false);

  const play = async (gameName, amount) => {
    setLoading(true);
    try {
      return await gameService.startGame(gameName, amount);
    } finally {
      setLoading(false);
    }
  };
  return { play, loading };
};