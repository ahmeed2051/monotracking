
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Lobby: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-bank-green dark:text-bank-light-green mb-2">Monopoly Ledger</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Offline Money Tracker with Consensus</p>
      </div>
      <div className="w-full max-w-sm space-y-6">
        <Button
          variant="primary"
          className="w-full text-xl"
          onClick={() => navigate('/create')}
        >
          Create New Game
        </Button>
        <Button
          variant="secondary"
          className="w-full text-xl"
          onClick={() => navigate('/join')}
        >
          Join Game by QR
        </Button>
      </div>
      <div className="absolute bottom-4 text-center text-gray-500 text-sm">
        <p>No internet connection required. All data stays on your devices.</p>
        <p>Built for local, in-person gameplay.</p>
      </div>
    </div>
  );
};

export default Lobby;
