var GamePiece = function(pathIndex,player,name) {
    this.name = name
    this.pathIndex = pathIndex
    this.ownedBy = player
}

var GameSpace = function(coordinate) {
    this.coordinate = coordinate
    this.currentPiece;
    this.isSafe = false
    this.isReRoll = false
}

var Player = function(gameSpace,player) {
    this.pieces = {}
    this.score = 0
    this.path = []
    this.finishedPieces = 0
    this.player = player
}

var Game = function() {
    this.player1;
    this.player2;
    this.gameBoard = []
    this.playerTurn;
    this.diceRoll = 0

    Game.prototype.setGameBoard = function() {
        gameBoard = []
        for (var i=0;i<8;i++) {
            gameBoardRow = []
            for(var j=0;j<3;j++) {
                newSpace = new GameSpace(i+"x"+j)
                gameBoardRow.push(newSpace)
                if((i==0&&(j==0||j==2))||(i==6&&(j==0||j==2))) {
                    newSpace.isReRoll = true
                }
                if((j==1&&(i==1||i==4))) {
                    newSpace.isSafe = true
                }
            }
            gameBoard.push(gameBoardRow)
        }
        this.gameBoard = gameBoard
        return this
    }

    Game.prototype.createPlayers = function() {
        this.player1 = new Player(this.gameBoard[4][0],1)
        this.player2 = new Player(this.gameBoard[4][2],2)
        var x=4, separate=true
        for(var i=1;i<=16;i++) {
            if (separate) {
                this.player1.path.push(this.gameBoard[x][0])
                this.player2.path.push(this.gameBoard[x][2])
                if (x<=0) {
                    separate = false
                }
                else {
                    x--
                }
            }
            else {
                this.player1.path.push(this.gameBoard[x][1])
                this.player2.path.push(this.gameBoard[x][1])
                if(x>=7) {
                    separate = true
                }
                else {
                    x++
                }
            }
        }
        for (var count=1;count<=5;count++) {
            this.player1.pieces["blue"+count] = new GamePiece(0,this.player1,"blue"+count)
            this.player2.pieces["red"+count] = new GamePiece(0,this.player2,"red"+count)
        }
        return this
    }

    Game.prototype.rollDice = function() {
        console.log("roll")
        roll = 1
        //dicelogic goes here
        //player selects piece to move
        $("Player"+this.playerTurn.player).click(function() { selectedPiece = $(this).attr('id')
            if (selectedPiece && selectedPiece.ownedBy == this.playerTurn) {
                if (selectedPiece.pathIndex+roll>=15) { //if they roll over the end
                    if(selectedPiece.pathIndex+roll==15) { //if they roll the right amount
                        this.playerTurn.path[selectedPiece.pathIndex].currentPiece = null
                        selectedPiece.pathIndex+=roll
                        this.playerTurn.finishedPieces+=1
                        if (this.finishedPieces>=5) {
                            //win condition
                            console.log("player"+this.playerTurn.player+"wins")
                        }
                    }
                    else {
                        //you need to roll exactly x to remove the game piece
                    }
                }
                if (this.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.ownedBy != this.playerTurn) {
                    if (this.playerTurn.path[selectedPiece.pathIndex+roll].isSafe) {
                        //space is safe
                    }
                    else {
                    //remove other player piece, replace with currplayer piece
                    this.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.pathIndex = 0
                    selectedPiece.pathIndex+=roll
                    this.playerTurn.path[selectedPiece.pathIndex].currentPiece = selectedPiece
                    }
                }
                else if (this.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.ownedBy == this.playerTurn) {
                //can't do it, one of your pieces is there
                }
                else {
                    //no players on space, move piece
                    this.playerTurn.path[selectedPiece.pathIndex].currentPiece = null
                    selectedPiece.pathIndex+=roll
                    this.playerTurn.path[selectedPiece.pathIndex].currentPiece = selectedPiece
                    document.getElementById()
                    function MovePiece(x, y, playerName, elementName)
                    {
                        document.getElementById(selectedPiece.name).remove();
                        document.getElementById(this.playerTurn.path[selectedPiece.pathIndex].coordinate).innerHTML = "<div class='player" + this.playerTurn.player + "' id='" + selectedPiece.name + "'></div>";
                    }
                }
            }
            else {
                //no piece on space or not your piece
            }
            $("div").off("click")
        })
        
    }



}



var myGame = new Game();

myGame.setGameBoard().createPlayers()

$("button").click(function() {
    console.log("button clicked")
    myGame.rollDice()
})

myGame.playerTurn = myGame.player1
// console.log(myGame.gameBoard)
// console.log(myGame.player1.path)
// console.log(myGame.playerTurn.pieces)
// myGame.rollDice()
// console.log(myGame.gameBoard)




