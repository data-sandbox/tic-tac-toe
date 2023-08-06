// factory function
function Cell() {
  let value = 0;

  const addToken = (player) => value = player;

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

// module
const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const addToken = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
      console.log('Move not available. Try again');
      return false;
    }
    board[row][column].addToken(player);
    return true;
  };

  const getBoardValues = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    return boardWithCellValues;
  }

  const printBoard = () => {
    console.log(getBoardValues());
  };

  return {
    getBoard,
    getBoardValues,
    addToken,
    printBoard,
  }
});


// module
const GameController = ((playerOneName = "Player One",
  playerTwoName = "Player Two") => {

  const board = Gameboard();
  let isGameOver = false;

  const players = [
    {
      name: playerOneName,
      token: 1
    },
    {
      name: playerTwoName,
      token: 2
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkWinner = () => {
    const boardArray = board.getBoardValues();
    const isActivePlayer = (value) => value === getActivePlayer().token;
    const rows = boardArray.length;
    const columns = boardArray[0].length;

    // 3 in a row
    for (let i = 0; i < rows; i++) {
      if (boardArray[i].every(isActivePlayer)) {
        // console.log(boardArray[i]);
        return true;
      }
    }
    // 3 in a column
    for (let j = 0; j < columns; j++) {
      const column = [];
      for (let i = 0; i < rows; i++) {
        column.push(boardArray[i][j]);
      }
      if (column.every(isActivePlayer)) {
        // console.log({ column });
        return true;
      }
    }
    // diagonal backslash
    const diagonalBack = [];
    for (let i = 0; i < rows; i++) {
      if (rows !== columns) {
        console.log('Error: Rows must equal columns for diagonal check logic')
      }
      diagonalBack.push(boardArray[i][i]);
    }
    if (diagonalBack.every(isActivePlayer)) {
      // console.log({ diagonalBack });
      return true;
    }
    // diagonal forward slash
    const diagonalForward = [];
    for (let i = (rows - 1); i >= 0; i--) {
      if (rows !== columns) {
        console.log('Error: Rows must equal columns for diagonal check logic')
      }
      diagonalForward.push(boardArray[i][Math.abs(rows - 1 - i)]);
    }
    if (diagonalForward.every(isActivePlayer)) {
      // console.log({ diagonalForward });
      return true;
    }
    return false;
  };

  const printWinner = () => {
    console.log(`${getActivePlayer().name} wins!`);
  }

  const getIsGameOver = () => isGameOver;

  const playRound = (row, column) => {
    // Check if move is valid first
    const moveValid = board.addToken(row, column, getActivePlayer().token);

    if (moveValid) {
      console.log(
        `Adding ${getActivePlayer().name}'s token to row ${row}, column ${column}`
      );
    } else {
      return;
    }

    const isWinner = checkWinner();

    if (isWinner) {
      printWinner();
      board.printBoard();
      isGameOver = true;
      console.log(getIsGameOver());
    } else {
      switchPlayerTurn();
      printNewRound();
    }
  };

  const resetGame = () => {
    const board = Gameboard();
    let isGameOver = false;

    const players = [
      {
        name: playerOneName,
        token: 1
      },
      {
        name: playerTwoName,
        token: 2
      }
    ];

    let activePlayer = players[0];
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getIsGameOver,
    resetGame,
  };
});

let game = GameController();

// 3 in a row
// game.playRound(1, 1);
// game.playRound(0, 0);
// game.playRound(0, 0);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(2, 2);
// game.playRound(0, 2);

// 3 in a column
// game.playRound(0, 0);
// game.playRound(0, 2);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(2, 0);

// diagonal backslash
// game.playRound(0, 0);
// game.playRound(0, 2);
// game.playRound(1, 1);
// game.playRound(0, 1);
// game.playRound(2, 2);

// diagonal forward slash
game.playRound(0, 2);
game.playRound(1, 2);
game.playRound(1, 1);
game.playRound(0, 1);
game.playRound(2, 0);

// GameController.playRound(1, 1);

const ScreenController = (() => {

  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const restartButton = document.querySelector('.restart');

  const updateScreen = () => {

    const activePlayer = game.getActivePlayer();

    if (game.getIsGameOver()) {
      playerTurnDiv.textContent = `${activePlayer.name} Wins!`;
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s Turn`;
    }

    boardDiv.textContent = '';
    // get the newest version of the board and player turn
    const board = game.getBoard();

    // Render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function 
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })


  };

  function clickBoardHandler(e) {
    const selectedRow = e.target.dataset.row;
    const selectedCol = e.target.dataset.column;
    if (!game.getIsGameOver()) {
      game.playRound(selectedRow, selectedCol);
      updateScreen();
    }
  };

  function restartHandler() {
    game.resetGame();
  }

  boardDiv.addEventListener('click', clickBoardHandler);
  restartButton.addEventListener('click', restartHandler);

  // Initial render
  updateScreen();

});

ScreenController();
