
import React from 'react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  isCurrentUser?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isCurrentUser = false }) => {
  return (
    <div className={`p-4 rounded-lg shadow-lg border-2 ${isCurrentUser ? 'border-chance-orange' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800`}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: player.color }}>
          <span className="text-2xl font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg truncate text-gray-900 dark:text-gray-100">{player.name} {isCurrentUser && '(You)'}</p>
          <p className={`text-2xl font-mono font-extrabold ${player.balance >= 0 ? 'text-bank-light-green' : 'text-go-red'} dark:text-green-400`}>
            ${player.balance.toLocaleString()}
          </p>
        </div>
        {player.isHost && (
          <div title="Host" className="text-chest-yellow dark:text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
