import React from 'react';
import { Proposal, Player, Vote, TransactionType } from '../types';
import Button from './Button';
import { BANK_PLAYER_ID } from '../constants';

interface VoteModalProps {
  proposal: Proposal;
  players: Player[];
  votes: Vote[];
  onPlayerVote: (voterId: string, approved: boolean) => void;
}

const VoteBanner: React.FC<VoteModalProps> = ({ proposal, players, votes, onPlayerVote }) => {
  const { type, payload } = proposal;
  const proposer = players.find(p => p.id === proposal.proposerId);
  const fromPlayer = players.find(p => p.id === payload.fromPlayerId);
  const toPlayer = players.find(p => p.id === payload.toPlayerId);

  const fromName = fromPlayer ? fromPlayer.name : 'The Bank';
  const toName = toPlayer ? toPlayer.name : 'The Bank';
  
  let description = '';

  if (type === TransactionType.MANUAL_ADJUST) {
    if (payload.fromPlayerId === BANK_PLAYER_ID) { // Addition
      description = `ADD $${payload.amount} to ${toName}'s balance for "${payload.reason}"`;
    } else { // Deduction
      description = `DEDUCT $${payload.amount} from ${fromName}'s balance for "${payload.reason}"`;
    }
  } else {
    description = `${fromName} pays ${toName} $${payload.amount} for "${payload.reason}"`;
  }
  
  const voteCount = votes.length;
  const requiredVotes = Math.floor(players.length / 2) + 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-bank-green dark:text-bank-light-green">Vote on Proposal</h2>
        
        <div className="text-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Proposed by <span className="font-bold">{proposer?.name || 'Unknown'}</span></p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{description}</p>
        </div>
        
        <div className="my-6">
          <h3 className="text-xl font-semibold text-center mb-4">Cast Your Votes</h3>
          <ul className="space-y-3">
            {players.map(player => {
              const vote = votes.find(v => v.voterId === player.id);
              const hasVoted = !!vote;
              return (
                <li key={player.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg shadow-sm">
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full mr-3" style={{ backgroundColor: player.color }}></div>
                     <span className="font-bold text-lg">{player.name}</span>
                  </div>
                  {hasVoted ? (
                    <div className={`font-bold text-lg px-4 py-1 rounded-full ${vote.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vote.approved ? '✓ Approved' : '✗ Rejected'}
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={() => onPlayerVote(player.id, true)} variant="success" className="px-4 py-2 text-sm">Approve</Button>
                      <Button onClick={() => onPlayerVote(player.id, false)} variant="danger" className="px-4 py-2 text-sm">Reject</Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        <p className="text-center font-semibold text-lg mt-6">
          Votes Cast: {voteCount} / {players.length} 
          <span className="mx-2 text-gray-400">|</span> 
          {requiredVotes} needed to pass
        </p>
      </div>
    </div>
  );
};

export default VoteBanner;