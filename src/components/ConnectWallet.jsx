import React from 'react';
import { useWallet } from '../hooks'; // Tumhara custom hook

export const ConnectWallet = () => {
  const { isConnected, address, connect, disconnect } = useWallet();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-xs bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-full border border-cyan-800">
            {address.substring(0, 6)}...{address.substring(38)}
          </span>
          <button 
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button  
          onClick={connect} 
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition shadow-lg shadow-cyan-500/20"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};