import React from 'react';
import { CyberDice, PokerBaz, SoltSlots } from '../features'; // Features se import karo

export const Casino = () => {
  return (
    <div className="casino-page p-8">
      <h1 className="text-4xl mb-6">Casino Lobby</h1>
      <div className="grid grid-cols-3 gap-6">
        <CyberDice />
        <PokerBaz />
        <SoltSlots />
      </div>
    </div>
  );
};