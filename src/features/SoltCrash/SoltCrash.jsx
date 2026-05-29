import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const SoltCrash = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [crashed, setCrashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [betting, setBetting] = useState(false);

  const handleStart = async () => {
    setBetting(true);
    setCrashed(false);
    setMultiplier(1.0);
    
    try {
      const response = await gameService.placeBet({ 
        game: 'SoltCrash', 
        amount: 20 
      });
      setMultiplier(response.finalMultiplier || 2.5);
    } catch (err) {
      setCrashed(true);
      console.error("Crash error:", err);
    } finally {
      setBetting(false);
    }
  };

  if (!isConnected) return <div className="p-6 text-center">Connect wallet to play SoltCrash!</div>;

  return (
    <div className="p-6 bg-gray-950 rounded-xl border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
      <h2 className="text-2xl font-bold text-red-500 mb-2">Solt Crash</h2>
      <p className="text-gray-400 mb-6">Balance: {balance} ETH</p>
      
      <div className={`flex items-center justify-center h-40 mb-6 rounded-lg ${crashed ? 'bg-red-900' : 'bg-black'} border border-red-800`}>
        <span className={`text-6xl font-bold font-mono ${crashed ? 'text-white' : 'text-red-400'}`}>
          {crashed ? 'CRASHED!' : `${multiplier}x`}
        </span>
      </div>

      <button 
        onClick={handleStart}
        disabled={betting}
        className={`w-full py-3 rounded-lg font-bold transition ${
          betting ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-500'
        }`}
      >
        {betting ? "Playing..." : "Place Bet & Start"}
      </button>
    </div>
  );
};