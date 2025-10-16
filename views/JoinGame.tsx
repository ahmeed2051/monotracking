
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { useGame } from '../contexts/GameContext';
import Button from '../components/Button';
import { PLAYER_COLORS } from '../constants';

const JoinGame: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  const handleScanSuccess = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      if (data.gameId && data.hostId) {
        setScanResult(decodedText);
        setError('');
      } else {
        setError('Invalid QR code. Does not contain game info.');
      }
    } catch (e) {
      setError('Failed to parse QR code. Please scan a valid game code.');
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !scanResult) return;
    
    // This is where you would connect to the P2P network using the scanResult info.
    // We will simulate this by dispatching an action. The host would receive this
    // via the P2P channel and add the player to the state, then broadcast the new state.
    
    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newPlayer = {
      id: playerId,
      name: playerName,
      color: PLAYER_COLORS[state.players.length % PLAYER_COLORS.length] || '#cccccc',
      isHost: false,
      balance: state.settings.startingBalance || 1500,
      isBanker: false,
    };
    
    // This action would be broadcast to all peers in a real app
    (window as any).broadcastAction({ type: 'ADD_PLAYER', payload: newPlayer });
    (window as any).broadcastAction({ type: 'ADD_LEDGER_ENTRY', payload: { type: 'SYSTEM', message: `${newPlayer.name} has joined the game.` } });

    navigate('/game', { state: { myId: playerId } });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-bank-green dark:text-bank-light-green">Join Game</h2>
        
        {!scanResult ? (
          <div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">Scan the QR code displayed on the host's device.</p>
            <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2">
                <QRScanner onScanSuccess={handleScanSuccess} />
            </div>
            {error && <p className="text-go-red mt-4">{error}</p>}
          </div>
        ) : (
          <form onSubmit={handleJoinGame} className="space-y-6">
            <p className="text-lg text-green-600 dark:text-green-400 font-semibold">✓ Game Code Scanned!</p>
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bank-green focus:border-bank-green"
                placeholder="e.g., Top Hat"
                required
              />
            </div>
            <Button type="submit" className="w-full text-lg">
              Join the Table
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinGame;
