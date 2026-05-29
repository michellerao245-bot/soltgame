import React, { useState, useEffect } from 'react';
import { useWallet, useAppBalance } from '../../hooks';
import { gameService } from '../../services';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, History, Zap, ShieldCheck } from 'lucide-react';

export const CyberDice = () => {
  const { isConnected, connect, connectors } = useWallet();
  const { balance } = useAppBalance();
  
  // Game States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [rollUnder, setRollUnder] = useState(50);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  // Math Logic (Calculates Multiplier & Payout in real-time)
  const winProb = Math.max(1, Math.min(98, rollUnder - 1));
  const multiplier = (98 / winProb).toFixed(2);
  const potentialPayout = (betAmount * multiplier).toFixed(2);

  const handleRoll = async () => {
    if (!isConnected) return setError("Connect Wallet First!");
    if (betAmount <= 0) return setError("Enter valid amount!");
    if (betAmount > balance) return setError("Insufficient Balance!");

    setLoading(true);
    setError('');
    
    try {
      const response = await gameService.placeBet({
        game: 'CyberDice',
        amount: betAmount,
        target: rollUnder
      });

      // Backend response handle karna
      const outcome = response.outcome; // Assume { roll: 45, win: true }
      setResult(outcome);
      setHistory(prev => [{...outcome, time: Date.now()}, ...prev].slice(0, 10));
    } catch (err) {
      setError("Transaction Failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#0c0c0c] border border-white/10 rounded-[2rem] text-white shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black italic">CYBER<span className="text-yellow-500">DICE</span></h2>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase">Your Balance</p>
          <p className="text-xl font-mono text-yellow-500">{balance} ETH</p>
        </div>
      </div>

      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })} className="w-full bg-yellow-500 py-6 rounded-2xl text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition">
          Connect Wallet to Play
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500">Stake Amount</label>
              <input type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className="w-full bg-black p-4 rounded-xl border border-white/10 text-2xl font-black" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Roll Under: {rollUnder}</span>
                <span className="text-yellow-500">{winProb}% Win Chance</span>
              </div>
              <input type="range" min="2" max="98" value={rollUnder} onChange={(e) => setRollUnder(Number(e.target.value))} className="w-full accent-yellow-500" />
            </div>

            <button onClick={handleRoll} disabled={loading} className="w-full py-5 bg-yellow-500 font-black text-black rounded-xl hover:bg-yellow-400 disabled:opacity-50">
              {loading ? 'ROLLING...' : 'ROLL DICE'}
            </button>
          </div>

          {/* Visuals */}
          <div className="bg-black/50 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={result?.roll} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-8xl font-black text-white/20">
                {result ? result.roll : "00"}
              </motion.div>
            </AnimatePresence>
            <p className={result?.win ? "text-green-500 font-black" : "text-white/50"}>
              {result ? (result.win ? `WON ${potentialPayout} ETH` : "LOST") : "WAITING"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};