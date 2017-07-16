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

var Player = function(gameSpace,player,home) {
    this.pieces = {}
    this.score = 0
    this.path = []
    this.finishedPieces = 0
    this.player = player
    this.home = home
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
        this.player1 = new Player(this.gameBoard[4][0],1,"4x0")
        this.player2 = new Player(this.gameBoard[4][2],2,"4x2")
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

    Game.prototype.rollDice = function(value) {
        console.log("roll")
        roll = value
        if (roll == 0) {
            this.switchTurns();
            return;
        }
        //dicelogic goes here
        //player selects piece to move
        var self = this
        console.log("turn: ",self.playerTurn)
        $(".Player"+self.playerTurn.player).click(function() { selectedPiece = self.playerTurn.pieces[$(this).attr('id')]
            console.log($(this).attr('id'),selectedPiece)
            if (selectedPiece && selectedPiece.ownedBy == self.playerTurn) {
                if (selectedPiece.pathIndex+roll>=15) { //if they roll over the end
                    if(selectedPiece.pathIndex+roll==15) { //if they roll the right amount
                        self.playerTurn.path[selectedPiece.pathIndex].currentPiece = null
                        selectedPiece.pathIndex+=roll
                        self.playerTurn.finishedPieces+=1
                        if (self.finishedPieces>=5) {
                            //win condition
                            console.log("player"+self.playerTurn.player+"wins")
                        }
                    }
                    else {
                        //you need to roll exactly x to remove the game piece
                    }
                }
                console.log(roll)
                console.log(self.playerTurn.path[selectedPiece.pathIndex+roll])
                if (self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece) {
                    if (self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.ownedBy != self.playerTurn) {
                        if (self.playerTurn.path[selectedPiece.pathIndex+roll].isSafe) {
                            //space is safe
                        }
                        else {
                            console.log('jump',self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.ownedBy.home)
                        //remove other player piece, replace with currplayer piece

                            document.getElementById(selectedPiece.name).remove();
                            document.getElementById(self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.name).remove();
                            document.getElementById(self.playerTurn.path[selectedPiece.pathIndex+roll].coordinate).innerHTML = "<div class='Player" + self.playerTurn.player + "' id='" + selectedPiece.name + "'></div>";
                            document.getElementById(self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.ownedBy.home).innerHTML = "<div class='Player" + self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.ownedBy.player + "' id='" + selectedPiece.name + "'></div>";
                            self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.pathIndex = 0
                            selectedPiece.pathIndex+=roll
                            self.playerTurn.path[selectedPiece.pathIndex].currentPiece = selectedPiece
                            self.switchTurns()
                        }
                    }
                    else if (self.playerTurn.path[selectedPiece.pathIndex+roll].currentPiece.ownedBy == self.playerTurn) {
                        return
                    }
                }
                else {
                    //no players on space, move piece
                    console.log("moving piece")
                    self.playerTurn.path[selectedPiece.pathIndex].currentPiece = null
                    selectedPiece.pathIndex+=roll
                    self.playerTurn.path[selectedPiece.pathIndex].currentPiece = selectedPiece
                    console.log(self.playerTurn.path[selectedPiece.pathIndex].coordinate)
                    document.getElementById(selectedPiece.name).remove();
                    document.getElementById(self.playerTurn.path[selectedPiece.pathIndex].coordinate).innerHTML = "<div class='Player" + self.playerTurn.player + "' id='" + selectedPiece.name + "'></div>";
                    if (!(selectedPiece.pathIndex==4 || selectedPiece.pathIndex==14)) {
                        self.switchTurns()
                    }
                 }
            }
            else {
                //no piece on space or not your piece
            }
            $("div").off("click")
        })
        
    }

    Game.prototype.switchTurns = function() {
        if (this.playerTurn == this.player1) {
            this.playerTurn = this.player2
        }
        else {
            this.playerTurn = this.player1
        }
        console.log()
        //TODO: display player turn
        document.getElementById("turn").innerHTML = "Player "+this.playerTurn.player+"'s Turn!"
    }



}

//TODO: Account for a 0 roll



var myGame = new Game();

myGame.setGameBoard().createPlayers()
myGame.playerTurn = myGame.player1
console.log(myGame.playerTurn)

$("#roll").click(function() {
    d1 = $('#placeholder1').text()
    d2 = $('#placeholder2').text()
    myGame.rollDice(Number(d1)+Number(d2))
})


// console.log(myGame.gameBoard)
// console.log(myGame.player1.path)
// console.log(myGame.playerTurn.pieces)
// myGame.rollDice()
// console.log(myGame.gameBoard)




