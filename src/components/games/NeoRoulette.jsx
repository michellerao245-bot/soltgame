import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const NeonRoulette = ({ currentBalance = 0, onBalanceUpdate }) => {
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [status, setStatus] = useState('PLACE YOUR BET');
  const [history, setHistory] = useState(Array(10).fill(null));
  const [isSpinning, setIsSpinning] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const wheelRef = useRef(null);
  const audioCtxRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const spinTimeoutRef = useRef(null);

  // Audio engine
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const unlockAudio = useCallback(() => {
    const ctx = initAudio();
    if (ctx.state === 'suspended') ctx.resume();
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start(0);
    } catch (_) {}
  }, [initAudio]);

  const playTone = useCallback((freq, duration, type = 'sine', volume = 0.15) => {
    const ctx = initAudio();
    if (ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }, [initAudio]);

  const playSpinSound = useCallback(() => {
    const ctx = initAudio();
    if (ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (_) {}
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(80, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.6);
        gain2.gain.setValueAtTime(0.03, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.6);
      } catch (_) {}
    }, 100);
  }, [initAudio]);

  const playWinSound = useCallback(() => {
    const notes = [523, 659, 784, 1047, 784, 659, 523];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.18, 'sine', 0.12), i * 80);
    });
    setTimeout(() => playTone(1318, 0.3, 'sine', 0.10), notes.length * 80 + 60);
  }, [playTone]);

  const playLoseSound = useCallback(() => {
    const notes = [440, 349, 293, 220];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 'sawtooth', 0.06), i * 150);
    });
    setTimeout(() => playTone(110, 0.4, 'square', 0.04), notes.length * 150 + 100);
  }, [playTone]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.04, 'sine', 0.05);
  }, [playTone]);

  const fireConfettiBlast = useCallback(() => {
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#22d3ee', '#34d399', '#f97316'];
    const defaults = { origin: { y: 0.55 }, startVelocity: 35, spread: 70, ticks: 120, gravity: 0.8, colors };
    confetti({ ...defaults, particleCount: 200, spread: 90, startVelocity: 45 });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 80, spread: 60, startVelocity: 30, origin: { x: 0.1, y: 0.6 } });
      confetti({ ...defaults, particleCount: 80, spread: 60, startVelocity: 30, origin: { x: 0.9, y: 0.6 } });
    }, 120);
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 70, spread: 100, startVelocity: 50, origin: { y: 0.35 }, colors: ['#fbbf24', '#ffffff', '#fcd34d'] });
    }, 250);
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 50, spread: 70, startVelocity: 20, origin: { x: 0.3, y: 0.7 } });
      confetti({ ...defaults, particleCount: 50, spread: 70, startVelocity: 20, origin: { x: 0.7, y: 0.7 } });
    }, 400);
  }, []);

  const gameData = [
    { color: '#ef4444', val: 0 }, { color: '#f97316', val: 3 }, { color: '#f59e0b', val: 6 },
    { color: '#eab308', val: 9 }, { color: '#84cc16', val: 12 }, { color: '#22c55e', val: 15 },
    { color: '#10b981', val: 18 }, { color: '#06b6d4', val: 21 }, { color: '#3b82f6', val: 24 },
    { color: '#6366f1', val: 27 }, { color: '#8b5cf6', val: 30 }, { color: '#d946ef', val: 33 },
  ];

  const getPayout = (amt) => (amt === 10 ? 10 : amt === 20 ? 12 : 15);

  const spin = useCallback(() => {
    if (isSpinning || status !== 'PLACE YOUR BET') return;
    if (currentBalance < bet) {
      alert('💰 Balance kam hai!');
      return;
    }

    unlockAudio();
    playClickSound();
    playSpinSound();

    onBalanceUpdate(-bet);
    setIsSpinning(true);
    setStatus('SPINNING...');

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const randomAngle = extraSpins * 360 + Math.floor(Math.random() * 360);
    const wheel = wheelRef.current;
    if (wheel) {
      wheel.style.transition = 'transform 4.2s cubic-bezier(0.13, 0.65, 0.06, 0.99)';
      wheel.style.transform = `rotate(${randomAngle}deg)`;
    }

    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => {
      const finalAngle = randomAngle % 360;
      const normalized = (360 - finalAngle) % 360;
      const winningIndex = Math.floor(normalized / 30) % 12;
      const isWin = gameData[winningIndex].val === selectedNumber;

      setHistory(prev => [isWin ? 'W' : 'L', ...prev.slice(0, 9)]);

      if (isWin) {
        const winAmount = bet * getPayout(bet);
        setStatus('🎉 WIN 🎉');
        playWinSound();
        setShowFlash(true);
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = setTimeout(() => setShowFlash(false), 400);
        fireConfettiBlast();
        onBalanceUpdate(winAmount);
      } else {
        setStatus('💀 LOSE 💀');
        playLoseSound();
      }

      setIsSpinning(false);

      setTimeout(() => {
        setStatus('PLACE YOUR BET');
        if (wheel) {
          wheel.style.transition = 'none';
          wheel.style.transform = `rotate(${finalAngle}deg)`;
        }
      }, 1800);
    }, 4200);
  }, [isSpinning, status, currentBalance, bet, selectedNumber, onBalanceUpdate, unlockAudio, playClickSound, playSpinSound, playWinSound, playLoseSound, fireConfettiBlast, gameData]);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4" onClick={unlockAudio}>
      <div className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-100 ${showFlash ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'rgba(255, 215, 0, 0.15)' }} />

      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl animate-bounce">🎰</div>
        <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
          NEO ROULETTE
        </h1>
      </div>

      <div className="flex gap-4 w-full">
        <div className="flex-grow flex flex-col items-center p-8 rounded-3xl border-4 border-yellow-500 bg-zinc-950 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
          <div className="text-2xl font-black text-yellow-400 mb-4 drop-shadow-md">BALANCE: {currentBalance}</div>

          <div className="flex gap-2 mb-2">
            {[10, 20, 50].map((amt) => (
              <button
                key={amt}
                onClick={(e) => { e.stopPropagation(); setBet(amt); playClickSound(); }}
                className={`px-6 py-2 rounded-xl border-2 font-black transition-all ${
                  bet === amt
                    ? 'bg-yellow-500 text-black border-white shadow-[0_0_15px_#eab308] scale-105'
                    : 'bg-zinc-800 text-white border-zinc-600 hover:border-zinc-400'
                }`}
              >
                {amt} SOLT
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-400 mb-6 font-bold">
            Bet: {bet} SOLT | Potential Win: <span className="text-green-400">{bet * getPayout(bet)} SOLT</span>
          </div>

          <div className="grid grid-cols-6 gap-2 mb-8">
            {gameData.map((item, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedNumber(item.val); playClickSound(); }}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black transition-all ${
                  selectedNumber === item.val
                    ? 'border-white scale-110 shadow-[0_0_10px_white]'
                    : 'border-zinc-700 hover:border-zinc-400'
                }`}
                style={{ backgroundColor: item.color }}
              >
                {item.val}
              </button>
            ))}
          </div>

          <div className="relative w-56 h-56 mb-6">
            <div className="absolute -top-4 left-[106px] w-6 h-6 bg-yellow-400 z-50 rotate-45 border-2 border-black shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full border-8 border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative"
              style={{
                background: `conic-gradient(${gameData.map((d, i) =>
                  `${d.color} ${i*30}deg ${(i+1)*30 - 2}deg, #111 ${(i+1)*30 - 2}deg ${(i+1)*30}deg`
                ).join(', ')})`,
              }}
            >
              {gameData.map((d, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-start justify-center pt-4"
                  style={{ transform: `rotate(${i * 30 + 15}deg)` }}
                >
                  <span className="text-white font-black text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    {d.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); spin(); }}
            disabled={isSpinning || status !== 'PLACE YOUR BET'}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl font-black text-xl uppercase tracking-widest shadow-[0_0_20px_#ef4444] hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className={`
              ${status === '🎉 WIN 🎉' ? 'text-green-400 drop-shadow-[0_0_20px_#4ade80]' : ''}
              ${status === '💀 LOSE 💀' ? 'text-red-400 drop-shadow-[0_0_20px_#f87171]' : ''}
              ${status === 'SPINNING...' ? 'text-yellow-400 animate-pulse' : ''}
            `}>
              {status}
            </span>
          </button>
        </div>

        <div className="w-16 flex flex-col gap-2 p-2 rounded-2xl border-2 border-zinc-700 bg-zinc-900 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="text-[10px] text-zinc-500 text-center font-black uppercase">Recent</div>
          {history.map((res, i) => (
            <div
              key={i}
              className={`h-8 w-full rounded flex items-center justify-center font-black text-white text-sm ${
                res === 'W' ? 'bg-green-600 shadow-[0_0_10px_#22c55e]' :
                res === 'L' ? 'bg-red-600 shadow-[0_0_10px_#ef4444]' :
                'bg-zinc-800'
              }`}
            >
              {res || '-'}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-[10px] text-zinc-600/60 tracking-widest uppercase border-t border-zinc-800/30 pt-3">
        🎲 Vegas Style • Lucky Spin • 🍀 Good Luck
      </div>
    </div>
  );
};

export default NeonRoulette;