import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const GhostHunter = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [hunting, setHunting] = useState(false);
  const [log, setLog] = useState("Ready to hunt ghosts?");

  const handleHunt = async () => {
    setHunting(true);
    setLog("Searching for ghosts in the dark...");
    
    try {
      const response = await gameService.placeBet({ 
        game: 'GhostHunter', 
        action: 'START_HUNT' 
      });
      setLog(`Ghost caught! Reward: ${response.reward || '0.5 ETH'}`);
    } catch (err) {
      setLog("The ghost escaped! Try again.");
      console.error(err);
    } finally {
      setHunting(false);
    }
  };

  if (!isConnected) return <div className="p-6 text-center">Connect wallet to start the hunt!</div>;

  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-purple-600 shadow-lg">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Ghost Hunter</h2>
      <p className="mb-4 text-gray-300">Balance: {balance} ETH</p>
      
      <div className="my-6 p-4 bg-black rounded border border-purple-800 text-purple-300 italic">
        {log}
      </div>

      <button 
        onClick={handleHunt}
        disabled={hunting}
        className="w-full bg-purple-600 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
      >
        {hunting ? "Hunting..." : "Start Hunting"}
      </button>
    </div>
  );
};