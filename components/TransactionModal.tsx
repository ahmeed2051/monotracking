import React, { useState, useEffect } from 'react';
import { Player, TransactionType, GameSettings } from '../types';
import { BANK_PLAYER_ID } from '../constants';
import Button from './Button';
import { TransactionPayload } from '../types';

interface TransactionModalProps {
  me: Player;
  players: Player[];
  settings: GameSettings;
  onPropose: (payload: TransactionPayload, type: TransactionType) => void;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ me, players, settings, onPropose, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.PAY_PLAYER);
  const [amount, setAmount] = useState<number | string>('');
  const [reason, setReason] = useState('');
  
  // State for PAY_PLAYER
  const [fromPlayerId, setFromPlayerId] = useState<string>(me.id);
  const [toPlayerId, setToPlayerId] = useState<string>('');
  
  // State for MANUAL_ADJUST
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'deduct'>('add');
  const [targetPlayerId, setTargetPlayerId] = useState<string>('');


  const toPlayerOptions = players.filter(p => p.id !== fromPlayerId);

  useEffect(() => {
    // Auto-fill form for specific types
    if (type === TransactionType.PASS_GO) {
      setAmount(settings.passGoAmount);
      setReason('Passed GO');
    } else {
        setAmount('');
        setReason('');
    }
  }, [type, settings.passGoAmount]);
  
  useEffect(() => {
    // If the selected 'toPlayer' is the same as the new 'fromPlayer', reset it
    if (toPlayerId === fromPlayerId) {
        setToPlayerId('');
    }
  }, [fromPlayerId, toPlayerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
        alert('Amount must be positive.');
        return;
    }
    if (!reason.trim()) {
        alert('Please provide a reason.');
        return;
    }

    let finalPayload: TransactionPayload | null = null;

    switch (type) {
        case TransactionType.PAY_PLAYER:
            if (!toPlayerId || !fromPlayerId) { alert('Please select both a paying and receiving player.'); return; }
            if (fromPlayerId === toPlayerId) { alert('Players cannot pay themselves.'); return; }
            finalPayload = { fromPlayerId, toPlayerId, amount: numericAmount, reason };
            break;
        case TransactionType.PAY_BANK:
            finalPayload = { fromPlayerId: me.id, toPlayerId: BANK_PLAYER_ID, amount: numericAmount, reason };
            break;
        case TransactionType.RECEIVE_FROM_BANK:
            finalPayload = { fromPlayerId: BANK_PLAYER_ID, toPlayerId: me.id, amount: numericAmount, reason };
            break;
        case TransactionType.PASS_GO:
            finalPayload = { fromPlayerId: BANK_PLAYER_ID, toPlayerId: me.id, amount: numericAmount, reason };
            break;
        case TransactionType.MANUAL_ADJUST:
            if (!targetPlayerId) { alert('Please select a player for the adjustment.'); return; }
            finalPayload = {
                fromPlayerId: adjustmentType === 'add' ? BANK_PLAYER_ID : targetPlayerId,
                toPlayerId: adjustmentType === 'add' ? targetPlayerId : BANK_PLAYER_ID,
                amount: numericAmount,
                reason,
            };
            break;
        default:
            alert('Invalid transaction type.');
            return;
    }

    if (finalPayload) {
        onPropose(finalPayload, type);
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case TransactionType.PAY_PLAYER:
        return (
          <>
            <div>
              <label htmlFor="fromPlayerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Player</label>
              <select id="fromPlayerId" value={fromPlayerId} onChange={e => setFromPlayerId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-bank-green focus:border-bank-green">
                {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="toPlayerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Player</label>
              <select id="toPlayerId" value={toPlayerId} onChange={e => setToPlayerId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-bank-green focus:border-bank-green">
                <option value="" disabled>Select a player...</option>
                {toPlayerOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required min="1" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
                <input type="text" id="reason" value={reason} onChange={e => setReason(e.target.value)} required placeholder="e.g., Rent for Boardwalk" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
            </div>
          </>
        );
      case TransactionType.PAY_BANK:
        return (
          <>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium">Amount to Pay Bank</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required min="1" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
                <input type="text" id="reason" value={reason} onChange={e => setReason(e.target.value)} required placeholder="e.g., Income Tax" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
            </div>
          </>
        );
      case TransactionType.RECEIVE_FROM_BANK:
      case TransactionType.PASS_GO:
        const isPassGo = type === TransactionType.PASS_GO;
        return (
          <>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium">Amount from Bank</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required readOnly={isPassGo} min="1" className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm ${isPassGo ? 'bg-gray-200 dark:bg-gray-600' : ''}`} />
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
                <input type="text" id="reason" value={reason} onChange={e => setReason(e.target.value)} required readOnly={isPassGo} className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm ${isPassGo ? 'bg-gray-200 dark:bg-gray-600' : ''}`} />
            </div>
          </>
        );
      case TransactionType.MANUAL_ADJUST:
        return (
          <>
            <div>
              <label htmlFor="targetPlayerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Player</label>
              <select id="targetPlayerId" value={targetPlayerId} onChange={e => setTargetPlayerId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-bank-green focus:border-bank-green">
                <option value="" disabled>Select a player...</option>
                {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="adjustmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
                <select id="adjustmentType" value={adjustmentType} onChange={e => setAdjustmentType(e.target.value as 'add'|'deduct')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-bank-green focus:border-bank-green">
                    <option value="add">Add to Balance</option>
                    <option value="deduct">Deduct from Balance</option>
                </select>
            </div>
             <div>
                <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required min="1" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
                <input type="text" id="reason" value={reason} onChange={e => setReason(e.target.value)} required placeholder="e.g., Bank error in your favor" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
            </div>
          </>
        );
      default: return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Propose Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tx-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
            <select id="tx-type" value={type} onChange={e => setType(e.target.value as TransactionType)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-bank-green focus:border-bank-green">
              <option value={TransactionType.PAY_PLAYER}>Pay another player</option>
              <option value={TransactionType.PAY_BANK}>Pay the bank</option>
              <option value={TransactionType.RECEIVE_FROM_BANK}>Receive from bank</option>
              <option value={TransactionType.PASS_GO}>Pass GO</option>
              <option value={TransactionType.MANUAL_ADJUST}>Manual Adjustment</option>
            </select>
          </div>
          {renderFormFields()}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Propose</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;