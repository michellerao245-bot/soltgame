import React, { useState } from 'react';

const GhostHunter = ({
currentBalance = 1000,
 onBalanceUpdate = () => {},
}) => {

  const [betAmount, setBetAmount] = useState(10);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [isHunting, setIsHunting] = useState(false);
  const [radarStatus, setRadarStatus] = useState('READY TO SCAN THE ROOM');
  const [caughtGhost, setCaughtGhost] = useState(null);
  const [gameMessage, setGameMessage] = useState('');

  const ghostTargets = [
    {
      id: 'phantom',
      name: '👻 PHANTOM',
      multiplier: 2,
      color:
        'border-cyan-500 text-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    },
    {
      id: 'banshee',
      name: '🧛 BANSHEE',
      multiplier: 3,
      color:
        'border-purple-500 text-purple-400 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    },
    {
      id: 'poltergeist',
      name: '🔥 POLTERGEIST',
      multiplier: 5,
      color:
        'border-red-500 text-red-400 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    },
  ];

  // 🔊 Audio Engine
  const playGhostSFX = (type) => {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
      }

      else if (type === 'scan_trigger') {
        osc.type = 'sawtooth';

        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
      }

      else if (type === 'win') {
        osc.type = 'triangle';

        osc.frequency.setValueAtTime(523.25, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
      }

      else if (type === 'lose') {
        osc.type = 'sawtooth';

        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.5);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.log('Audio blocked:', e);
    }
  };

  const handleHunt = () => {

    if (!selectedTarget) {
      alert('Please select a Ghost type!');
      return;
    }

    if (currentBalance < betAmount) {
      alert('Insufficient Balance!');
      return;
    }

    playGhostSFX('scan_trigger');

    onBalanceUpdate(-betAmount);

    setIsHunting(true);
    setCaughtGhost(null);
    setGameMessage('');

    const statuses = [
      '🚨 CALIBRATING EMF SCANNER...',
      '📡 DETECTING EMF FIELDS...',
      '💨 TEMPERATURE DROPPING...',
      '👁️ GHOST DETECTED...',
    ];

    statuses.forEach((status, index) => {
      setTimeout(() => {
        setRadarStatus(status);
      }, index * 600);
    });

    setTimeout(() => {

      const rand = Math.random() * 100;

      let resultGhost = 'phantom';

      if (rand > 50 && rand <= 83) {
        resultGhost = 'banshee';
      }

      if (rand > 83) {
        resultGhost = 'poltergeist';
      }

      const winningGhost = ghostTargets.find(
        (g) => g.id === resultGhost
      );

      setCaughtGhost(winningGhost);

      setIsHunting(false);

      setRadarStatus('SCAN COMPLETE');

      if (resultGhost === selectedTarget) {

        const targetObj = ghostTargets.find(
          (g) => g.id === selectedTarget
        );

        const winAmount =
          betAmount * targetObj.multiplier;

        onBalanceUpdate(winAmount);

        playGhostSFX('win');

        setGameMessage(
          `🎉 YOU WON +${winAmount.toFixed(2)} SOLT`
        );

      } else {

        playGhostSFX('lose');

        setGameMessage(
          `💀 FAILED! Ghost Escaped (${winningGhost.name})`
        );
      }

    }, 2800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#08080c] border border-purple-500/20 rounded-3xl p-6 text-white my-6">

      <div className="flex justify-between items-between mb-8">

        <div>
          <h2 className="text-4xl font-black text-purple-400">
            GHOST HUNTER
          </h2>

          <p className="text-xs text-gray-500 uppercase">
            Web3 Horror Casino
          </p>
        </div>

        </div>

      {/* Radar */}
      <div className="bg-black/40 rounded-2xl p-8 mb-8 text-center">

        <div className="relative w-40 h-40 mx-auto rounded-full border border-purple-500 flex items-center justify-center mb-6">

          {isHunting && (
            <div className="absolute inset-0 border-t-2 border-l-2 border-purple-500 rounded-full animate-spin"></div>
          )}

          <span className="text-5xl">
            {isHunting
              ? '📡'
              : caughtGhost
              ? caughtGhost.name.split(' ')[0]
              : '🎯'}
          </span>
        </div>

        <p className="text-purple-400 font-bold mb-3">
          {radarStatus}
        </p>

        {gameMessage && (
          <div className="mt-4 text-sm font-black">
            {gameMessage}
          </div>
        )}
      </div>

      {/* Bet Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {[10, 50, 100, 500].map((amt) => (
          <button
            key={amt}
            onClick={() => {
              if (!isHunting) {
                setBetAmount(amt);
                playGhostSFX('click');
              }
            }}
            className={`p-3 rounded-xl font-black border ${
              betAmount === amt
                ? 'bg-purple-500 text-black border-purple-300'
                : 'bg-[#111] border-white/10'
            }`}
          >
            {amt} SOLT
          </button>
        ))}
      </div>

      {/* Ghost Selection */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        {ghostTargets.map((ghost) => (
          <button
            key={ghost.id}
            onClick={() => {
              if (!isHunting) {
                setSelectedTarget(ghost.id);
                playGhostSFX('click');
              }
            }}
            className={`p-4 rounded-xl border transition-all ${
              selectedTarget === ghost.id
                ? ghost.color
                : 'bg-[#111] border-white/10'
            }`}
          >
            <div className="font-black text-sm">
              {ghost.name}
            </div>

            <div className="text-xs opacity-70">
              {ghost.multiplier}x
            </div>
          </button>
        ))}
      </div>

      {/* Play Button */}
      <button
        onClick={handleHunt}
        disabled={isHunting}
        className={`w-full py-4 rounded-xl font-black text-sm uppercase ${
          isHunting
            ? 'bg-gray-800 text-gray-500'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600'
        }`}
      >
        {isHunting
          ? '⚡ SCANNING...'
          : '🔮 START HUNT'}
      </button>

    </div>
  );
};

export default GhostHunter;