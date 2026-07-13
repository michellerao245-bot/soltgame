import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(5000);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const savedBalance = localStorage.getItem('gameBalance');
    if (savedBalance !== null) setBalance(parseInt(savedBalance, 10));
    
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameBalance', balance.toString());
  }, [balance]);

  const updateBalance = useCallback((amount) => {
    setBalance((prev) => Math.max(0, prev + amount));
  }, []);

  const connectWallet = useCallback(() => {
    const mockAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setWalletAddress(mockAddress);
    setIsConnected(true);
    localStorage.setItem('walletAddress', mockAddress);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem('walletAddress');
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, updateBalance, walletAddress, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};