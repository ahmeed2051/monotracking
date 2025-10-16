import React, { useState } from 'react';
import Button from './Button';

interface AddPlayerModalProps {
  onAddPlayer: (name: string) => void;
  onClose: () => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ onAddPlayer, onClose }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      alert('Please enter a name for the player.');
      return;
    }
    onAddPlayer(playerName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Player Locally</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Player Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bank-green focus:border-bank-green"
              placeholder="e.g., The Dog"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Player</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlayerModal;
