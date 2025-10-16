
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Lobby from './views/Lobby';
import CreateGame from './views/CreateGame';
import JoinGame from './views/JoinGame';
import GameTable from './views/GameTable';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Lobby />} />
            <Route path="/create" element={<CreateGame />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/game" element={<GameTable />} />
          </Routes>
        </HashRouter>
      </div>
    </GameProvider>
  );
}

export default App;
