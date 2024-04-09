//each inner array is a row of the gameboard, rows 0 1 2
const gameBoard = function () {
    const board =  [];
    const squares = 9;
    for (let i = 0; i < squares; i++) {
        board.push(cell());
    }
    
    //get our board while keeping board as a private variable 
    const getBoard = () => board;
    //player chooses square to enter their mark
    const chooseMark = (square, player) => {
        board[square].addMark(player);
    
    }
    // shows us or board with just the values (original board has an object for each index)
    const printBoard = () => {
        const boardValues = board.map((cell) => cell.getValue());
        console.log(boardValues);
    }

    return {getBoard, chooseMark, printBoard};
};



function cell() {
    let value = 0;

    //accept player's marker to change cell value 
    const addMark = (player) => {
        value = player;
    }
    //get square value while keeping value private
    const getValue = () => value;

    return {addMark, getValue};
}

//conrol flow of the game 
function gameController(
    playerOneName = "Player One", 
    PlayerTwoName = "Player Two"
    ) {
    const board = gameBoard();
    
    
    

    const players = [
        {name: playerOneName, mark: 1},
        {name: PlayerTwoName, mark: 2}
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1]
        } else {
            activePlayer = players[0]
        };
    }
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        //add mark for the current player
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (square) => {
        if (!(board.getBoard()[square].getValue() === 0)) {
            console.log(`Square has already been marked`);
            return;
        }
        console.log(`${getActivePlayer.name} marks sqaure ${square}`);
        board.chooseMark(square,getActivePlayer().mark);

        //check for winner and display win message 
        const boardValues = board.getBoard().map((cell) => cell.getValue());
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        const hasWinner = winningConditions.some(array => {
            return (array.every(index => boardValues[index] === 1) ||
                array.every(index => boardValues[index] === 2))
        })
        if (hasWinner) {
                board.printBoard();
                console.log(`${getActivePlayer().name} wins!`);

                return;
            };
        //switch player turn
        
        switchPlayerTurn();
        printNewRound();
    }
    //initial play game message 
    printNewRound();

    return {playRound, board, getActivePlayer}
}

function userControls() {
    const squareList = document.querySelectorAll('.square');
    let squareId;

    const game = gameController();

    
    squareList.forEach((square) => {
        const clickSquare = () => {
            squareId = square.id;
            game.playRound(squareId)

            const boardValues = game.board.getBoard().map((cell) => cell.getValue());

            const squareDiv = document.getElementById(squareId);

            if (boardValues[square.id] === 1) {
                const xMark = document.createElement('p');
                xMark.classList.add('xMark');
                xMark.textContent = 'X';
                squareDiv.appendChild(xMark);
            }
            if (boardValues[square.id] === 2) {
                const oMark = document.createElement('p');
                oMark.classList.add('oMark');
                oMark.textContent = 'O';
                squareDiv.appendChild(oMark);
            }
        }
        square.addEventListener('click', clickSquare)
    })
    
    
    return {squareList}
}

const startGame = userControls();



