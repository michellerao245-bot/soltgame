import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const Dream11 = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState([]);

  const handleJoinContest = async () => {
    setLoading(true);
    try {
      // Logic for Dream11: Contest join karne ka payload
      const payload = { game: 'Dream11', team: team, entryFee: 50 };
      await gameService.placeBet(payload);
      alert("Contest Joined Successfully!");
    } catch (err) {
      console.error("Failed to join contest:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <div className="text-center p-10">Connect wallet to view Dream11 Contests</div>;

  return (
    <div className="p-6 bg-card-bg rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Dream11 Fantasy</h2>
      <p className="mb-4 text-gray-400">Balance: {balance} ETH</p>
      
      <div className="grid gap-4">
        {/* Yahan players ya contests list honge */}
        <div className="p-4 bg-gray-800 rounded">Available Contest: Mega League (Entry: 50 ETH)</div>
        
        <button 
          onClick={handleJoinContest}
          disabled={loading}
          className="w-full bg-primary-color py-3 rounded-lg font-bold hover:bg-opacity-90"
        >
          {loading ? "Joining..." : "Join Contest"}
        </button>
      </div>
    </div>
  );
};