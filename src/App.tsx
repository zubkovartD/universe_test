import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Board from './components/Board/Board';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Board />
      </BrowserRouter>
    </div>
  );
}

export default App;
