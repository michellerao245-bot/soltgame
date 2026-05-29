import { publicClient, getWalletClient } from '../lib/web3';

export const walletService = {
  // User ka balance fetch karne ke liye (Read-only)
  getBalance: async (address) => {
    try {
      const balance = await publicClient.getBalance({ address });
      return balance; // Ye Wei mein return hoga
    } catch (error) {
      console.error("Balance fetch error:", error);
      return 0;
    }
  },

  // Transaction sign karne ke liye
  sendTransaction: async (to, value) => {
    const walletClient = getWalletClient();
    if (!walletClient) throw new Error("Wallet not connected");

    const [account] = await walletClient.getAddresses();
    return await walletClient.sendTransaction({
      account,
      to,
      value,
    });
  },

  // Message sign karne ke liye (Login ke liye zaroori)
  signMessage: async (message) => {
    const walletClient = getWalletClient();
    if (!walletClient) throw new Error("Wallet not connected");

    const [account] = await walletClient.getAddresses();
    return await walletClient.signMessage({
      account,
      message,
    });
  }
};