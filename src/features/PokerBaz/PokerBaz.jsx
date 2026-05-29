import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const PokerBaz = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [cards, setCards] = useState(['🂡', '🂮', '🂭', '🂫', '🂪']); // Initial cards
  const [loading, setLoading] = useState(false);

  const handleDeal = async () => {
    setLoading(true);
    try {
      const response = await gameService.placeBet({ 
        game: 'PokerBaz', 
        action: 'DEAL' 
      });
      // Response mein naye cards aayenge
      setCards(response.cards || ['🂡', '🂮', '🂭', '🂫', '🂪']);
    } catch (err) {
      console.error("Deal failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <div className="p-6 text-center">Connect wallet to play PokerBaz!</div>;

  return (
    <div className="p-6 bg-slate-800 rounded-2xl border-2 border-yellow-600 shadow-xl">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">PokerBaz</h2>
      <p className="text-gray-300 mb-6">Balance: {balance} ETH</p>
      
      {/* Cards Display */}
      <div className="flex gap-2 justify-center mb-8">
        {cards.map((card, index) => (
          <div key={index} className="w-16 h-24 bg-white text-black flex items-center justify-center text-3xl rounded-lg shadow-md font-bold">
            {card}
          </div>
        ))}
      </div>

      <button 
        onClick={handleDeal}
        disabled={loading}
        className="w-full bg-yellow-600 py-3 rounded-lg font-bold hover:bg-yellow-500 transition shadow-md"
      >
        {loading ? "Dealing..." : "Deal Cards"}
      </button>
    </div>
  );
};