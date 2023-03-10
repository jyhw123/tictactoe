// Factory Function that creates cell objects
// has two methods, change cell value and get cell value
const Cell = () => {
    let value =""
    const addSymbol = (symbol) =>{
        value = symbol
    }
    const getSymbol = ()=>value
    return{
        addSymbol,
        getSymbol
    }
}


// Modcule pattern that accepts name inputs and starts game
const startGame = (()=>{


    return{
        
    }
})()

// Factory function that creates player objects
const Player = (name, symbol) => {
    // let name = name 
    return{name, symbol} 
}

// Module pattern that generates the board and makes changes to it
// board is a 2D array
const gameBoardModule = ()=>{
    const rows = 3;
    const columns = 3;
    const board =[];


    for (let i=0; i<rows; i++){
        board[i]=[]
        for (let j=0; j<columns;j++){
            board[i].push(Cell())
        }
    }

    const getBoard = () => board

    const addSymbol = (row, column, playerSymbol) => {
        // check if cell is empty frist 
        if (board[row][column].getSymbol()==""){
            board[row][column].addSymbol(playerSymbol);
            return true
        } else{
            console.log("Cant make move here!")
            return false
        }

        // board[row][column].getSymbol()=="" ? board[row][column].addSymbol(playerSymbol): console.log("Cant make move here!")
    }

    const checkWin =(row, column, player)=>{

        // Check Horizontal Win
        if (board[row][0].getSymbol()==board[row][1].getSymbol() 
        && board[row][1].getSymbol()==board[row][2].getSymbol() 
        && board[row][2].getSymbol()==player.symbol){
            console.log(`Horizontal win by ${player.name}`)
            // return {rows: [row], columns:[0,1,2]}
            return [`(${row},0)`,`(${row},1)`,`(${row},2)`]
        // Check Vertical Win
        } else if (board[0][column].getSymbol()==board[1][column].getSymbol() 
        && board[1][column].getSymbol()==board[2][column].getSymbol() 
        && board[2][column].getSymbol()==player.symbol){
            console.log(`Vertical win by ${player.name}`)
            return [`(0,${column})`,`(1,${column})`,`(2,${column})`]
        // Check Diagonal Win - only check if row == column or row+column = 2
        } else if (board[0][0].getSymbol()==board[1][1].getSymbol()
            && board[1][1].getSymbol()==board[2][2].getSymbol()
            && board[2][2].getSymbol()==player.symbol){
            return ["(2,2)","(1,1)","(0,0)"]
        } else if(board[2][0].getSymbol()==board[1][1].getSymbol()
            && board[1][1].getSymbol()==board[0][2].getSymbol()
            && board[0][2].getSymbol()==player.symbol){
                return ["(0,2)","(1,1)","(2,0)"]
        } else {
            return false
        }
    }

    


    return{getBoard, addSymbol, checkWin}

}

// regular function, returns game object 
const gameControllerModule = (playerOne=null, playerTwo=null)=>{
    let currentStatus="playerTurn"
    const players = [playerOne, playerTwo]
    let currentPlayer = players[0] // 'optional chaining' operator allow us to access object properties without throwing error even if object is null (whihch is the case before player names are added)
    // let currentPlayerSymbol = players[0]?.symbol
    const board = gameBoardModule() // create board object once
    let winCoords = undefined


    const getCurrentStatus = () => currentStatus
    const getCurrentPlayer =() => currentPlayer
    const getCurrentPlayerName = () => currentPlayer.name
    const getCurrentPlayerSymbol = ()=> currentPlayer.symbol
    const getWinCoords = ()=> winCoords

    const switchPlayerTurn =()=>{
        currentPlayer = currentPlayer===players[0] ? players[1] : players[0]
    }

    const switchCurrentStatus=()=>{
        currentStatus = currentStatus==="playerTurn"?"gameOver":"playerTurn"
    }
    const checkAndHandleWin=()=>{
        const winStatus = board.checkWin(row, column, getCurrentPlayer())

        if (winStatus!=false){
            winCoords=winStatus
            // console.log(winCoords)
            switchCurrentStatus();
            return true 
        } else{
            return false
        }
    }

    const playerAction=(row, column)=>{
        console.log(`${getCurrentPlayerName()} (${getCurrentPlayerSymbol()}) just played (${row}, ${column})`)
        

        if (board.addSymbol(row, column, getCurrentPlayerSymbol())){ // returns true if valid move made
            if (!checkAndHandleWin()){ // returns true if no win yet
                switchPlayerTurn()
            }
        };

        // if (!checkAndHandleWin()){ // returns true if no win yet
        //     if (board.addSymbol(row, column, getCurrentPlayerSymbol())){
        //         switchPlayerTurn()
        //     }
        // };

        // gameboard = board.getBoard()
        // if (gameboard[row][0].getSymbol()==gameboard[row][1].getSymbol() 
        // && gameboard[row][1].getSymbol()==gameboard[row][2].getSymbol() 
        // && gameboard[row][2].getSymbol()==getCurrentPlayerSymbol()){

        // }
        // board[row][column]
        // check all cells in row, and all cells in column -> if all are filled with same symbol, then win

        // check if all cells have been occupied -> draw 

    }

    const endGame =(winner)=>{

    }


    // const getGameBoard = () => board.getBoard

    
    return{
        getCurrentStatus,
        getCurrentPlayerName,
        getCurrentPlayer,
        getWinCoords,
        playerAction,
        getGameBoard: board.getBoard
    }
}

// Module pattern that controls the screen
// update screen and update action 
// acts as input and output
const screenControllerModule = (()=>{
    let game = gameControllerModule()
    // const board = 
    // Set up
    const playerOneNameDiv = document.querySelector("#playerOneName")
    const playerTwoNameDiv = document.querySelector("#playerTwoName")
    const submitButtonDiv = document.querySelector("#startGameButton")
    
    function generateStartButton(){
        if (!(playerTwoNameDiv.value=="" || playerTwoNameDiv.value=="")){
            submitButtonDiv.disabled=false
        } else {
            submitButtonDiv.disabled=true
        }
    }
    function initaliseGame(){
        console.log("creating players and building board...")
        const playerOne = Player(playerOneNameDiv.value, "X")
        const playerTwo = Player(playerTwoNameDiv.value, "O")
        console.log(playerOne.name, playerOne.symbol)
        console.log(playerTwo.name, playerTwo.symbol)
        // console.log(gameStatus)
        // build board, create game object 
        game = gameControllerModule(playerOne, playerTwo)
        updateScreen()
    }

    playerOneNameDiv.addEventListener("input", generateStartButton)
    playerTwoNameDiv.addEventListener("input", generateStartButton)
    submitButtonDiv.addEventListener('click', initaliseGame)

    // Game Play Starts

    const actionDiv = document.querySelector(".action")
    const boardDiv = document.querySelector(".board")
    actionDiv.textContent = "Enter player names..."

    const updateAction = (player, status)=>{
        console.log(status)
        if (status=="playerTurn"){
            actionDiv.textContent = `${player.name}'s (${player.symbol}) turn...`
        } else if (status =="gameOver"){
            actionDiv.textContent = `${player.name} (${player.symbol}) won!`
        }
    }

    const updateBoard = () => {
        boardDiv.textContent = ""; // clear board
        const board = game.getGameBoard()
        let winCoords= undefined
        // console.log(board)
        if (game.getCurrentStatus()=="gameOver"){
            winCoords = game.getWinCoords()
            console.log(winCoords)
        }
        board.forEach((row, rowIndex)=>{
            const rowDiv = document.createElement("div")
            rowDiv.classList.add("rowDiv")
            row.forEach((cell, columnIndex)=>{
                const cellButton = document.createElement("Button")
                cellButton.addEventListener('click',()=>console.log(`clicked (${rowIndex}, ${columnIndex})`))
                cellButton.dataset.row = rowIndex
                cellButton.dataset.column = columnIndex
                cellButton.textContent=cell.getSymbol();
                rowDiv.appendChild(cellButton)
                if (typeof(winCoords) !== 'undefined'){
                    // console.log(winCoords)
                    if((winCoords).includes(`(${rowIndex},${columnIndex})`)){
                        cellButton.classList.add("winCell")
                    } else{
                        cellButton.classList.add("cell")
                    }
                } else{
                    cellButton.classList.add("cell")
                }
                // if (game.getCurrentStatus=="gameOver"){
                    
                // }
            })
            boardDiv.appendChild(rowDiv)
        })

    }

    const highlightWin=()=>{

    }

    // update both action words and board when player makes a turn ie clicks
    const updateScreen =()=>{
        updateAction(game.getCurrentPlayer(), game.getCurrentStatus())
        updateBoard()
    }

    //TODO: fix row and columns (reversed now)
    //TODO: work on gamecontroller

    const clickHandler=(e)=>{
        if (game.getCurrentStatus()=="playerTurn"){
            console.log("handler worked")
            row = +e.target.dataset.row // plus sign converts string to num
            column = +e.target.dataset.column
            game.playerAction(row, column)// - this changes the game array
    
            updateScreen()// - this gets the game array and displays it
        } else{
            console.log("Game over, no more moves allowed")
        }

    }

    boardDiv.addEventListener("click", clickHandler)

    return {}
})()

// board.playerAction(playerObject.symbol)