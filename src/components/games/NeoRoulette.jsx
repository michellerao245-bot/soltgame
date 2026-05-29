import React, { useState, useRef } from 'react';

const NeonRoulette = ({ currentBalance, onBalanceUpdate }) => {
  const [bet, setBet] = useState(10);
  const [status, setStatus] = useState("PLACE YOUR BET");
  const wheelRef = useRef(null);
  const engine = useRef({ angle: 0, velocity: 0, targetAngle: 0, phase: 'idle' });

  const spin = () => {
    if (engine.current.phase !== 'idle' || currentBalance < bet) return;
    onBalanceUpdate(-bet);
    setStatus("SPINNING...");
    
    const slice = 30; // 360/12 segments
    const targetIdx = Math.floor(Math.random() * 12);
    engine.current.targetAngle = (5 * 360) + (targetIdx * slice) + (slice / 2);
    engine.current.velocity = 20 + Math.random() * 10;
    engine.current.phase = 'spinning';
    requestAnimationFrame(updatePhysics);
  };

  const updatePhysics = () => {
    let { angle, velocity, targetAngle, phase } = engine.current;
    if (phase === 'spinning') {
      velocity *= 0.985; angle += velocity;
      if (velocity < 1) engine.current.phase = 'damping';
    } else if (phase === 'damping') {
      const diff = targetAngle - angle;
      velocity += diff * 0.05; velocity *= 0.92;
      angle += velocity;
      if (Math.abs(diff) < 0.1 && Math.abs(velocity) < 0.05) {
        angle = targetAngle; velocity = 0; engine.current.phase = 'locked';
        setStatus("WINNER!");
        setTimeout(() => { onBalanceUpdate(bet * 2); setStatus("PLACE YOUR BET"); engine.current.phase = 'idle'; }, 1000);
      }
    }
    engine.current.angle = angle % 3600;
    wheelRef.current.style.transform = `rotate(${engine.current.angle}deg)`;
    if (engine.current.phase !== 'locked') requestAnimationFrame(updatePhysics);
  };

  return (
    <div className="flex flex-col items-center bg-zinc-900 p-6 rounded-3xl border border-yellow-600 text-white w-full max-w-sm mx-auto">
      <div className="flex justify-between w-full mb-6 font-black text-yellow-500">
        <span>BALANCE: ${currentBalance}</span>
        <span>BET: ${bet}</span>
      </div>

      {/* Fixed Wheel Container */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <div className="absolute -top-3 w-6 h-6 bg-red-600 z-50 rotate-45 shadow-[0_0_10px_red]" />
        
        <div ref={wheelRef} className="w-full h-full rounded-full border-4 border-zinc-700 transition-transform duration-75"
          style={{ background: 'conic-gradient(from 0deg, #16a34a 0deg 30deg, #dc2626 30deg 60deg, #000 60deg 90deg, #dc2626 90deg 120deg, #000 120deg 150deg, #dc2626 150deg 180deg, #000 180deg 210deg, #dc2626 210deg 240deg, #000 240deg 270deg, #dc2626 270deg 300deg, #000 300deg 330deg, #dc2626 330deg 360deg)' }}>
          
          {/* Numbers Centered */}
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} className="absolute inset-0 flex justify-center pt-2" style={{ transform: `rotate(${i * 30}deg)` }}>
              <span className="text-xs font-bold text-white">{i * 3}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={spin} className="w-full py-4 bg-red-700 rounded-xl font-black text-xl hover:bg-red-600 transition-all shadow-lg">
        {status}
      </button>
    </div>
  );
};

export default NeonRoulette;