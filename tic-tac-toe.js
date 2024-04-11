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
    playerTwoName = "Player Two"
    ) {
    const board = gameBoard();
    
    const players = [
        {name: playerOneName, mark: 1},
        {name: playerTwoName, mark: 2}
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1]
        } else {
            activePlayer = players[0]
            console.log(activePlayer)
        };
        turnMessageP.textContent += ` ${activePlayer.name}'s turn.`;

    }
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        
        //add mark for the current player
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }
    let hasWinner = false;
    let marked = false;
    let gameStarted =false;

    const turnMessageDiv = document.querySelector('.turn-result');
    const turnMessageP = document.createElement('p');
    turnMessageDiv.appendChild(turnMessageP);
    const gameResultDiv = document.querySelector('.game-result');
    const gameResultMessage = document.createElement('p');
    gameResultDiv.appendChild(gameResultMessage);

    const playerOneInput = document.querySelector('#player-one');
    const playerTwoInput = document.querySelector('#player-two');

    const startGame = () => {
        

        if ((playerOneInput.value === '') || (playerTwoInput.value === '')) {
            gameStarted = false;
            turnMessageP.textContent = '';
        } else {
            gameStarted = true;
        
        
        
            players[0].name = playerOneInput.value;
            players[1].name = playerTwoInput.value;
    
            turnMessageP.textContent = `${getActivePlayer().name} starts`;

            playerOneInput.value = '';
            playerTwoInput.value = '';
        
        
            startButton.removeEventListener('click', startGame);
        }
        
    }
    const startButton = document.querySelector('#start');
    startButton.addEventListener('click', startGame);

    

    const resetGame = () => {
        gameStarted = false;
        playerOneInput.value = '';
        playerTwoInput.value = '';

        const boardArray = board.getBoard()

        boardArray.forEach((element) => {
            element.addMark(0)
        })

        const marksList = document.querySelectorAll('.mark')

        marksList.forEach((mark) => {
            mark.parentNode.removeChild(mark);
        })

        turnMessageP.textContent = 'Game reset'
        gameResultMessage.textContent = '';

        startButton.addEventListener('click', startGame);
    }
    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', resetGame);

    
    
    
    const playRound = (square) => {
        if (gameStarted) {
            if (!(board.getBoard()[square].getValue() === 0)) {
                console.log(`Square has already been marked`);
                marked = true;
            } else {
                turnMessageP.textContent = `${getActivePlayer().name} marks square ${square}.`;

                board.chooseMark(square,getActivePlayer().mark);
                
                
                //check for winner and display win message 
                const boardValues = board.getBoard().map((cell) => cell.getValue());
                
                const winningConditions = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8],
                    [0, 3, 6], [1, 4, 7], [2, 5, 8],
                    [0, 4, 8], [2, 4, 6]
                ];
                
                    hasWinner = winningConditions.some(array => {
                        return (array.every(index => boardValues[index] === 1) ||
                            array.every(index => boardValues[index] === 2))
                    })
                    
                    if (hasWinner) {
                            board.printBoard();
                            console.log(`${getActivePlayer().name} wins!`);
                            gameResultMessage.textContent = `${getActivePlayer().name} wins!`;
                            userClick.game.hasWinner = true;
                            
                            return;
                        };

                //switch player turn
                
                switchPlayerTurn();
                printNewRound();
            }
        }
    }
    //initial play game message 
    printNewRound();
    
    

    return {playRound, board, getActivePlayer, hasWinner, marked}
}



function userControls() {
    const squareList = document.querySelectorAll('.square');
    let squareId;
    const game = gameController();
    
    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', () => {
        game.hasWinner = false;
    });

    
    //brinch this function definition out of the forEach
    const clickSquare = (square) => {
        //prevents player from marking after game ends 
        
        
        squareId = square.id;
        
        if (game.hasWinner) {
            console.log('Game already over');
            return;
        }
        
        if (!(game.board.getBoard()[squareId].getValue() === 0)) {
            console.log('already marked')
            return;
        }

        game.playRound(squareId);
        console.log((game.board.getBoard()[squareId].getValue()));
        
        // board.getBoard()[squareId].addMark(currentPlayer);


        const boardValues = game.board.getBoard().map((cell) => cell.getValue());

        const squareDiv = document.getElementById(squareId);

        if (boardValues[square.id] === 1) {
            const xMark = document.createElement('p');
            xMark.classList.add('mark','xMark');
            xMark.textContent = 'X';
            squareDiv.appendChild(xMark);
        }
        if (boardValues[square.id] === 2) {
            const oMark = document.createElement('p');
            oMark.classList.add('mark','oMark');
            oMark.textContent = 'O';
            squareDiv.appendChild(oMark);
        }
    }
    squareList.forEach((square) => {
            square.addEventListener('click', () => clickSquare(square))  
    })  

    



        
    

    
    
    return {squareList,clickSquare,game}
}



const userClick = userControls();
const board = gameBoard();



