import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Game from "./Game";

const StarMatch = () => {
    const[gameId, setGameId] = useState(1);
    return<Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <>
          <StarMatch />
      </>
  </React.StrictMode>
);

