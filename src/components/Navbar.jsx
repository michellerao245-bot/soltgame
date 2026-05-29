import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { useAppBalance } from '../hooks/useBalance';

export const Navbar = () => {

  const {
    isConnected,
    connectWallet,
    disconnect,
  } = useWallet();

  const {
    balance,
    refetch,
    isLoading,
  } = useAppBalance();

  // Balance Formatter
  const formatBalance = (num) => {
    const n = Number(num);

    if (n >= 1_000_000_000) {
      return (n / 1_000_000_000).toFixed(2) + 'B';
    }

    if (n >= 1_000_000) {
      return (n / 1_000_000).toFixed(2) + 'M';
    }

    if (n >= 1_000) {
      return (n / 1_000).toFixed(2) + 'K';
    }

    return n.toFixed(4);
  };

  return (
    <nav className="w-full bg-[#050a14] border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">

        {/* Left */}
        <button
          onClick={() => window.location.href = 'https://solthub.com'}
          className="text-cyan-400 hover:text-white transition font-medium"
        >
          ← Back to SoltHub
        </button>

        {/* Right */}
        <div className="flex flex-col gap-2 items-end">

          {/* Connect / Balance Button */}
          <button
            onClick={() => {
              if (!isConnected) {
                connectWallet();
              } else {
                refetch();
              }
            }}
            className="bg-cyan-900/20 border border-cyan-800/50 px-4 py-2 rounded-lg text-cyan-400 font-bold hover:bg-cyan-900/40 transition"
          >
            {!isConnected
              ? "Connect Wallet"
              : isLoading
              ? "Loading..."
              : `${formatBalance(balance)} SOLT`}
          </button>

          {/* Disconnect Button */}
          {isConnected && (
            <button
              onClick={() => disconnect()}
              className="px-4 py-1 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white rounded-lg text-sm font-bold transition"
            >
              Disconnect
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};