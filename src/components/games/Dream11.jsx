import React, { useState } from "react";
import { IPL_MATCHES } from "../../data/matches";
import {
  Trophy,
  Coins,
  ArrowLeft,
  CheckCircle2,
  Star,
  LayoutGrid,
} from "lucide-react";

// 🔥 Updated Component with Professional Fantasy Terms
function MatchCardTimers({
  matchStartTime = "07:30 PM",
  betCutoffTime = "07:00 PM",
}) {
  return (
    <div className="grid grid-cols-2 gap-2 bg-[#0c0c0c]/60 p-3 rounded-xl border border-white/5 mb-4">
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
          🕒 Match Start
        </p>
        <p className="text-xs font-bold text-gray-300 font-mono">
          {matchStartTime}
        </p>
      </div>

      <div className="text-right border-l border-white/5 pl-2">
        <p className="text-[10px] text-red-400/80 uppercase font-bold tracking-wider">
          ⚡ Contest Lock
        </p>
        <p className="text-xs font-bold text-red-500 font-mono">
          {betCutoffTime}
        </p>
      </div>
    </div>
  );
}

function Dream11({ currentBalance, onBalanceUpdate, onTeamLocked }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [creditsLeft, setCreditsLeft] = useState(100);
  const [rightPanelTab, setRightPanelTab] = useState('ground');
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setSelectedPlayers([]);
    setCreditsLeft(100);
    setCaptain(null);
    setViceCaptain(null);
    setRightPanelTab('ground');
  };

  const togglePlayer = (player) => {
    const isAlreadySelected = selectedPlayers.find(p => p.id === player.id);
    
    if (isAlreadySelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
      setCreditsLeft(prev => prev + player.points);
      if (captain === player.id) setCaptain(null);
      if (viceCaptain === player.id) setViceCaptain(null);
    } else {
      if (selectedPlayers.length >= 11) {
        alert("Bhai, 11 players ho gaye hain!");
        return;
      }
      if (creditsLeft < player.points) {
        alert("Insufficient Credits!");
        return;
      }
      setSelectedPlayers([...selectedPlayers, player]);
      setCreditsLeft(prev => prev - player.points);
    }
  };
  if (!selectedMatch) {
    return (
      <div className="w-full bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 max-w-5xl mx-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Trophy className="text-yellow-400" size={36} /> IPL FANTASY ARENA
            </h2>
            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Draft your Web3 squad</p>
          </div>
          <div className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-right">
            <p className="text-gray-500 text-xs font-bold uppercase">Your Balance</p>
            <p className="text-yellow-400 font-black text-xl">{currentBalance} SOLT</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {IPL_MATCHES.map((match) => (
            <div 
              key={match.id}
              onClick={() => handleSelectMatch(match)}
              className="bg-[#121212] border border-white/5 hover:border-yellow-400/40 rounded-2xl p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-red-600/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase animate-pulse">
                  {match.status}
                </span>
                <span className="text-gray-500 text-xs font-bold">{match.title}</span>
              </div>
              <div className="flex items-center justify-between my-6">
                <h3 className="text-3xl font-black text-white group-hover:text-yellow-400 transition-colors">{match.teams}</h3>
                <div className="text-right">
                  <p className="text-gray-500 text-xs uppercase font-bold">Prize Pool</p>
                  <p className="text-green-400 font-black text-xl">{match.poolSize}</p>
                </div>
              </div>

              {/* ⚡ Rendered with 'Contest Lock' label for professional feel */}
              <MatchCardTimers matchStartTime="07:30 PM" betCutoffTime="07:00 PM" />

              <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                <p className="text-gray-400 text-sm">Entry Fee: <span className="text-yellow-400 font-bold">{match.entryFee}</span></p>
                <button className="bg-yellow-400 text-black font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider">Create Team</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 max-w-7xl mx-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Control Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-6 gap-4">
        <button onClick={() => setSelectedMatch(null)} className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 font-bold uppercase text-xs cursor-pointer">
          <ArrowLeft size={16} /> All Matches
        </button>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-white">{selectedMatch.teams}</h2>
          <p className="text-xs text-yellow-400/60 font-bold uppercase tracking-widest">{selectedMatch.title}</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto justify-end">
          <div className="bg-[#111] border border-white/5 px-4 py-2 rounded-xl text-center min-w-[100px]">
            <p className="text-gray-500 text-[10px] font-bold uppercase">Squad</p>
            <p className="text-white font-black text-lg">{selectedPlayers.length}/11</p>
          </div>
          <div className="bg-[#111] border border-white/5 px-4 py-2 rounded-xl text-center min-w-[100px]">
            <p className="text-gray-500 text-[10px] font-bold uppercase">Credits</p>
            <p className="text-yellow-400 font-black text-lg">{creditsLeft.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: 22 Players Selection Roster Pool */}
        <div className="lg:col-span-5 space-y-2 max-h-[680px] overflow-y-auto pr-2">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Available Roster ({selectedMatch.players.length})</h4>
          {selectedMatch.players.map((player) => {
            const isPicked = selectedPlayers.find(p => p.id === player.id);
            return (
              <div 
                key={player.id} 
                onClick={() => togglePlayer(player)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${isPicked ? 'bg-yellow-400/10 border-yellow-400' : 'bg-[#111] border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${player.team === 'CSK' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="font-bold text-white text-md">{player.name}</p>
                    <span className="bg-white/5 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{player.role} - {player.team}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-white font-black text-sm">{player.points}</p>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isPicked ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-white/10 text-transparent'}`}>
                    <CheckCircle2 size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side Panel: Interactive Tabs System (Ground View + Captaincy Selector) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex bg-[#111] border border-white/5 p-1 rounded-xl gap-2">
            <button onClick={() => setRightPanelTab('ground')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase rounded-lg transition-all ${rightPanelTab === 'ground' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}>
              <LayoutGrid size={14} /> Ground Arena View
            </button>
            <button onClick={() => setRightPanelTab('captain')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase rounded-lg transition-all ${rightPanelTab === 'captain' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}>
              <Star size={14} /> Choose Captaincy Crew
            </button>
          </div>

          {rightPanelTab === 'ground' ? (
            /* ================= REAL 3D CRICKET STADIUM GROUND LAYER ================= */
            <div className="relative w-full aspect-[4/4.5] bg-gradient-to-b from-[#143d1c] via-[#1b5226] to-[#0f3316] rounded-3xl border border-green-500/20 overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-[15%] border border-dashed border-white/15 rounded-full pointer-events-none z-0" />
              <div className="absolute top-[22%] bottom-[18%] left-[46%] right-[46%] bg-gradient-to-r from-[#d9bfa2] via-[#e2caa8] to-[#d9bfa2] border-x border-white/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.15)] rounded-xs z-0">
                <div className="absolute top-[10%] left-0 right-0 h-[1px] bg-white/40" />
                <div className="absolute bottom-[10%] left-0 right-0 h-[1px] bg-white/40" />
                <div className="absolute top-[8%] left-[30%] right-[30%] h-[2px] bg-amber-800/40 rounded" />
                <div className="absolute bottom-[8%] left-[30%] right-[30%] h-[2px] bg-amber-800/40 rounded" />
              </div>

              {selectedPlayers.map((player) => (
                <div 
                  key={player.id} 
                  style={{ top: player.coords.top, left: player.coords.left }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-300"
                >
                  <div className="relative">
                    {captain === player.id && <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow z-20">C</span>}
                    {viceCaptain === player.id && <span className="absolute -top-2 -right-2 bg-blue-400 text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow z-20">VC</span>}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] border-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${player.team === 'CSK' ? 'bg-yellow-500 border-yellow-300 text-black' : 'bg-blue-600 border-blue-400 text-white'}`}>
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="bg-black/85 px-1.5 py-0.5 rounded-md mt-1 border border-white/10 flex flex-col items-center shadow-md min-w-[55px]">
                    <p className="text-[9px] font-black text-white tracking-tight truncate max-w-[50px]">{player.name.split(' ').pop()}</p>
                    <p className="text-[6.5px] text-yellow-400 font-bold uppercase tracking-wide mt-0.5">{player.posName}</p>
                  </div>
                </div>
              ))}

              {selectedPlayers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest bg-black/70 px-4 py-2 rounded-xl border border-white/5">Select players to deploy them on real positions</p>
                </div>
              )}
            </div>
          ) : (
            /* ================= CAPTAINCY CREW CONFIG BOX PANEL ================= */
            <div className="w-full aspect-[4/4.5] bg-[#111] border border-white/5 rounded-3xl p-6 overflow-y-auto space-y-3">
              <div>
                <h4 className="text-md font-bold text-white uppercase tracking-tight">Assign Multipliers</h4>
                <p className="text-gray-500 text-xs">Captain gives <span className="text-yellow-400 font-bold">2x</span> points & Vice-Captain gives <span className="text-blue-400 font-bold">1.5x</span> points</p>
              </div>
              {selectedPlayers.length === 0 ? (
                <div className="h-[75%] flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-500 text-sm">Pehle roster pool se 11 players select karo bhai, phir yahan captaincy assign hogi.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-[#161616] border border-white/5 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-white">{player.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{player.posName} • {player.team}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setCaptain(player.id); if (viceCaptain === player.id) setViceCaptain(null); }} className={`w-10 h-8 text-xs font-black rounded-lg border transition-all ${captain === player.id ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>C</button>
                        <button onClick={() => { setViceCaptain(player.id); if (captain === player.id) setCaptain(null); }} className={`w-10 h-8 text-xs font-black rounded-lg border transition-all ${viceCaptain === player.id ? 'bg-blue-400 border-blue-400 text-black' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>VC</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Master Submit Action Trigger Contest CTA */}
          <button
            disabled={selectedPlayers.length !== 11 || !captain || !viceCaptain}
            onClick={() => {
              const entryCost = parseFloat(selectedMatch.entryFee);
              if (currentBalance < entryCost) {
                alert("Insufficient SOLT Balance!");
                return;
              }
              onBalanceUpdate(-entryCost);
              alert(`🚀 Web3 Team Locked successfully! Pool Entered.`);
              setSelectedMatch(null);
              if (onTeamLocked) onTeamLocked();
            }}
            className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-2 tracking-wider uppercase text-sm transition-all ${selectedPlayers.length === 11 && captain && viceCaptain ? 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
          >
            <Coins size={18} /> 
            {selectedPlayers.length !== 11 ? `Select ${11 - selectedPlayers.length} More Players` : (!captain || !viceCaptain) ? 'Assign C & VC Roles (Go to Captaincy Tab)' : `Join Contest (${selectedMatch.entryFee})`}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dream11;