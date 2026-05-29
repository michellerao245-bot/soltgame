import React, { useEffect, useState } from 'react';
import { gameService } from '../services';

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await gameService.getLeaderboard('AllGames');
        setLeaders(data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Global Leaderboard</h1>
      
      {loading ? (
        <p>Loading rankings...</p>
      ) : (
        <table className="w-full text-left bg-card-bg rounded-lg overflow-hidden">
          <thead className="bg-primary-color">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Player</th>
              <th className="p-4">Score/Winnings</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((player, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{player.address.substring(0, 8)}...</td>
                <td className="p-4 text-accent-color">{player.score} ETH</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};