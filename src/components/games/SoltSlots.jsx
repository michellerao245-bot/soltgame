import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';

const BOUNTY_ITEMS = [
  { symbol: '💎', multiplier: 5 },
  { symbol: '🔥', multiplier: 4 },
  { symbol: '⚡', multiplier: 3 },
  { symbol: '🎰', multiplier: 2 },
  { symbol: '🪙', multiplier: 1.5 },
];

const symbols = ['💎', '🔥', '⚡', '🎰', '🪙'];

const getRandomBanditSymbol = () => {
  return symbols[Math.floor(Math.random() * symbols.length)];
};

const createBanditAudio = (
  audioCtxRef,
  type,
  startFreq,
  endFreq,
  duration,
  volume
) => {

  try {

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();
    }

    const ctx = audioCtxRef.current;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
      startFreq,
      ctx.currentTime
    );

    oscillator.frequency.linearRampToValueAtTime(
      endFreq,
      ctx.currentTime + duration
    );

    gainNode.gain.setValueAtTime(
      volume,
      ctx.currentTime
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

  } catch (err) {
    console.log(err);
  }
};

const SoltSlots = () => {

  const [betAmount, setBetAmount] = useState(2);

  const [reels, setReels] = useState([
    '💎',
    '🎰',
    '🔥',
  ]);

  const [isSpinning, setIsSpinning] = useState(false);

  const [spinResult, setSpinResult] = useState(null);

  const [winAmount, setWinAmount] = useState(0);

  const [slotHistory, setSlotHistory] = useState([]);

  const audioCtxRef = useRef(null);

  const spinReels = async () => {

    if (isSpinning) return;

    const numericBet = parseFloat(betAmount) || 0;

    if (numericBet <= 0) return;

    setIsSpinning(true);

    setSpinResult(null);

    setWinAmount(0);

    let spinCount = 0;

    const interval = setInterval(() => {

      createBanditAudio(
        audioCtxRef,
        'triangle',
        150,
        350,
        0.2,
        0.08
      );

      setReels([
        getRandomBanditSymbol(),
        getRandomBanditSymbol(),
        getRandomBanditSymbol(),
      ]);

      spinCount++;

      if (spinCount > 12) {

        clearInterval(interval);

        evaluateResult();
      }

    }, 100);
  };

  const evaluateResult = () => {

    const finalReels = [
      getRandomBanditSymbol(),
      getRandomBanditSymbol(),
      getRandomBanditSymbol(),
    ];

    setReels(finalReels);

    const [r1, r2, r3] = finalReels;

    let payoutMultiplier = 0;

    let status = 'LOSE';

    let calculatedWin = 0;

    if (r1 === r2 && r2 === r3) {

      const matched = BOUNTY_ITEMS.find(
        item => item.symbol === r1
      );

      payoutMultiplier = matched
        ? matched.multiplier
        : 1;

      status = 'WIN';

    } else if (
      r1 === r2 ||
      r2 === r3 ||
      r1 === r3
    ) {

      payoutMultiplier = 1.2;

      status = 'WIN';
    }

    if (status === 'WIN') {

      calculatedWin = parseFloat(
        (betAmount * payoutMultiplier).toFixed(2)
      );

      setWinAmount(calculatedWin);

      setSpinResult('WIN');

      createBanditAudio(
        audioCtxRef,
        'sine',
        440,
        660,
        0.4,
        0.15
      );

      try {

        canvasConfetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 },
        });

      } catch (e) {}

    } else {

      setSpinResult('LOSE');
    }

    setSlotHistory(prev => [
      {
        id: Date.now(),
        amount: betAmount,
        combination: finalReels,
        outcome: status,
        profit: calculatedWin,
      },
      ...prev,
    ].slice(0, 5));

    setIsSpinning(false);
  };

  return (

    <div className="relative max-w-6xl mx-auto p-4 select-none text-white font-sans">

      {/* Header */}
      <div className="text-center mb-8">

        <h1 className="text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-400 to-amber-600 uppercase">

          ONE ARMED BANDIT 🥷

        </h1>

        <p className="text-yellow-500/60 font-black text-xs uppercase tracking-[0.25em] mt-1">

          Spin the Cyber Reels • Maximize Your Yield

        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left */}
        <div className="bg-[#111] border border-white/5 rounded-3xl p-5 flex flex-col justify-between space-y-6">

          <div className="space-y-5">

            <div>

              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-2">

                Slot Bet Amount

              </label>

              <div className="relative flex items-center">

                <input
                  type="number"
                  value={betAmount}
                  disabled={isSpinning}
                  onChange={(e) =>
                    setBetAmount(
                      e.target.value === ''
                        ? ''
                        : Number(e.target.value)
                    )
                  }
                  className="w-full bg-[#050505] border border-white/10 p-3.5 pr-16 rounded-xl font-black outline-none focus:border-yellow-500 text-white disabled:opacity-50 text-xl"
                />

                <span className="absolute right-4 font-black text-sm text-yellow-500">

                  SOLT

                </span>

              </div>

            </div>

            {/* Multipliers */}
            <div className="bg-[#050505] p-4 rounded-xl border border-white/5 space-y-2.5 text-xs">

              <p className="text-gray-400 font-black uppercase tracking-wider mb-2 border-b border-white/5 pb-1">

                Multiplier Multi-Pay

              </p>

              {BOUNTY_ITEMS.map((item, idx) => (

                <div
                  key={idx}
                  className="flex justify-between items-center text-gray-300 font-bold"
                >

                  <span className="flex items-center gap-1.5">

                    <span>{item.symbol}</span>
                    3x Match

                  </span>

                  <span className="text-yellow-500 font-black">

                    x{item.multiplier}

                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Spin Button */}
          <button
            onClick={spinReels}
            disabled={isSpinning || betAmount <= 0}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl text-sm uppercase tracking-wider transition-all active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-600"
          >

            {isSpinning
              ? '🎰 SPINNING...'
              : '🕹️ PULL LEVER'}

          </button>

        </div>

        {/* Right */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-6">

          {/* Reels */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">

            <div className="flex gap-4 p-5 bg-[#050505] border border-white/5 rounded-2xl mb-6 z-10">

              {reels.map((symbol, idx) => (

                <motion.div
                  key={idx}
                  animate={
                    isSpinning
                      ? { y: [0, -20, 20, 0] }
                      : {}
                  }
                  transition={{
                    repeat: isSpinning ? Infinity : 0,
                    duration: 0.15,
                  }}
                  className="w-24 h-28 bg-[#151515] border border-white/5 rounded-xl flex items-center justify-center text-5xl shadow-inner select-none"
                >

                  {symbol}

                </motion.div>

              ))}

            </div>

            {/* Result */}
            <div className="h-10 text-center z-10">

              <AnimatePresence mode="wait">

                {spinResult === 'WIN' && (

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >

                    <h2 className="text-3xl font-black text-green-500 uppercase tracking-tight">

                      Big Win!

                    </h2>

                    <p className="text-xs font-bold text-green-400">

                      +{winAmount} SOLT Credited

                    </p>

                  </motion.div>

                )}

                {spinResult === 'LOSE' && (

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >

                    <h2 className="text-xl font-black text-red-500 uppercase tracking-wider">

                      Try Again!

                    </h2>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </div>

          {/* History */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-5">

            <div className="mb-3 flex justify-between items-center">

              <h3 className="font-black uppercase text-xs tracking-wider text-gray-400">

                Recent Bets (Max 5)

              </h3>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead>

                  <tr className="text-gray-500 border-b border-white/5 uppercase">

                    <th className="pb-2 font-black">
                      Bet
                    </th>

                    <th className="pb-2 font-black">
                      Reels Result
                    </th>

                    <th className="pb-2 font-black">
                      Outcome
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {slotHistory.map((h) => (

                    <tr
                      key={h.id}
                      className="border-b border-white/5"
                    >

                      <td className="py-2.5 font-bold text-gray-300">

                        {h.amount} SOLT

                      </td>

                      <td className="py-2.5 flex gap-1.5 text-base">

                        {h.combination.map((s, i) => (
                          <span key={i}>{s}</span>
                        ))}

                      </td>

                      <td
                        className={`py-2.5 font-black ${
                          h.outcome === 'WIN'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >

                        {h.outcome === 'WIN'
                          ? `+${h.profit} SOLT`
                          : 'LOST'}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SoltSlots;