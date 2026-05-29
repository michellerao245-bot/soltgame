import React, { useState, useEffect, useRef } from 'react'; 
import { Rocket, ArrowUp, RefreshCw } from 'lucide-react'; 
 
const MoonJump = ({ currentBalance, onBalanceUpdate }) => { 
  const [betAmount, setBetAmount] = useState(10); 
  const [gameState, setGameState] = useState('idle'); // idle, jumping, landed, crashed 
  const [altitude, setAltitude] = useState(0); 
  const [multiplier, setMultiplier] = useState(1.0); 
  const [logs, setLogs] = useState([]); 
  const [particles, setParticles] = useState([]); // Crash & Win fx emitter

  const animationRef = useRef(null);
 
  // 🎛️ Google-Compliant Web Audio API Engine
  const playMoonSFX = (type, currentFreq = 200) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'jump_loop') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100 + currentFreq, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'cashout') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(783.99, now + 0.08); // G5
        osc.frequency.setValueAtTime(987.77, now + 0.16); // B5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'crash_boom') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(20, now + 0.5);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.log("Audio contexts blocked or unsupported:", e);
    }
  };

  // 💥 Dynamic FX Emitter Loop (Blast Particles & Stars)
  useEffect(() => {
    if (particles.length > 0) {
      const frame = () => {
        setParticles((prevParticles) =>
          prevParticles
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.type === 'debris' ? p.vy + 0.4 : p.vy + 0.1, 
              alpha: p.alpha - 0.02,
            }))
            .filter((p) => p.alpha > 0)
        );
      };
      animationRef.current = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(animationRef.current);
    }
  }, [particles]);

  const triggerBlast = (type) => {
    const freshParticles = [];
    const count = type === 'debris' ? 18 : 25; 
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      freshParticles.push({
        id: Math.random(),
        x: 150, 
        y: 180, 
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        type: type, 
        color: type === 'debris' 
          ? (Math.random() > 0.5 ? '#ef4444' : '#f97316') 
          : (Math.random() > 0.5 ? '#eab308' : '#22c55e'), 
        size: Math.random() * 6 + 3
      });
    }
    setParticles(freshParticles);
  };
 
  // Physics animation simulation for jump 
  useEffect(() => { 
    let interval; 
    if (gameState === 'jumping') { 
      interval = setInterval(() => { 
        setAltitude((prev) => { 
          const nextAlt = prev + Math.floor(Math.random() * 15) + 5; 
          
          playMoonSFX('jump_loop', nextAlt);
           
          if (nextAlt > 50 && Math.random() < 0.12) { 
            setGameState('crashed'); 
            playMoonSFX('crash_boom');
            triggerBlast('debris'); 
            setLogs((prevLogs) => [
              { type: 'crash', text: `💥 Crashed at ${multiplier.toFixed(2)}x!` }, 
              ...prevLogs
            ].slice(0, 5)); 
            clearInterval(interval); 
            return prev; 
          } 
 
          if (nextAlt >= 260) { 
            handleCashout(260); 
            clearInterval(interval); 
            return 260; 
          } 
 
          const nextMult = 1.0 + (nextAlt / 80); 
          setMultiplier(nextMult); 
          return nextAlt; 
        }); 
      }, 120); 
    } 
    return () => clearInterval(interval); 
  }, [gameState, multiplier]); 
 
  const handleStartJump = () => { 
    if (betAmount <= 0 || betAmount > currentBalance) return; 
     
    if (onBalanceUpdate) onBalanceUpdate(-betAmount); 
 
    setAltitude(0); 
    setMultiplier(1.0); 
    setParticles([]);
    setGameState('jumping'); 
    setLogs((prev) => [
      { type: 'start', text: `🚀 Jumped with ${betAmount} SOLT` }, 
      ...prev
    ].slice(0, 5)); 
  }; 
 
  const handleCashout = (forcedAlt) => { 
    if (gameState !== 'jumping') return; 
     
    const finalAlt = forcedAlt || altitude; 
    const finalMult = 1.0 + (finalAlt / 80); 
    const winAmount = Number((betAmount * finalMult).toFixed(2)); 
 
    if (onBalanceUpdate) onBalanceUpdate(winAmount); 
 
    setGameState('landed'); 
    playMoonSFX('cashout');
    triggerBlast('star'); 
    setLogs((prev) => [
      { type: 'win', text: `🌕 Landed safely! Won ${winAmount} SOLT (${finalMult.toFixed(2)}x)` }, 
      ...prev
    ].slice(0, 5)); 
  };
  return ( 
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 max-w-4xl mx-auto my-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] select-none"> 
      {/* Game Matrix Header */} 
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6"> 
        <div> 
          <h2 className="text-3xl font-black tracking-tighter text-yellow-400 italic uppercase">MOON JUMP Web3</h2> 
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Skill-Based Gravity Multiplier</p> 
        </div> 
        <div className="bg-[#111] px-4 py-2 rounded-xl border border-white/5 text-right"> 
          <span className="text-[9px] text-gray-500 block uppercase font-bold">Your Balance</span> 
         <span className="text-sm font-black text-white">{currentBalance?.toFixed(2)} SOLT</span>
        </div> 
      </div> 
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
        {/* Left Side: Interactive Jump Canvas Panel */} 
        <div className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-2xl h-80 relative overflow-hidden flex flex-col justify-end p-4 shadow-inner"> 
           
          {/* Grid lines pattern */} 
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" /> 
 
          {/* Dynamic Multiplier Counter Overlay */} 
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20"> 
            <h1 className={`text-6xl font-black italic tracking-tighter ${gameState === 'crashed' ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}> 
              {multiplier.toFixed(2)}x 
            </h1> 
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Current Multiplier</p> 
          </div> 
 
          {/* Moon Target Graphic */} 
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-yellow-500/10 blur-xl pointer-events-none" /> 
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center font-black text-lg text-yellow-500/40 shadow-md">🌕</div> 
 
          {/* Custom Particle Rendering Engine Overlay */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{
                left: `${p.x + 100}px`,
                bottom: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.alpha,
                boxShadow: `0 0 10px ${p.color}`,
                fontSize: p.type === 'star' ? '12px' : 'auto'
              }}
            >
              {p.type === 'star' && '⭐'}
            </div>
          ))}

          {/* Animated Player Character or Explosion State */} 
          <div  
            className="w-full flex justify-center transition-all duration-100 ease-out z-10 relative" 
            style={{ transform: `translateY(-${altitude}px)` }} 
          > 
            {gameState === 'crashed' ? (
              <div className="text-4xl animate-ping duration-300">💥</div>
            ) : (
              <div className={`p-4 rounded-xl flex flex-col items-center gap-1 ${ 
                gameState === 'landed' ? 'bg-green-900/30 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 
                gameState === 'jumping' ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' :
                'bg-neutral-900 border-white/5 text-gray-500'
              } border w-16 h-16 justify-center shadow-lg backdrop-blur-sm`}> 
                <Rocket size={24} className={gameState === 'jumping' ? 'animate-bounce text-yellow-400' : ''} /> 
              </div> 
            )}
          </div> 
 
          {/* Ground Platform */} 
          <div className="border-t border-white/10 w-full pt-1 text-[8px] text-gray-600 uppercase tracking-widest font-bold z-0"> 
            Launch Station Alpha 
          </div> 
        </div> 
 
        {/* Right Side: Bet Controls & Feed Logs */} 
        <div className="flex flex-col justify-between space-y-4"> 
          <div className="bg-[#111] p-4 rounded-2xl border border-white/5 space-y-3"> 
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-black block">Staking Amount</label> 
            <div className="flex gap-2"> 
              <input  
                type="number"  
                value={betAmount}  
                onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))} 
                disabled={gameState === 'jumping'} 
                className="w-full bg-[#050505] border border-white/5 rounded-xl px-3 py-2 text-white font-black focus:outline-none focus:border-yellow-500/50 text-sm" 
              /> 
              <button  
                onClick={() => setBetAmount(Math.floor(currentBalance / 2))} 
                disabled={gameState === 'jumping'} 
                className="bg-[#1a1a1a] border border-white/5 hover:bg-neutral-800 px-2 rounded-xl text-[10px] font-bold uppercase transition-colors text-gray-300" 
              > 
                Half 
              </button> 
              <button  
                onClick={() => setBetAmount(currentBalance)} 
                disabled={gameState === 'jumping'} 
                className="bg-[#1a1a1a] border border-white/5 hover:bg-neutral-800 px-2 rounded-xl text-[10px] font-bold uppercase transition-colors text-gray-300" 
              > 
                Max 
              </button> 
            </div> 
 
            {/* Action Buttons */} 
            {gameState !== 'jumping' ? ( 
              <button 
                onClick={handleStartJump} 
                disabled={betAmount > currentBalance || betAmount <= 0} 
                className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-neutral-800 disabled:text-gray-600 text-black font-black py-4 rounded-xl uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(234,179,8,0.15)]" 
              > 
                <ArrowUp size={16} /> JUMP NOW 
              </button> 
            ) : ( 
              <button 
                onClick={() => handleCashout()} 
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(34,197,94,0.15)]" 
              > 
                <RefreshCw size={16} className="animate-spin" /> CASHOUT MULTI 
              </button> 
            )} 
          </div> 
 
          {/* Logs Terminal Feed */} 
          <div className="bg-[#050505] border border-white/5 rounded-2xl p-3 flex-1 h-36 overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar-none"> 
            {logs.length === 0 && <div className="text-gray-600 italic">Awaiting telemetry inputs...</div>} 
            {logs.map((log, i) => ( 
              <div key={i} className={`border-l-2 pl-1.5 ${ 
                log.type === 'win' ? 'border-green-500 text-green-400' : 
                log.type === 'crash' ? 'border-red-500 text-red-400' : 'border-yellow-500 text-yellow-500/80' 
              }`}> 
                {log.text} 
              </div> 
            ))} 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default MoonJump;