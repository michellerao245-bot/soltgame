import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const EmpireBattle = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [loading, setLoading] = useState(false);
  const [battleStatus, setBattleStatus] = useState('Idle');

  const initiateBattle = async () => {
    setLoading(true);
    setBattleStatus('Finding Opponent...');
    
    try {
      // Backend se battle request
      const response = await gameService.placeBet({ 
        game: 'EmpireBattle', 
        action: 'JOIN_BATTLE' 
      });
      setBattleStatus('In Battle! Result: ' + response.status);
    } catch (err) {
      setBattleStatus('Error starting battle');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <div className="text-center p-6">Connect your wallet to enter the Empire Battle!</div>;

  return (
    <div className="p-6 bg-card-bg rounded-xl border border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-accent-color mb-4">Empire Battle</h2>
      <p className="mb-4">Current Balance: {balance} ETH</p>
      
      <div className="my-6 p-4 bg-gray-900 rounded border border-primary-color text-center">
        <p className="text-lg font-semibold">Status: {battleStatus}</p>
      </div>

      <button 
        onClick={initiateBattle}
        disabled={loading}
        className="w-full bg-red-600 py-3 rounded-lg font-bold hover:bg-red-700 transition"
      >
        {loading ? "Battling..." : "Enter Battle Arena"}
      </button>
    </div>
  );
};