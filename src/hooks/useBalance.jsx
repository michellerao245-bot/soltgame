import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

const SOLT_TOKEN_ADDRESS =
  '0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9';

// Minimal ERC20 ABI
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
    stateMutability: "view",
  },
];

export const useAppBalance = () => {
  const { address, isConnected } = useAccount();

  const {
    data,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: SOLT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000,
    },
  });

  // 18 decimals assumed
  const formattedBalance = data
    ? Number(formatUnits(data, 18)).toFixed(4)
    : "0.0000";

  console.log("Wallet:", address);
  console.log("Raw Balance:", data);
  console.log("Error:", error);

  return {
    balance: formattedBalance,
    refetch,
    isLoading,
    isError,
  };
};