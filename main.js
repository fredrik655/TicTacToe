

// gameboard, player 1, player 2/AI, display module

const gameBoard = (() => {

    let turn = 0;
    const currentStateArr = [null,null,null,null,null,null,null,null,null];
    const players = [];
    let numbPlayers = 0;

    const printBoard = () => console.table(currentStateArr);

    const resetGameBoard = () => {
        for(let i = 0; i < currentStateArr.length; i++){
            currentStateArr[i] = null;
        }
        turn = 0;
    };

    const resetPlayers = () => {
        players.pop();
        players.pop();
    }

    const playTurn = (mark, index) => {
        setArrWithMark(mark, index);

        if(calculateThreeInRow().gameWon){
            turn = 8;
        }
        else {
            turn++;
        }
        
    };

    const gameIterator = (mark = null, index = null) => {

        if(numbPlayers === 1){
            playTurn(mark, index);
            if(checkForTie() && !calculateThreeInRow().gameWon){
                displayController.enableAndDisableSquareBtns(false);
                displayController.updateWinnerText('Tie No Winners');
            }
            else if(calculateThreeInRow().gameWon){
                displayController.enableAndDisableSquareBtns(false);
                gameOver();
            }
            else {
                players[1].generateMove(currentStateArr);
                if(checkForTie() && !calculateThreeInRow().gameWon){
                    displayController.enableAndDisableSquareBtns(false);
                    displayController.updateWinnerText('Tie No Winners');
                }
                else if(calculateThreeInRow().gameWon){
                    displayController.enableAndDisableSquareBtns(false);
                    gameOver();
                }
            }
        }
        else {
            playTurn(mark, index);
            if(checkForTie() && !calculateThreeInRow().gameWon){
                displayController.enableAndDisableSquareBtns(false);
                displayController.updateWinnerText('Tie No Winners');
            }
            else if(calculateThreeInRow().gameWon){
                displayController.enableAndDisableSquareBtns(false);
                gameOver();
            }
        }
    }

    const gameOver = () => {
        // update text 
        if(calculateThreeInRow().value === 'X'){
            displayController.updateWinnerText('Player 1 Won!!');
        }
        else if(calculateThreeInRow().value === 'O' && numbPlayers === 2){
            displayController.updateWinnerText('Player 2 Won!!');
        }
        else {
            displayController.updateWinnerText('AI Won!!');
        }
        
        // ask if play again
        // if play again startGame()
    };

    const startGame = () => {
        // reset game
        resetGameBoard();
        resetPlayers();
        displayController.clearBoard();
        if(displayController.returnNumbPlayerSelected() === 1){
            players.push(Player('Player 1', 'X'));
            players.push(PlayerAi(1));
            numbPlayers = 1;
            displayController.updateWinnerText('Player 1 vs AI');
        }
        else {
            players.push(Player('Player 1', 'X'));
            players.push(Player('Player 2', 'O'));
            numbPlayers = 2;
            displayController.updateWinnerText('Player 1 vs Player 2');
        }
        console.table(players);
        displayController.enableAndDisableSquareBtns(true);
        // make players
    }

    const playersSelected = () => {
        return numbPlayers;
    }

    const setArrWithMark = (mark, index) => {
        currentStateArr[index] = mark;
    };

    const checkIfIndexEmpty = index => {
        if(currentStateArr[index] === null){
            return true;
        }
        return false;
    };

    const checkForTie = () => {
        let tie = true;
        if(!calculateThreeInRow().gameWon){
            currentStateArr.forEach(element => {
                tie = (element === null) ? false : tie;
            });
        }

        return tie;
    }

    const calculateThreeInRow = () => {
        
        //check horizontal lines
        for(let i = 0; i < 9; i = i+3){
            if(currentStateArr[i] === currentStateArr[i+1] && currentStateArr[i] === currentStateArr[i+2]){
                if(currentStateArr[i] !== null && currentStateArr[i+1] !== null && currentStateArr[i+2] !== null){
                    return {value: currentStateArr[i], gameWon: true};
                }
            }
        }
        //check vertical lines
        for(let i = 0; i < 4; i++){
            if(currentStateArr[i] === currentStateArr[i+3] && currentStateArr[i] === currentStateArr[i+6]){
                if(currentStateArr[i] !== null && currentStateArr[i+3] !== null && currentStateArr[i+6] !== null){
                    return {value: currentStateArr[i], gameWon: true};
                }
            }
        }
        //check diagonal lines
        if(currentStateArr[0] === currentStateArr[4] && currentStateArr[0] === currentStateArr[8]){
            if(currentStateArr[0] !== null && currentStateArr[4] !== null && currentStateArr[8] !== null){
                return {value: currentStateArr[4], gameWon: true};
            }
        }
        else if(currentStateArr[2] === currentStateArr[4] && currentStateArr[2] === currentStateArr[6]){
            if(currentStateArr[2] !== null && currentStateArr[4] !== null && currentStateArr[6] !== null){
                return {value: currentStateArr[4], gameWon: true};
            }
        }
        return {value: null, gameWon: false};
    };

    const getTurn = () => {
        return +turn;
    }
    return {printBoard, resetGameBoard, getTurn, playTurn, gameIterator, checkIfIndexEmpty, startGame, playersSelected};
})();


const displayController = (() => {

    const listOfGameSquares = Array.from(document.querySelectorAll('.board-square'));
    const startBtn = document.querySelector('.start-btn');
    const difficultyBtns = Array.from(document.querySelectorAll('.difficulty'));
    const radioBtns = Array.from(document.querySelectorAll('.input-box'));
    const winnerText = document.querySelector('.winner-text').childNodes[1];

    const init = () => {
        addEventListenersSquares();
        addEventListenersRadio();
        addEventListenerStart();
        enableAndDisableSquareBtns(false);
        initializeInterface();
    }

    const initializeInterface = () => {
        difficultyBtns.forEach(element => {
            element.classList.remove('difficulty-none-select');
            element.classList.add('difficulty');

            element.addEventListener('click', e => {
                console.log(typeof(e.target.getAttribute('data-selected')));
                if(e.target.id === 'easy' && e.target.getAttribute('data-selected') === '2'){
                    difficultyBtns.forEach(el => {
                        (el.id === 'easy') ? el.setAttribute('data-selected', '1') : el.setAttribute('data-selected', '2');
                    });
                    updateWinnerText('Start Game / Player 1 vs easy AI');
                }
                else if(e.target.id === 'hard' && e.target.getAttribute('data-selected') === '2'){
                    difficultyBtns.forEach(el => {
                        (el.id === 'hard') ? el.setAttribute('data-selected', '1') : el.setAttribute('data-selected', '2');
                    });
                    updateWinnerText('Start Game / Player 1 vs hard AI');
                }
            });
        });



        radioBtns[0].childNodes[1].checked = true;
        updateWinnerText('Start Game / Player 1 VS easy AI');
    };

    const updateWinnerText = (newText) => {
        winnerText.textContent = newText;
    };

    const returnNumbPlayerSelected = () => {
        return (radioBtns[0].childNodes[1].checked) ? 1 : 2;
    }



    const addEventListenerStart = () => {
        startBtn.addEventListener('click', () => {
            gameBoard.startGame();
        })
    };

    const addEventListenersSquares = () => {
        listOfGameSquares.forEach(element => {
            element.querySelector('.square-btn').addEventListener('click', (e) => {
                const dataValue = e.target.getAttribute('data-value');
                if(gameBoard.checkIfIndexEmpty(dataValue)) {
                    if((gameBoard.getTurn() % 2) === 0){
                        gameBoard.gameIterator('X', dataValue);
                        updateSquare('X', dataValue);
                    }
                    else {
                        gameBoard.gameIterator('O', dataValue);
                        updateSquare('O', dataValue);
                    }
                }
                
            })
        });
    };

    const addEventListenersRadio = () => {
        radioBtns.forEach(element => {
            element.addEventListener('change', () => {
                enableAndDisableSquareBtns(false);
                clearBoard();
                toggleDifficulty();
                updateTextOnRadioChange();
            });
        });      
    };

    const updateTextOnRadioChange = () => {
        if(returnNumbPlayerSelected() === 1){
            updateWinnerText('Start Game / Player 1 VS easy AI');
        }
        else {
            updateWinnerText('Start Game / Player 1 VS Player 2');
        }
    };

    const toggleDifficulty = () => {
        const diff = 'difficulty';
        const nonDiff = 'difficulty-none-select';
        if(difficultyBtns[0].classList[0] === diff){
            difficultyBtns.forEach(element => {
                element.classList.remove(diff);
                element.classList.add(nonDiff);
            });
        }
        else if(difficultyBtns[1].classList[0] === nonDiff) {
            difficultyBtns.forEach(element => {
                element.classList.remove(nonDiff);
                element.classList.add(diff);
            });
        }
    };

    const clearBoard = () => {
        listOfGameSquares.forEach(element => {
            element.style.backgroundColor = 'white';
        });
    }
    const updateSquare = (mark, index) => {
        if(index >= 0 && index < 9){
            listOfGameSquares[index].style.backgroundColor = (mark === 'X') ? 'black' : 'green';
        }  
    };

    const disableAllSquareBtns = () => {
        listOfGameSquares.forEach(element => {
            element.querySelector('.square-btn').style.pointerEvents = 'none';
        });
    }

    const enableAllSquareBtns = () => {
        listOfGameSquares.forEach(element => {
            element.querySelector('.square-btn').style.pointerEvents = 'all';
        });
    }

    const enableAndDisableSquareBtns = enable => {
        if(enable){
            enableAllSquareBtns();
        }
        else {
            disableAllSquareBtns();
        }
    }

    const print = () => console.log(listOfGameSquares);

    return {print, init, updateSquare, returnNumbPlayerSelected, clearBoard, updateWinnerText, enableAndDisableSquareBtns};
})();



const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;

    return {getName, getMark};
};

const PlayerAi = level => {
    const Ai = Object.create(Player('AI', 'O'));

    Ai.returnAiLevel = () => level;

    Ai.setAiLevel = lvl => {
        level = lvl;
    }

    Ai.generateMove = gameBoardArr => {
        let placed = false;
        while(!placed) {
            
            let randIndex = Math.floor(Math.random() * 9);
            if(gameBoardArr[randIndex] === null){
                gameBoard.playTurn('O', randIndex);
                placed = true;
                displayController.updateSquare('O', randIndex);
                break;
            }
        }
    };

    return Ai;
};

displayController.init();