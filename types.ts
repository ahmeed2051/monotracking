
export interface Player {
  id: string;
  name: string;
  color: string;
  isHost: boolean;
  balance: number;
  isBanker: boolean;
}

export enum TransactionType {
  PAY_PLAYER = 'PAY_PLAYER',
  PAY_BANK = 'PAY_BANK',
  RECEIVE_FROM_BANK = 'RECEIVE_FROM_BANK',
  PASS_GO = 'PASS_GO',
  FREE_PARKING = 'FREE_PARKING',
  MANUAL_ADJUST = 'MANUAL_ADJUST',
}

export interface TransactionPayload {
  fromPlayerId: string;
  toPlayerId?: string; // Optional for bank transactions
  amount: number;
  reason: string;
}

export interface Proposal {
  id: string;
  proposerId: string;
  type: TransactionType;
  payload: TransactionPayload;
  timestamp: number;
  // In a real crypto implementation, this would be a signature
  signature: string; 
}

export interface Vote {
  proposalId: string;
  voterId: string;
  approved: boolean;
}

export interface LedgerEntry {
  id: string;
  type: 'TRANSACTION' | 'SYSTEM';
  message: string;
  timestamp: number;
  proposal?: Proposal;
}

export enum GamePhase {
    LOBBY = 'LOBBY',
    IN_GAME = 'IN_GAME',
}

export interface GameSettings {
    startingBalance: number;
    passGoAmount: number;
    freeParkingJackpot: boolean;
}

export interface GameState {
  gameId: string;
  phase: GamePhase;
  players: Player[];
  ledger: LedgerEntry[];
  settings: GameSettings;
  activeProposal: Proposal | null;
  votes: Vote[];
}
