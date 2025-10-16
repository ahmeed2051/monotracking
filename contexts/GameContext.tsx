
import React, { createContext, useReducer, Dispatch, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import { GameState, GamePhase, Player, LedgerEntry, Proposal, Vote, GameSettings } from '../types';
import { BANK_PLAYER_ID, DEFAULT_GAME_SETTINGS } from '../constants';

type GameAction =
  | { type: 'SETUP_GAME'; payload: { hostPlayer: Player; settings: GameSettings; gameId: string } }
  | { type: 'SET_STATE'; payload: GameState }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'START_PROPOSAL'; payload: Proposal }
  | { type: 'ADD_VOTE'; payload: Vote }
  | { type: 'COMMIT_PROPOSAL' }
  | { type: 'REJECT_PROPOSAL' }
  | { type: 'ADD_LEDGER_ENTRY'; payload: Omit<LedgerEntry, 'id' | 'timestamp'> };

const initialState: GameState = {
  gameId: '',
  phase: GamePhase.LOBBY,
  players: [],
  ledger: [],
  settings: DEFAULT_GAME_SETTINGS,
  activeProposal: null,
  votes: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SETUP_GAME':
        const {hostPlayer, settings, gameId} = action.payload;
        return {
            ...initialState,
            gameId,
            players: [hostPlayer],
            settings,
            ledger: [{ id: Date.now().toString(), type: 'SYSTEM', message: `${hostPlayer.name} created the game.`, timestamp: Date.now()}]
        };

    case 'SET_STATE':
        return action.payload;

    case 'ADD_PLAYER':
        if (state.players.some(p => p.id === action.payload.id)) return state;
        return {
            ...state,
            players: [...state.players, action.payload],
        };
    
    case 'START_PROPOSAL':
        return { ...state, activeProposal: action.payload, votes: [] };

    case 'ADD_VOTE':
        if (state.votes.some(v => v.voterId === action.payload.voterId)) return state;
        return { ...state, votes: [...state.votes, action.payload] };

    case 'COMMIT_PROPOSAL':
        if (!state.activeProposal) return state;
        const { payload } = state.activeProposal;
        const newPlayers = state.players.map(p => {
            if (p.id === payload.fromPlayerId) {
                return { ...p, balance: p.balance - payload.amount };
            }
            if (p.id === payload.toPlayerId) {
                return { ...p, balance: p.balance + payload.amount };
            }
            return p;
        });
        const ledgerMessage = payload.toPlayerId === BANK_PLAYER_ID 
            ? `${newPlayers.find(p=>p.id === payload.fromPlayerId)?.name} paid the bank $${payload.amount}. Reason: ${payload.reason}`
            : payload.fromPlayerId === BANK_PLAYER_ID
            ? `${newPlayers.find(p=>p.id === payload.toPlayerId)?.name} received $${payload.amount} from the bank. Reason: ${payload.reason}`
            : `${newPlayers.find(p=>p.id === payload.fromPlayerId)?.name} paid ${newPlayers.find(p=>p.id === payload.toPlayerId)?.name} $${payload.amount}. Reason: ${payload.reason}`;

        return {
            ...state,
            players: newPlayers,
            activeProposal: null,
            votes: [],
            ledger: [
                ...state.ledger, 
                { id: Date.now().toString(), type: 'TRANSACTION', message: ledgerMessage, timestamp: Date.now(), proposal: state.activeProposal }
            ],
        };

    case 'REJECT_PROPOSAL':
        return { ...state, activeProposal: null, votes: [] };

    case 'ADD_LEDGER_ENTRY':
        const newEntry: LedgerEntry = {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: Date.now()
        }
        return {...state, ledger: [...state.ledger, newEntry]};

    default:
      return state;
  }
}

const GameContext = createContext<{ state: GameState; dispatch: Dispatch<GameAction> }>({
  state: initialState,
  dispatch: () => null,
});

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // This is a placeholder for actual P2P logic.
  // In a real app, a service would handle WebRTC/BroadcastChannel communication
  // and dispatch actions based on received messages.
  const [isP2PReady, setIsP2PReady] = useState(false);

  const handleP2PMessage = useCallback((event: MessageEvent) => {
    const { action, data } = event.data;
    console.log('Received P2P message:', action, data);
    // Here, you would validate the message signature before dispatching
    dispatch({ type: action, payload: data });
  }, []);

  useEffect(() => {
    // Simulate P2P connection setup
    const channel = new BroadcastChannel('monopoly-tracker');
    channel.onmessage = handleP2PMessage;
    
    // Make dispatch available globally for simulation
    (window as any).broadcastAction = (action: GameAction) => {
        channel.postMessage({action: action.type, data: (action as any).payload});
    };
    
    setIsP2PReady(true);
    
    return () => {
        channel.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);
