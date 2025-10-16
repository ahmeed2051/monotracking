
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import Button from '../components/Button';
import { DEFAULT_GAME_SETTINGS, PLAYER_COLORS } from '../constants';

const CreateGame: React.FC = () => {
  const [hostName, setHostName] = useState('');
  const [startingBalance, setStartingBalance] = useState(DEFAULT_GAME_SETTINGS.startingBalance);
  const { dispatch } = useGame();
  const navigate = useNavigate();

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) {
      alert('Please enter your name.');
      return;
    }
    
    // In a real app, this would come from a crypto service
    const hostId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const gameId = `game_${Date.now()}`;
    
    const hostPlayer = {
      id: hostId,
      name: hostName,
      color: PLAYER_COLORS[0],
      isHost: true,
      balance: startingBalance,
      isBanker: true, // First player is banker by default
    };

    dispatch({ 
        type: 'SETUP_GAME', 
        payload: { 
            hostPlayer, 
            settings: { ...DEFAULT_GAME_SETTINGS, startingBalance },
            gameId,
        }
    });

    // In a real P2P implementation, you would now generate a host offer (SDP)
    // and encode it in the join info. Here we simulate it with the gameId.
    const joinInfo = JSON.stringify({ gameId, hostId });
    
    navigate('/game', { state: { joinInfo, isHost: true, myId: hostId } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-bank-green dark:text-bank-light-green">Create Game</h2>
        <form onSubmit={handleCreateGame} className="space-y-6">
          <div>
            <label htmlFor="hostName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              type="text"
              id="hostName"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bank-green focus:border-bank-green"
              placeholder="e.g., The Banker"
              required
            />
          </div>
          <div>
            <label htmlFor="startingBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Starting Balance
            </label>
            <input
              type="number"
              id="startingBalance"
              value={startingBalance}
              onChange={(e) => setStartingBalance(parseInt(e.target.value, 10))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bank-green focus:border-bank-green"
              required
            />
          </div>
          <Button type="submit" className="w-full text-lg">
            Start Game & Show QR Code
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateGame;
