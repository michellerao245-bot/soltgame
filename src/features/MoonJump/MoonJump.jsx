import React, { useState, useEffect } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const Moonjump = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [jumping, setJumping] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);

  const handleJump = async () => {
    setJumping(true);
    setMultiplier(1.0);
    
    try {
      // API call to start the jump sequence
      const response = await gameService.placeBet({ 
        game: 'Moonjump', 
        amount: 20 
      });
      // Assuming response contains the final multiplier
      setMultiplier(response.multiplier || 5.5);
    } catch (err) {
      console.error("Jump failed:", err);
    } finally {
      setJumping(false);
    }
  };

  if (!isConnected) return <div className="p-6 text-center">Connect wallet to Moonjump!</div>;

  return (
    <div className="p-6 bg-slate-950 rounded-xl border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <h2 className="text-2xl font-bold text-cyan-400 mb-2">Moonjump</h2>
      <p className="text-gray-400 mb-6">Balance: {balance} ETH</p>
      
      <div className="flex flex-col items-center justify-center h-40 mb-6 bg-black rounded-lg border border-cyan-900">
        <span className="text-5xl font-mono text-cyan-300">
          {jumping ? '...' : `${multiplier}x`}
        </span>
      </div>

      <button 
        onClick={handleJump}
        disabled={jumping}
        className="w-full bg-cyan-600 py-3 rounded-lg font-bold hover:bg-cyan-500 transition shadow-lg"
      >
        {jumping ? "Jumping to the Moon..." : "Start Jump"}
      </button>
    </div>
  );
};