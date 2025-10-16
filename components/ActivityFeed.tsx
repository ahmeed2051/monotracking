
import React from 'react';
import { LedgerEntry } from '../types';

const SystemIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const VoteSuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const VoteFailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;

const getEntryStyle = (entry: LedgerEntry) => {
  const lowerCaseMessage = entry.message.toLowerCase();
  if (entry.type === 'TRANSACTION' || lowerCaseMessage.includes('paid')) {
    return { icon: <VoteSuccessIcon />, color: 'text-green-600 dark:text-green-400' };
  }
  if (lowerCaseMessage.includes('rejected')) {
    return { icon: <VoteFailIcon />, color: 'text-red-600 dark:text-red-400' };
  }
  if (lowerCaseMessage.includes('joined')) {
    return { icon: <SystemIcon />, color: 'text-blue-600 dark:text-blue-400' };
  }
  return { icon: <SystemIcon />, color: 'text-purple-600 dark:text-purple-400' };
};

interface ActivityFeedProps {
  entries: LedgerEntry[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner p-4 h-96 overflow-y-auto">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 sticky top-0 bg-white dark:bg-gray-800 py-2 -mt-4 -mx-4 px-4 border-b dark:border-gray-700">Activity Feed</h3>
      <ul className="space-y-3">
        {sortedEntries.map(entry => {
          const { icon, color } = getEntryStyle(entry);
          return (
            <li key={entry.id} className="flex items-start text-sm p-2 rounded bg-gray-50 dark:bg-gray-700/50">
              <span className={`mr-3 mt-1 flex-shrink-0 ${color}`}>{icon}</span>
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {entry.message}
                </span>
                <span className="block font-mono text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            </li>
          );
        })}
        {entries.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No activity yet.</p>
        )}
      </ul>
    </div>
  );
};

export default ActivityFeed;
