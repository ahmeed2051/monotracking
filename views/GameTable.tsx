
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import PlayerCard from '../components/PlayerCard';
import LedgerDisplay from '../components/LedgerDisplay';
import Button from '../components/Button';
import QRCodeDisplay from '../components/QRCodeDisplay';
import VoteBanner from '../components/VoteBanner';
import { Proposal, TransactionType, Vote } from '../types';
import { BANK_PLAYER_ID } from '../constants';

const GameTable: React.FC = () => {
  const { state: gameState, dispatch } = useGame();
  const location = useLocation();
  const { joinInfo, isHost, myId } = location.state || {};

  const [showInviteModal, setShowInviteModal] = useState(isHost);
  
  const me = gameState.players.find(p => p.id === myId);
  const myVote = gameState.votes.find(v => v.voterId === myId);

  const handleProposeTransaction = () => {
    // This is a sample transaction. A real UI would have forms for this.
    const otherPlayer = gameState.players.find(p => p.id !== myId);
    if (!me || !otherPlayer) return;

    const proposal: Proposal = {
      id: `prop_${Date.now()}`,
      proposerId: myId,
      type: TransactionType.PAY_PLAYER,
      payload: {
        fromPlayerId: myId,
        toPlayerId: otherPlayer.id,
        amount: 50,
        reason: 'Rent for Boardwalk'
      },
      timestamp: Date.now(),
      signature: 'signed_by_' + myId // Placeholder for real signature
    };
    (window as any).broadcastAction({ type: 'START_PROPOSAL', payload: proposal });
  };
  
  const handleVote = (approved: boolean) => {
    if (!gameState.activeProposal || !myId) return;
    const vote: Vote = {
      proposalId: gameState.activeProposal.id,
      voterId: myId,
      approved,
    };
    (window as any).broadcastAction({ type: 'ADD_VOTE', payload: vote });
  };
  
  // In a real distributed system, each node would run this logic. Here, we simplify.
  // Let's assume the host is responsible for tallying votes for this simulation.
  if (isHost && gameState.activeProposal && gameState.votes.length >= gameState.players.length) {
    const approvals = gameState.votes.filter(v => v.approved).length;
    const quorum = Math.floor(gameState.players.length / 2) + 1;
    
    if (approvals >= quorum) {
        (window as any).broadcastAction({ type: 'COMMIT_PROPOSAL' });
    } else {
        (window as any).broadcastAction({ type: 'REJECT_PROPOSAL' });
        (window as any).broadcastAction({ type: 'ADD_LEDGER_ENTRY', payload: { type: 'SYSTEM', message: `Proposal rejected by vote.` } });
    }
  }


  return (
    <div className="container mx-auto p-4 pb-32">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-bank-green dark:text-bank-light-green">Game Table</h1>
        <Button variant="secondary" onClick={() => setShowInviteModal(true)}>Invite Players</Button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold">Players</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {gameState.players.map(player => (
              <PlayerCard key={player.id} player={player} isCurrentUser={player.id === myId} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Actions</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-2">
            <Button className="w-full" onClick={handleProposeTransaction} disabled={!me || !!gameState.activeProposal}>Propose Test Payment</Button>
            <Button className="w-full" variant="secondary" disabled={!me}>Pass Go (+$200)</Button>
            <Button className="w-full" variant="danger" disabled={!me}>Pay Tax ($100)</Button>
          </div>
          <LedgerDisplay entries={gameState.ledger} />
        </div>
      </main>

      {gameState.activeProposal && (
        <VoteBanner 
            proposal={gameState.activeProposal} 
            players={gameState.players}
            onVote={handleVote}
            hasVoted={!!myVote}
        />
      )}

      {showInviteModal && joinInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Invite Players to Join</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Other players can scan this QR code to join the game.</p>
            <QRCodeDisplay value={joinInfo} />
            <Button className="mt-8" onClick={() => setShowInviteModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTable;
