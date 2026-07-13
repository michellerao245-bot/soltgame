import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Provider';
import { BalanceProvider, useBalance } from './context/BalanceContext';

// Import components & pages
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { Home, Casino, Leaderboard, Profile, Privacy, Terms } from './pages';
import LegalSection from './pages/LegalSection';

// Import Games
import CyberDice from './components/games/CyberDice';
import Dream11 from './components/games/Dream11';
import EmpireBattle from './components/games/EmpireBattle';
import GhostHunter from './components/games/GhostHunter';
import MoonJump from './components/games/MoonJump';
import NeoRoulette from './components/games/NeoRoulette';
import PokerBaz from './components/games/PokerBaz';
import SoltCrash from './components/games/SoltCrash';
import SoltSlots from './components/games/SoltSlots';
import WheelOfFortune from './components/games/WheelOfFortune';

function AppContent() {
  // useBalance ka use yahan safe hai kyunki ye BalanceProvider ke andar hai
  const { balance, updateBalance } = useBalance();

  return (
    <div className="min-h-screen flex flex-col bg-[#050a14] text-gray-200">
      <Navbar />
      <main className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-gray-950 -z-10" />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/game/neoroulette" element={<NeoRoulette currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/soltslots" element={<SoltSlots currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/soltcrash" element={<SoltCrash currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/moonJump" element={<MoonJump currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/ghosthunter" element={<GhostHunter currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/pokerbaz" element={<PokerBaz currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/cyberdice" element={<CyberDice currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/dream11" element={<Dream11 currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/empirebattle" element={<EmpireBattle currentBalance={balance} onBalanceUpdate={updateBalance} />} />
            <Route path="/game/wheeloffortune" element={<WheelOfFortune currentBalance={balance} onBalanceUpdate={updateBalance} />} />

            <Route path="/" element={<Home />} />
            <Route path="/casino" element={<Casino />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <LegalSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Web3Provider>
      <BalanceProvider>
        <Router>
          <AppContent />
        </Router>
      </BalanceProvider>
    </Web3Provider>
  );
}

export default App;