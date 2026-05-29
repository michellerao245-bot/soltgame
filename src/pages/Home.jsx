import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const games = [
    {
      name: 'NeoRoulette',
      slug: 'neoroulette',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    },
    {
      name: 'SoltSlots',
      slug: 'soltslots',
      image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
    },
    {
      name: 'SoltCrash',
      slug: 'soltcrash',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
    },
    {
      name: 'MoonJump',
      slug: 'MoonJump',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    },
    {
      name: 'GhostHunter',
      slug: 'ghosthunter',
      image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800',
    },
    {
      name: 'PokerBaz',
      slug: 'pokerbaz',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    },
    {
      name: 'CyberDice',
      slug: 'cyberdice',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800',
    },
    {
      name: 'Dream11',
      slug: 'dream11',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
    },
    {
      name: 'Empire Battle',
      slug: 'empirebattle',
      image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800',
    },
    {
      name: 'Wheel of Fortune',
      slug: 'wheeloffortune',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[#050a14]">

      {/* Hero Section */}
      <h1 className="text-5xl font-extrabold mb-6 animate-pulse text-cyan-400">
        Welcome to Solt Cyber Casino
      </h1>

      <p className="text-xl mb-12 max-w-2xl text-gray-400">
        The ultimate Web3 gaming platform. Provably fair games,
        instant payouts, and secure wallet integration.
      </p>

      {/* Featured Games */}
      <h2 className="text-3xl font-bold mb-10 text-white">
        Featured Games
      </h2>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">

        {games.map((game) => (
          <div
            key={game.slug}
            className="cyber-glow bg-[#0b1426] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-cyan-900/50 shadow-lg"
          >

            {/* Game Image */}
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-52 object-cover"
            />

            {/* Game Info */}
            <div className="p-6 text-center">

              <h3 className="text-xl font-semibold text-cyan-100 mb-4">
                {game.name}
              </h3>

              <button
                onClick={() => navigate(`/game/${game.slug}`)}
                className="bg-cyan-900/40 border border-cyan-600 text-cyan-400 px-6 py-2 rounded-lg font-bold hover:bg-cyan-600 hover:text-white transition"
              >
                Play
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};