import React from 'react';
import { useWallet, useAppBalance } from '../hooks';

export const Profile = () => {
  const { address } = useWallet();
  const { balance } = useAppBalance();
  
  return (
    <div className="profile-page p-8">
      <h2>My Account</h2>
      <p>Address: {address}</p>
      <p>Balance: {balance} ETH</p>
    </div>
  );
};