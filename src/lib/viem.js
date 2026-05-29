import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

// Public Client: Sirf blockchain data read karne ke liye (Read-only)
export const publicClient = createPublicClient({
  chain: mainnet, // Ya sepolia, apni requirement ke hisaab se
  transport: http(),
});

// Wallet Client: Transactions sign karne aur write operations ke liye
export const getWalletClient = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
    });
  }
  return null;
};