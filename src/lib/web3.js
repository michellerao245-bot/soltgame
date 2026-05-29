// src/lib/web3.js
import { config } from './wagmi';
import { publicClient, getWalletClient } from './viem';
import { queryClient } from './queryClient';

// Iska fayda: Tumhe har jagah 3 imports nahi likhne padenge.
// Bas likho: import { publicClient } from "@/lib/web3";
export { 
  config, 
  publicClient, 
  getWalletClient, 
  queryClient 
};