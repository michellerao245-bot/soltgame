import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const NeonRoulette = ({ currentBalance = 0, onBalanceUpdate }) => {
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [status, setStatus] = useState("PLACE YOUR BET");
  const [history, setHistory] = useState(Array(10).fill(null));
  
  // Audio state
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const wheelRef = useRef(null);
  const winAudio = useRef(null);
  const loseAudio = useRef(null);

  useEffect(() => {
    winAudio.current = new Audio('https://actions.google.com/sounds/v1/ui/gameshow_winner_fanfare.ogg');
    loseAudio.current = new Audio('https://actions.google.com/sounds/v1/ui/negative_beeps.ogg');
  }, []);

  // Audio unlock function
  const unlockAudio = () => {
    if (!isAudioUnlocked) {
      winAudio.current.play().then(() => {
        winAudio.current.pause();
        winAudio.current.currentTime = 0;
        setIsAudioUnlocked(true);
      }).catch(e => console.log("Audio waiting for interaction"));
    }
  };

  const playSound = (type) => {
    const audio = type === 'win' ? winAudio.current : loseAudio.current;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio error:", e));
  };

  const getPayout = (amt) => (amt === 10 ? 10 : amt === 20 ? 12 : 15);
  const gameData = [
    { color: '#ef4444', val: 0 }, { color: '#f97316', val: 3 }, { color: '#f59e0b', val: 6 },
    { color: '#eab308', val: 9 }, { color: '#84cc16', val: 12 }, { color: '#22c55e', val: 15 },
    { color: '#10b981', val: 18 }, { color: '#06b6d4', val: 21 }, { color: '#3b82f6', val: 24 },
    { color: '#6366f1', val: 27 }, { color: '#8b5cf6', val: 30 }, { color: '#d946ef', val: 33 }
  ];

  const spin = () => {
    if (status !== "PLACE YOUR BET") return;
    if (currentBalance < bet) { alert("Balance kam hai!"); return; }
    
    unlockAudio(); // Spin karte waqt unlock trigger
    onBalanceUpdate(-bet);
    setStatus("SPINNING...");
    
    const randomAngle = 3600 + Math.floor(Math.random() * 360);
    wheelRef.current.style.transition = "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
    wheelRef.current.style.transform = `rotate(${randomAngle}deg)`;
    
    setTimeout(() => {
      const winningIndex = Math.floor((360 - (randomAngle % 360)) / 30) % 12;
      const isWin = gameData[winningIndex].val === selectedNumber;
      
      setHistory(prev => [isWin ? 'W' : 'L', ...prev.slice(0, 9)]);

      if (isWin) {
        setStatus("WIN 🎉");
        playSound('win');
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        onBalanceUpdate(bet * getPayout(bet));
      } else {
        setStatus("LOSE 💀");
        playSound('lose');
      }
      
      setTimeout(() => {
        setStatus("PLACE YOUR BET");
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = `rotate(${randomAngle % 360}deg)`;
      }, 2000);
    }, 4000);
  };

  return (
    // Pura page click-ready bana diya
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4" onClick={unlockAudio}>
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl animate-bounce">🐎</div>
        <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          NEO ROULETTE
        </h1>
      </div>

      <div className="flex gap-4 w-full">
        {/* Main Game Box */}
        <div className="flex-grow flex flex-col items-center p-8 rounded-3xl border-4 border-yellow-500 bg-zinc-950 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
          <div className="text-2xl font-black text-yellow-400 mb-4 drop-shadow-md">BALANCE: {currentBalance}</div>

          <div className="flex gap-2 mb-2">
            {[10, 20, 50].map((amt) => (
              <button key={amt} onClick={(e) => { e.stopPropagation(); setBet(amt); }} 
                className={`px-6 py-2 rounded-xl border-2 font-black ${bet === amt ? 'bg-yellow-500 text-black border-white shadow-[0_0_15px_#eab308]' : 'bg-zinc-800 text-white border-zinc-600'}`}>
                {amt} SOLT
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-400 mb-6 font-bold">
            Bet: {bet} SOLT | Potential Win: <span className="text-green-400">{bet * getPayout(bet)} SOLT</span>
          </div>

          <div className="grid grid-cols-6 gap-2 mb-8">
            {gameData.map((item, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setSelectedNumber(item.val); }}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black ${selectedNumber === item.val ? 'border-white scale-110 shadow-[0_0_10px_white]' : 'border-zinc-700'}`}
                style={{ backgroundColor: item.color }}>{item.val}</button>
            ))}
          </div>

          <div className="relative w-56 h-56 mb-6">
            <div className="absolute -top-4 left-[106px] w-6 h-6 bg-white z-50 rotate-45 border-2 border-black" />
            <div ref={wheelRef} className="w-full h-full rounded-full border-8 border-zinc-800 shadow-[0_0_20px_black] relative"
              style={{ background: `conic-gradient(${gameData.map((d, i) => `${d.color} ${i*30}deg ${(i+1)*30 - 2}deg, #000 ${(i+1)*30 - 2}deg ${(i+1)*30}deg`).join(', ')})` }}>
              {gameData.map((d, i) => (
                <div key={i} className="absolute inset-0 flex items-start justify-center pt-4" style={{ transform: `rotate(${i * 30 + 15}deg)` }}>
                  <span className="text-white font-black text-sm drop-shadow-lg">{d.val}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={(e) => { e.stopPropagation(); spin(); }} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl font-black text-xl uppercase tracking-widest shadow-[0_0_20px_#ef4444] hover:scale-105 transition-all">
            {status}
          </button>
        </div>

        <div className="w-16 flex flex-col gap-2 p-2 rounded-2xl border-2 border-zinc-700 bg-zinc-900 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="text-[10px] text-zinc-500 text-center font-black uppercase">Recent</div>
          {history.map((res, i) => (
            <div key={i} className={`h-8 w-full rounded flex items-center justify-center font-black text-white ${res === 'W' ? 'bg-green-600' : res === 'L' ? 'bg-red-600' : 'bg-zinc-800'}`}>
              {res || '-'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NeonRoulette;