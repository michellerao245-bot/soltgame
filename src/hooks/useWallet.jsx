import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const useWallet = () => {

  const { address, isConnected } = useAccount();

  const { connect } = useConnect();

  const { disconnect } = useDisconnect();

  const connectWallet = async () => {
    try {
      await connect({
        connector: injected(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    address,
    isConnected,
    connectWallet,
    disconnect,
  };
};