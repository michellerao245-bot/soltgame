import React, { useState, useEffect, useRef } from 'react'; 
import { Rocket } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import canvasConfetti from 'canvas-confetti';

export default function CrashGame({ currentBalance = 0, onBalanceUpdate }) { 
  const [multiplier, setMultiplier] = useState(1.00); 
  const [isLive, setIsLive] = useState(false); 
  const [hasCrashed, setHasCrashed] = useState(false); 
  const [betAmount, setBetAmount] = useState(10); 
  const [isCashedOut, setIsCashedOut] = useState(false); 
  const [profit, setProfit] = useState(0); 
  const [betHistory, setBetHistory] = useState([]); 
  const [targetNumber, setTargetNumber] = useState(50); 
  
  const rocketPosRef = useRef({ x: 0, y: 0 });
  const [crashCoordinates, setCrashCoordinates] = useState({ x: 0, y: 0 });

  // 🎵 PERMANENT AUDIO CONTEXT REFERENCE (Browser policy lock bypass)
  const audioCtxRef = useRef(null);

  // Audio initialize karne ka function (User click par trigger hoga)
  const initAudio = async () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    // Agar browser ne state suspend ki ho, to use force resume karo
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
  };

  const playCrashSound = async () => {
    try {
      await initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      
      noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      osc.start();
      noise.start();
      osc.stop(ctx.currentTime + 0.6);
      noise.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.log("Audio crash play failed:", e);
    }
  };

  const playTickSound = async (mult) => {
    try {
      // Tick sound optional hai, context ready ho tabhi bajega bina overload kiye
      if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
      const ctx = audioCtxRef.current;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      const pitch = Math.min(300 + (mult * 20), 800);
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch(e){}
  };

  const getGameNumber = (mult) => {
    const num = Math.round(1 + (mult - 1) / 0.091);
    return num > 100 ? 100 : num;
  };

  const targetMultiplier = parseFloat((1 + (targetNumber - 1) * 0.091).toFixed(2));
  const stateRef = useRef({ betAmount, isLive, isCashedOut, currentBalance, targetMultiplier, targetNumber });

  useEffect(() => {
    stateRef.current = { betAmount, isLive, isCashedOut, currentBalance, targetMultiplier, targetNumber };
  }, [betAmount, isLive, isCashedOut, currentBalance, targetMultiplier, targetNumber]);

  useEffect(() => { 
    let interval; 
    if (isLive && !hasCrashed) { 
      interval = setInterval(() => { 
        setMultiplier(prev => { 
          const next = parseFloat((prev + (prev < 3 ? 0.02 : 0.07)).toFixed(2)); 
          
          if (Math.round(next * 10) % 2 === 0) {
            playTickSound(next);
          }

          rocketPosRef.current = { 
            x: Math.min(prev * 16, 260), 
            y: Math.min(-prev * 9, -160) 
          };

          if (next >= stateRef.current.targetMultiplier && !stateRef.current.isCashedOut) {
            handleAutoCashOut(next);
            return next;
          }

          if (Math.random() < 0.018 && prev > 1.05) { 
            setHasCrashed(true); 
            setIsLive(false); 
            setCrashCoordinates({ ...rocketPosRef.current });
            
            // 💥 Boom sound triggers instantly
            playCrashSound();

            const currentBet = stateRef.current.betAmount;
            const currentTargetNum = stateRef.current.targetNumber;

            setBetHistory(prevH => [
              { id: Date.now(), amount: currentBet, target: currentTargetNum, crashAt: prev, status: 'CRASH' }, 
              ...prevH
            ].slice(0, 10)); 
            
            return prev; 
          } 
          return next; 
        }); 
      }, 70); 
    } 
    return () => clearInterval(interval); 
  }, [isLive, hasCrashed]); 
 
  const startGame = async () => {  
    // Start button click par audio register aur unlock ho jayega
    await initAudio();

    let numericBalance = parseFloat(stateRef.current.currentBalance) || 0;
    const numericBet = parseFloat(betAmount) || 0;
    if (numericBet <= 0) return;
    if (numericBalance < numericBet && onBalanceUpdate) onBalanceUpdate(1000);
    if (onBalanceUpdate) onBalanceUpdate(-numericBet);

    rocketPosRef.current = { x: 0, y: 0 }; 
    setCrashCoordinates({ x: 0, y: 0 }); 
    setMultiplier(1.00);  
    setHasCrashed(false);  
    setIsLive(true);  
    setIsCashedOut(false);  
    setProfit(0); 
  }; 

  const handleAutoCashOut = (winningMultiplier) => {
    setIsCashedOut(true); 
    setIsLive(false); 
    const numericBet = parseFloat(stateRef.current.betAmount) || 0;
    const currentTargetNum = stateRef.current.targetNumber;
    const totalWin = parseFloat((numericBet * winningMultiplier).toFixed(2)); 
    setProfit(totalWin); 
    if (onBalanceUpdate) onBalanceUpdate(totalWin);

    setBetHistory(prevH => [
      { id: Date.now(), amount: numericBet, target: currentTargetNum, crashAt: winningMultiplier, status: 'WIN', profit: totalWin }, 
      ...prevH
    ].slice(0, 10)); 
    try { canvasConfetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } }); } catch(e) {}
  };
 
  const cashOut = () => { 
    if (isLive && !isCashedOut) { 
      handleAutoCashOut(multiplier);
    } 
  }; 

  const winProbability = (100 - targetNumber + 1).toFixed(0);
 
  return ( 
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-white select-none"> 
      
      {/* SIDEBAR VIEW */}
      <GameControlPanel 
        betAmount={betAmount} setBetAmount={setBetAmount}
        isLive={isLive} isCashedOut={isCashedOut}
        multiplier={multiplier} targetNumber={targetNumber}
        setTargetNumber={setTargetNumber} winProbability={winProbability}
        startGame={startGame} cashOut={cashOut}
      />

      {/* GRAPH RUNWAY RENDERING */}
      <GameRunwayDisplay 
        hasCrashed={hasCrashed} multiplier={multiplier}
        isCashedOut={isCashedOut} profit={profit}
        isLive={isLive} getGameNumber={getGameNumber}
        targetNumber={targetNumber} betHistory={betHistory}
        crashCoordinates={crashCoordinates}
      />

    </div> 
  ); 
}
// ==========================================
// 🟢 SUB-COMPONENT 1: CONTROL SIDEBAR PANEL
// ==========================================
function GameControlPanel({ 
  betAmount, setBetAmount, isLive, isCashedOut, 
  multiplier, targetNumber, setTargetNumber, winProbability, startGame, cashOut 
}) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-fit"> 
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Amount</label> 
          <div className="relative flex items-center">
            <input  
              type="number"  
              value={betAmount}  
              disabled={isLive && !isCashedOut}
              onChange={(e) => setBetAmount(e.target.value === '' ? '' : Number(e.target.value))}  
              className="w-full bg-[#050505] border border-white/10 p-4 pr-16 rounded-xl font-black outline-none focus:border-green-500 text-white disabled:opacity-50 text-xl"  
            /> 
            <span className="absolute right-4 font-black text-xs text-green-500">SOLT</span>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center"> 
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Potential Win</p> 
          <p className="text-2xl font-black text-green-500">
            {((parseFloat(betAmount) || 0) * multiplier).toFixed(2)}
          </p> 
        </div> 

        {/* NEON GREEN SLIDER DESIGN */}
        <div className="bg-[#050505] p-4 rounded-xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Target Number</span>
            <span className="text-sm font-black text-green-400 bg-green-500/10 px-3 py-0.5 rounded border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              {targetNumber}
            </span>
          </div>

          <div className="relative pt-1">
            <input 
              type="range" min="1" max="100" step="1"
              value={targetNumber} disabled={isLive && !isCashedOut}
              onChange={(e) => setTargetNumber(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500 disabled:opacity-40 transition-all"
            />
            
            <div className="flex justify-between text-[10px] font-black mt-1.5 tracking-wide px-0.5">
              <span className={`transition-all duration-300 ${targetNumber <= 50 ? 'text-green-400 drop-shadow-[0_0_4px_#22c55e]' : 'text-gray-600'}`}>1</span>
              <span className="transition-all duration-300 text-green-400 drop-shadow-[0_0_4px_#22c55e]">50</span>
              <span className={`transition-all duration-300 ${targetNumber > 50 ? 'text-green-400 drop-shadow-[0_0_4px_#22c55e]' : 'text-gray-600'}`}>100</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5">
            <span className="text-gray-500 font-bold uppercase tracking-wider">Win Probability</span>
            <span className="font-black text-green-500">{winProbability}% Chance</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {!isLive || isCashedOut ? ( 
          <button onClick={startGame} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl text-xs tracking-wider uppercase transition-all active:scale-95"> 
            Start Flight 
          </button> 
        ) : ( 
          <button onClick={cashOut} className="w-full bg-red-600 text-white font-black py-4 rounded-xl text-xs tracking-wider uppercase transition-all active:scale-95"> 
            Cash Out 
          </button> 
        )} 
      </div>
    </div>
  );
}

// ==========================================
// 🔵 SUB-COMPONENT 2: DISPLAY BOARD & LEDGER
// ==========================================
function GameRunwayDisplay({ 
  hasCrashed, multiplier, isCashedOut, profit, isLive, getGameNumber, targetNumber, betHistory, crashCoordinates 
}) {
  
  const heavyFragments = [
    { id: 1, tx: -90, ty: 120, r: -180, item: '⚙️', s: 1.2 },
    { id: 2, tx: 110, ty: 140, r: 360, item: '⚡', s: 1.0 },
    { id: 3, tx: -130, ty: 200, r: 90, item: '📐', s: 1.1 },
    { id: 4, tx: 140, ty: 180, r: -90, item: '⛓️', s: 0.9 },
    { id: 5, tx: -40, ty: 230, r: 240, item: '🔥', s: 1.3 },
    { id: 6, tx: 60, ty: 210, r: -45, item: '💥', s: 1.2 },
    { id: 7, tx: -160, ty: 150, r: 120, item: '⚙️', s: 0.8 },
    { id: 8, tx: 170, ty: 240, r: -310, item: '⚡', s: 1.0 },
    { id: 9, tx: -10, ty: 190, r: 150, item: '🟥', s: 0.6 },
    { id: 10, tx: 80, ty: 110, r: 85, item: '🔥', s: 1.1 },
    { id: 11, tx: -70, ty: 260, r: -140, item: '⛓️', s: 1.0 },
    { id: 12, tx: 120, ty: 270, r: 195, item: '📐', s: 0.9 },
    { id: 13, tx: -110, ty: 90, r: 60, item: '💥', s: 1.2 },
    { id: 14, tx: 40, ty: 160, r: -110, item: '⚙️', s: 0.7 },
    { id: 15, tx: -190, ty: 220, r: 300, item: '⚡', s: 0.9 },
    { id: 16, tx: 190, ty: 130, r: -210, item: '🔥', s: 1.4 },
    { id: 17, tx: -25, ty: 280, r: 130, item: '🟥', s: 0.5 },
    { id: 18, tx: 145, ty: 215, r: 45, item: '⛓️', s: 1.1 },
    { id: 19, tx: -145, ty: 175, r: -85, item: '⚙️', s: 1.0 },
    { id: 20, tx: 95, ty: 255, r: 165, item: '📐', s: 0.8 }
  ];

  return (
    <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-6"> 
      <div className="bg-[#111] border border-white/5 rounded-3xl p-10 relative min-h-[380px] flex items-center justify-center overflow-hidden flex-grow"> 
        
        <AnimatePresence mode="wait"> 
          {hasCrashed ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10"> 
              <h2 className="text-7xl font-black text-red-600 italic tracking-tighter drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">CRASHED!</h2> 
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs mt-1">At {multiplier.toFixed(2)}x</p> 
              <p className="text-red-500 font-black uppercase text-sm mt-3 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 inline-block">
                Crashed at Number: {getGameNumber(multiplier)}
              </p>
            </motion.div> 
          ) : ( 
            <div className="text-center z-10"> 
              <h2 className={`text-8xl font-black italic tracking-tight ${isCashedOut ? 'text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-white'}`}> 
                {multiplier.toFixed(2)}x 
              </h2> 
              {isCashedOut ? (
                <div className="space-y-2 mt-3">
                  <p className="text-green-500 font-black text-xl">+{profit} SOLT</p>
                  <p className="text-green-400 font-bold uppercase text-xs bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20 inline-block">
                    Win Number: {targetNumber}
                  </p>
                </div>
              ) : isLive ? (
                <p className="text-gray-400 font-black text-lg mt-2 tracking-widest animate-pulse">
                  Current Number: {getGameNumber(multiplier)}
                </p>
              ) : (
                <p className="text-gray-600 font-bold uppercase text-xs mt-2 tracking-widest">Ready For Takeoff</p>
              )}
            </div> 
          )} 
        </AnimatePresence> 
         
        {/* Large Flight Rocket Asset */}
        {isLive && !hasCrashed && (
          <motion.div 
            animate={{ x: multiplier * 16, y: -multiplier * 9 }} 
            className="absolute bottom-24 left-24 text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)] z-10"
            style={{ transition: 'transform 0.07s linear' }}
          > 
            <Rocket size={68} className="fill-current rotate-45 stroke-[2.5]" /> 
          </motion.div> 
        )} 

        {/* Debris Grid Output */}
        {hasCrashed && (
          <div 
            className="absolute bottom-24 left-24 pointer-events-none w-1 h-1 z-0"
            style={{ transform: `translate(${crashCoordinates.x}px, ${crashCoordinates.y}px)` }}
          >
            <motion.div 
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 5.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -inset-16 w-32 h-32 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full blur-xl opacity-80"
            />

            {heavyFragments.map(frg => (
              <motion.div
                key={frg.id}
                initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.5 }}
                animate={{ 
                  x: frg.tx, 
                  y: frg.ty, 
                  opacity: [0, 1, 1, 0.85], 
                  rotate: frg.r,
                  scale: frg.s
                }}
                transition={{ 
                  duration: 1.4, 
                  ease: "easeOut",
                  times: [0, 0.08, 0.85, 1]
                }}
                className="absolute text-xl filter drop-shadow-[0_0_6px_rgba(249,115,22,0.9)] select-none"
              >
                {frg.item}
              </motion.div>
            ))}
          </div>
        )}
      </div> 

      {/* Ledger History View */}
      <div className="bg-[#111] border border-white/5 rounded-3xl p-6"> 
        <div className="mb-4 flex justify-between items-center">
          <h3 className="font-black uppercase text-xs tracking-widest text-gray-400">Recent Bets (Max 5)</h3>
          <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded-full">Live Monitor</span>
        </div> 
        
        <div className="max-h-[220px] overflow-y-auto custom-scrollbar"> 
          <table className="w-full text-left text-xs"> 
            <thead className="sticky top-0 bg-[#111] z-10"> 
              <tr className="text-gray-500 border-b border-white/5 uppercase">
                <th className="pb-3 font-black">Amount</th>
                <th className="pb-3 font-black">Target Set</th> 
                <th className="pb-3 font-black">Crash/End</th>
                <th className="pb-3 font-black">Result</th>
              </tr> 
            </thead> 
            <tbody> 
              {betHistory.map(b => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"> 
                  <td className="py-2.5 font-bold text-gray-300">{b.amount} SOLT</td> 
                  <td className="py-2.5 text-blue-400 font-black">{b.target}</td> 
                  <td className="py-2.5 text-yellow-400 font-black">{b.crashAt?.toFixed(2)}x (Num: {getGameNumber(b.crashAt)})</td> 
                  <td className={`py-2.5 font-black ${b.status === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                    {b.status === 'WIN' ? `+${b.profit} SOLT` : 'LOST'}
                  </td> 
                </tr> 
              ))} 
              {betHistory.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-600 font-bold uppercase tracking-wider text-[10px]">No flights recorded yet</td>
                </tr>
              )}
            </tbody> 
          </table> 
        </div> 
      </div> 
    </div>
  );
}