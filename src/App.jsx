import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Provider';

// Import components & pages
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { Home, Casino, Leaderboard, Profile, Privacy, Terms } from './pages';
import CyberDice from './components/games/CyberDice';
import Dream11 from './components/games/Dream11';
import EmpireBattle from './components/games/EmpireBattle';
import GhostHunter from './components/games/GhostHunter';
import Moonjump from './components/games/TempGame';
import NeoRoulette from './components/games/NeoRoulette';
import PokerBaz from './components/games/PokerBaz';
import SoltCrash from './components/games/SoltCrash';
import SoltSlots from './components/games/SoltSlots';
import WheelOfFortune from './components/games/WheelOfFortune';
function App() {
  return (
    <Web3Provider>
      <Router>
        {/* Main Background with subtle grid effect */}
        <div className="min-h-screen flex flex-col bg-[#050a14] text-gray-200 selection:bg-cyan-500/30">
          
          <Navbar />
          
          {/* Glowing Hero wrapper */}
          <main className="flex-grow relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-gray-950 -z-10"></div>
            
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/game/neoroulette" element={<NeoRoulette />} />
<Route path="/game/soltslots" element={<SoltSlots />} />
<Route path="/game/soltcrash" element={<SoltCrash />} />
<Route path="/game/moonjump" element={<Moonjump />} />
<Route path="/game/ghosthunter" element={<GhostHunter />} />
<Route path="/game/pokerbaz" element={<PokerBaz />} />
<Route path="/game/cyberdice" element={<CyberDice />} />
<Route path="/game/dream11" element={<Dream11 />} />
<Route path="/game/empirebattle" element={<EmpireBattle />} />
<Route path="/game/wheeloffortune" element={<WheelOfFortune />} />
                <Route path="/" element={<Home />} />
                <Route path="/casino" element={<Casino />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </div>
          </main>
          
          <Footer />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;