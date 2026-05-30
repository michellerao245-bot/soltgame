import { useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export const useWallet = () => {

  const { address, isConnected } = useAccount();

  const { connect } = useConnect();

  const { disconnect } = useDisconnect();

  useEffect(() => {
  const createUser = async () => {
    if (!isConnected || !address) return;

    try {
      await fetch(`${API_BASE_URL}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: address,
          username: "Guest",
        }),
      });
    } catch (err) {
      console.log("Create User Error:", err);
    }
  };

  createUser();
}, [address, isConnected]);

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