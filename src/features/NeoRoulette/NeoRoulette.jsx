import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const NeoRoulette = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(null);

  const handleSpin = async () => {
    setSpinning(true);
    setLastWin(null);
    
    try {
      const response = await gameService.placeBet({ 
        game: 'NeoRoulette', 
        betOn: 'RED', // Example betting field
        amount: 10 
      });
      setLastWin(response.number || 17);
    } catch (err) {
      console.error("Spin error:", err);
    } finally {
      setSpinning(false);
    }
  };

  if (!isConnected) return <div className="p-6 text-center">Connect wallet to spin the NeoRoulette!</div>;

  return (
    <div className="p-6 bg-gray-900 rounded-2xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
      <h2 className="text-2xl font-bold text-emerald-400 mb-2">Neo Roulette</h2>
      <p className="text-gray-400 mb-6">Balance: {balance} ETH</p>
      
      <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center rounded-full border-4 border-emerald-900 bg-black">
        <span className={`text-4xl font-bold ${spinning ? 'animate-spin' : 'text-emerald-400'}`}>
          {lastWin ? lastWin : '00'}
        </span>
      </div>

      <button 
        onClick={handleSpin}
        disabled={spinning}
        className="w-full bg-emerald-600 py-3 rounded-lg font-bold hover:bg-emerald-500 transition shadow-md"
      >
        {spinning ? "Spinning..." : "Spin Wheel"}
      </button>
      
      {lastWin && (
        <div className="mt-4 text-center text-emerald-300 font-semibold animate-pulse">
          Landed on: {lastWin}
        </div>
      )}
    </div>
  );
};