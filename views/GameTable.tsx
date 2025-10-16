import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import PlayerCard from '../components/PlayerCard';
import Button from '../components/Button';
import QRCodeDisplay from '../components/QRCodeDisplay';
import VoteBanner from '../components/VoteBanner';
import { Proposal, TransactionPayload, TransactionType, Vote, Player } from '../types';
import ActivityFeed from '../components/ActivityFeed';
import TransactionModal from '../components/TransactionModal';
import AddPlayerModal from '../components/AddPlayerModal';
import { PLAYER_COLORS } from '../constants';

const GameTable: React.FC = () => {
  const { state: gameState, dispatch } = useGame();
  const location = useLocation();
  const { joinInfo, isHost, myId } = location.state || {};

  const [showInviteModal, setShowInviteModal] = useState(isHost);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  
  const me = gameState.players.find(p => p.id === myId);

  const handleProposeTransaction = (payload: TransactionPayload, type: TransactionType) => {
    if (!me) return;

    const proposal: Proposal = {
      id: `prop_${Date.now()}`,
      proposerId: myId,
      type: type,
      payload,
      timestamp: Date.now(),
      signature: 'signed_by_' + myId // Placeholder for real signature
    };
    
    const action = { type: 'START_PROPOSAL' as const, payload: proposal };
    dispatch(action); // Dispatch locally for immediate UI update
    (window as any).broadcastAction(action); // Broadcast to peers
    
    setIsTransactionModalOpen(false);
  };
  
  const handlePlayerVote = (voterId: string, approved: boolean) => {
    if (!gameState.activeProposal) return;
    const vote: Vote = {
      proposalId: gameState.activeProposal.id,
      voterId,
      approved,
    };
    
    const action = { type: 'ADD_VOTE' as const, payload: vote };
    dispatch(action); // Dispatch locally
    (window as any).broadcastAction(action); // Broadcast to peers
  };
  
  const handleAddPlayer = (playerName: string) => {
    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: playerName,
      color: PLAYER_COLORS[gameState.players.length % PLAYER_COLORS.length] || '#cccccc',
      isHost: false,
      balance: gameState.settings.startingBalance || 1500,
      isBanker: false,
    };
    
    const addPlayerAction = { type: 'ADD_PLAYER' as const, payload: newPlayer };
    const addLedgerAction = { type: 'ADD_LEDGER_ENTRY' as const, payload: { type: 'SYSTEM' as const, message: `${newPlayer.name} has joined the game.` } };

    // Dispatch locally first to update the current user's UI
    dispatch(addPlayerAction);
    dispatch(addLedgerAction);
    
    // Then broadcast to other peers
    (window as any).broadcastAction(addPlayerAction);
    (window as any).broadcastAction(addLedgerAction);
    
    setIsAddPlayerModalOpen(false);
  };

  // In a real distributed system, each node would run this logic. Here, we simplify.
  // We assume the host is responsible for tallying votes for this simulation.
  // This logic is now in a useEffect to prevent issues with re-renders.
  useEffect(() => {
    if (isHost && gameState.activeProposal && gameState.votes.length >= gameState.players.length) {
      const approvals = gameState.votes.filter(v => v.approved).length;
      const quorum = Math.floor(gameState.players.length / 2) + 1;
      
      if (approvals >= quorum) {
          const action = { type: 'COMMIT_PROPOSAL' as const };
          dispatch(action); // Dispatch locally for host
          (window as any).broadcastAction(action); // Broadcast result
      } else {
          const rejectAction = { type: 'REJECT_PROPOSAL' as const };
          const ledgerAction = { type: 'ADD_LEDGER_ENTRY' as const, payload: { type: 'SYSTEM' as const, message: `Proposal rejected by vote.` } };
          dispatch(rejectAction); // Dispatch locally for host
          dispatch(ledgerAction);
          (window as any).broadcastAction(rejectAction); // Broadcast result
          (window as any).broadcastAction(ledgerAction);
      }
    }
  }, [isHost, gameState.activeProposal, gameState.votes, gameState.players, dispatch]);


  return (
    <div className="container mx-auto p-4 pb-48">
      <header className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-bank-green dark:text-bank-light-green">Game Table</h1>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="secondary" onClick={() => setIsAddPlayerModalOpen(true)}>Add Player</Button>
          <Button variant="secondary" onClick={() => setShowInviteModal(true)}>Invite (QR)</Button>
        </div>
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
          <h2 className="text-2xl font-semibold">Game Log</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-2">
            <Button className="w-full" onClick={() => setIsTransactionModalOpen(true)} disabled={!me || !!gameState.activeProposal}>
              Propose Transaction
            </Button>
          </div>
          <ActivityFeed entries={gameState.ledger} />
        </div>
      </main>

      {gameState.activeProposal && (
        <VoteBanner 
            proposal={gameState.activeProposal} 
            players={gameState.players}
            votes={gameState.votes}
            onPlayerVote={handlePlayerVote}
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
      
      {isTransactionModalOpen && me && (
        <TransactionModal 
            me={me}
            players={gameState.players}
            settings={gameState.settings}
            onPropose={handleProposeTransaction}
            onClose={() => setIsTransactionModalOpen(false)}
        />
      )}

      {isAddPlayerModalOpen && (
        <AddPlayerModal 
            onAddPlayer={handleAddPlayer}
            onClose={() => setIsAddPlayerModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GameTable;