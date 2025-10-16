
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Lobby: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f8f0] dark:bg-gray-900 p-4 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-property-blue/50 rounded-full"></div>
      <div className="absolute -bottom-24 -right-8 w-64 h-64 bg-go-red/40 rounded-full"></div>
      
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl font-extrabold text-bank-green dark:text-bank-light-green mb-2">Monopoly Ledger</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Offline Money Tracker with Consensus</p>
      </div>
      <div className="relative z-10 w-full max-w-sm space-y-6">
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
      <div className="relative z-10 mt-12 text-center text-gray-500 text-sm">
        <p>No internet connection required. All data stays on your devices.</p>
        <p>Built for local, in-person gameplay.</p>
      </div>
    </div>
  );
};

export default Lobby;
