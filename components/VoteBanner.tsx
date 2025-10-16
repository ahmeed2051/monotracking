
import React from 'react';
import { Proposal, Player } from '../types';
import Button from './Button';

interface VoteBannerProps {
  proposal: Proposal;
  players: Player[];
  onVote: (approved: boolean) => void;
  hasVoted: boolean;
}

const VoteBanner: React.FC<VoteBannerProps> = ({ proposal, players, onVote, hasVoted }) => {
  const proposer = players.find(p => p.id === proposal.proposerId);
  const fromPlayer = players.find(p => p.id === proposal.payload.fromPlayerId);
  const toPlayer = players.find(p => p.id === proposal.payload.toPlayerId);

  const description = `${fromPlayer?.name} wants to pay ${toPlayer ? toPlayer.name : 'the Bank'} $${proposal.payload.amount} for "${proposal.payload.reason}"`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-chest-yellow text-black p-4 shadow-2xl animate-pulse-slow z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <p className="font-bold text-lg">Transaction Proposed by {proposer?.name}</p>
          <p>{description}</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="success" onClick={() => onVote(true)} disabled={hasVoted}>
            Approve
          </Button>
          <Button variant="danger" onClick={() => onVote(false)} disabled={hasVoted}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoteBanner;
