import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useAppBalance } from '../../hooks/useBalance';

const WheelOfFortune = () => {

  const { isConnected } = useWallet();
  const { balance } = useAppBalance();

  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert('Wheel Of Fortune Started!');
    }, 1500);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a14] text-white">
        Connect wallet to play Wheel Of Fortune!
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050a14] text-white">

      <div className="p-8 bg-[#0b1426] rounded-xl border border-cyan-900/50 text-center">

        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          Wheel Of Fortune
        </h1>

        <p className="mb-6">
          Balance: {balance} SOLT
        </p>

        <button
          onClick={handlePlay}
          disabled={loading}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition"
        >
          {loading ? 'Loading...' : 'Start Game'}
        </button>

      </div>

    </div>
  );
};

export default WheelOfFortune;