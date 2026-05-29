import React, { useState } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';

export const WheelOfFortune = () => {
  const { isConnected } = useWallet();
  const { balance } = useAppBalance();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = async () => {
    setSpinning(true);
    try {
      const response = await gameService.placeBet({ 
        game: 'WheelOfFortune', 
        amount: 50 
      });
      // Simulate spinning by adding degrees
      const newRotation = rotation + 1440 + (Math.random() * 360);
      setRotation(newRotation);
      console.log("Win Result:", response);
    } catch (err) {
      console.error("Spin error:", err);
    } finally {
      setSpinning(false);
    }
  };

  if (!isConnected) return <div className="p-6 text-center">Connect wallet to spin the wheel!</div>;

  return (
    <div className="p-6 bg-indigo-950 rounded-2xl border border-pink-500 shadow-2xl">
      <h2 className="text-2xl font-bold text-pink-400 mb-4">Wheel Of Fortune</h2>
      <p className="text-gray-400 mb-6">Balance: {balance} ETH</p>
      
      {/* Visual Wheel */}
      <div 
        className="w-48 h-48 mx-auto mb-8 rounded-full border-8 border-pink-900 bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center transition-transform duration-[3000ms] ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="w-4 h-4 bg-white rounded-full"></div>
      </div>

      <button 
        onClick={handleSpin}
        disabled={spinning}
        className="w-full bg-pink-600 py-3 rounded-lg font-bold hover:bg-pink-500 transition"
      >
        {spinning ? "Spinning..." : "Spin The Wheel"}
      </button>
    </div>
  );
};