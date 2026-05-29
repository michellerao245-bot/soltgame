import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, Trophy, ShieldCheck, Zap, History } from 'lucide-react';
import Confetti from 'react-confetti';

const CyberDice = ({ balance, setBalance }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [rollUnder, setRollUnder] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Logic: Calculate Win Probability & Multiplier
  const winProb = Math.max(1, Math.min(98, rollUnder - 1));
  const multiplier = (98 / winProb).toFixed(2);
  const potentialPayout = (betAmount * multiplier).toFixed(2);

  const playDice = useCallback(() => {
    setError('');
    if (betAmount <= 0) return setError("Enter a valid stake!");
    if (betAmount > balance) return setError("Insufficient balance!");

    setIsRolling(true);
    
    // Simulate API delay
    setTimeout(() => {
      const result = Math.floor(Math.random() * 100) + 1;
      const isWin = result < rollUnder;
      
      setLastResult(result);
      
      if (isWin) {
        setBalance(prev => prev + (betAmount * multiplier) - betAmount);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setBalance(prev => prev - betAmount);
      }

      setGameHistory(prev => [{ result, isWin, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
      setIsRolling(false);
    }, 1500);
  }, [betAmount, balance, rollUnder, multiplier, setBalance]);

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CONTROL PANEL */}
        <div className="lg:col-span-4 bg-[#0c0c0c] border border-white/10 p-8 rounded-[2rem] shadow-2xl">
          <h2 className="text-3xl font-black italic mb-8">CYBER<span className="text-yellow-500">DICE</span></h2>
          
          <div className="space-y-6">
            {error && <div className="bg-red-900/30 text-red-500 p-3 rounded-lg text-xs font-bold flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
            
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">Stake (SOLT)</label>
              <input type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className="w-full bg-black border border-white/10 p-4 rounded-xl text-2xl font-black" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Roll Under: {rollUnder}</span>
                <span className="text-yellow-500">Win Chance: {winProb}%</span>
              </div>
              <input type="range" min="2" max="98" value={rollUnder} onChange={(e) => setRollUnder(Number(e.target.value))} className="w-full accent-yellow-500 h-2 bg-gray-800 rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-[9px] text-gray-500 uppercase">Multiplier</p>
                <p className="text-xl font-black">{multiplier}x</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-[9px] text-gray-500 uppercase">Payout</p>
                <p className="text-xl font-black text-yellow-500">{potentialPayout}</p>
              </div>
            </div>

            <button onClick={playDice} disabled={isRolling} className="w-full py-5 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              {isRolling ? "ROLLING..." : "PLAY NOW"}
            </button>
          </div>
        </div>

        {/* VISUAL & HISTORY PANEL */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-[#0c0c0c] border border-white/10 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden">
             <motion.div animate={{ scale: isRolling ? 0.95 : 1 }} className="text-[200px] font-black opacity-10">
               {lastResult || "00"}
             </motion.div>
             <p className="absolute bottom-10 text-yellow-500 font-bold tracking-[0.5em] uppercase">Current Roll</p>
          </div>

          {/* HISTORY LOG */}
          <div className="bg-[#0c0c0c] border border-white/10 p-6 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-4 text-gray-500 uppercase text-xs font-bold">
              <History size={16}/> Recent Rolls
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {gameHistory.map((game, i) => (
                <div key={i} className={`min-w-[60px] p-3 rounded-lg text-center font-black ${game.isWin ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/30'}`}>
                  {game.result}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CyberDice;