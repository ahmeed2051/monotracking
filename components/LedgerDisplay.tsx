
import React from 'react';
import { LedgerEntry } from '../types';

interface LedgerDisplayProps {
  entries: LedgerEntry[];
}

const LedgerDisplay: React.FC<LedgerDisplayProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner p-4 h-64 overflow-y-auto">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Audit Log</h3>
      <ul className="space-y-2">
        {sortedEntries.map(entry => (
          <li key={entry.id} className="text-sm p-2 rounded bg-gray-50 dark:bg-gray-700">
            <span className="font-mono text-gray-500 dark:text-gray-400 mr-2">
              [{new Date(entry.timestamp).toLocaleTimeString()}]
            </span>
            <span className={`font-semibold ${entry.type === 'SYSTEM' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-800 dark:text-gray-200'}`}>
              {entry.message}
            </span>
          </li>
        ))}
        {entries.length === 0 && (
             <p className="text-center text-gray-500 dark:text-gray-400">No transactions yet.</p>
        )}
      </ul>
    </div>
  );
};

export default LedgerDisplay;
