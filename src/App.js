
import React, { useState, useEffect } from 'react';
import Board from './Board';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isComputer, setIsComputer] = useState(true); // Toggle for computer player
  const [winner, setWinner] = useState(null);
  const [gameStatus, setGameStatus] = useState('Your Chance'); // Default message

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setGameStatus(isXNext ? "Computer's Chance" : 'Your Chance');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameStatus('Your Chance');
  };

  // Function for the computer to make a move
  const computerMove = () => {
    if (!isXNext && isComputer) {
      const emptySquares = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
      const bestMove = minimax(board, 'O').index;
      if (emptySquares.length > 0) {
        handleClick(bestMove);
      }
    }
  };

  // Minimax algorithm for computer's best move
  const minimax = (newBoard, player) => {
    const availableSpots = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    const huPlayer = 'X';
    const aiPlayer = 'O';

    if (calculateWinner(newBoard) === huPlayer) return { score: -10 };
    if (calculateWinner(newBoard) === aiPlayer) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      newBoard[availableSpots[i]] = player;

      if (player === aiPlayer) {
        const result = minimax(newBoard, huPlayer);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availableSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinner(winner);
      setGameStatus(winner === 'X' ? 'You Win!' : 'Computer Wins!');
      alert(winner === 'X' ? 'You Win!' : 'Computer Wins!');
    } else if (!board.includes(null)) {
      setGameStatus('Draw Game');
      alert('Draw Game!');
    } else if (!isXNext && isComputer) {
      computerMove();
    }
  }, [board]);

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <Board squares={board} onClick={handleClick} />
      <div className="info">
        <p>{gameStatus}</p>
        <button onClick={resetGame}>Restart Game</button>
      </div>
    </div>
  );
};

export default App;
