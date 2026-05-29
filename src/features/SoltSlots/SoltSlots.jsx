import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const SoltSlots = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [slots, setSlots] = useState(['🎰', '🎰', '🎰']);
  const [spinning, setSpinning] = useState(false);

  const handleSpin = async () => {
    setSpinning(true);
    try {
      const response = await gameService.placeBet({ 
        game: 'SoltSlots', 
        amount: 10 
      });
      // Response mein slot symbols aayenge
      setSlots(response.symbols || ['🍒', '💎', '🍒']);
    } catch (err) {
      console.error("Spin failed:", err);
    } finally {
      setSpinning(false);
    }
  };

  if (!isConnected) return <div className="p-6 text-center">Connect wallet to spin the Slots!</div>;

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-yellow-500 shadow-xl">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Solt Slots</h2>
      <p className="text-gray-400 mb-6">Balance: {balance} ETH</p>
      
      {/* Slots Grid */}
      <div className="flex justify-center gap-4 mb-8">
        {slots.map((slot, index) => (
          <div key={index} className={`w-20 h-20 flex items-center justify-center text-4xl bg-black rounded-lg border-2 border-yellow-700 ${spinning ? 'animate-pulse' : ''}`}>
            {slot}
          </div>
        ))}
      </div>

      <button 
        onClick={handleSpin}
        disabled={spinning}
        className="w-full bg-yellow-600 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
      >
        {spinning ? "Spinning..." : "Spin Slots"}
      </button>
    </div>
  );
};