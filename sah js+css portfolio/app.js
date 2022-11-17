let boardArray = [];
let starterBoardState = document.querySelectorAll(".figure");
let starterBoardClasses = [];
let previouslyClicked = "";
var eats = false;
var whiteTurn = true;
var whiteRosadaHasNotMovedYet = true;
var blackRosadaHasNotMovedYet = true;
var gameLength = 600;
var whiteTime = gameLength;
var blackTime = gameLength;
var gameTime = setInterval(time, 1000, 1000);

//creation of an array with all checkboard areas + adding click listener
for (let position of starterBoardState) {
    boardArray.push(position);
    starterBoardClasses.push(position.className);

    position.addEventListener("click", function () {
        //makes sure that marked area has a character on it and if it is  it checks can it move to clicked area
        if (previouslyClicked != ""&&previouslyClicked.className!="figure") {
            
            if (boardArray.includes(previouslyClicked) && this != previouslyClicked) {
                if (canMoveTo(previouslyClicked).includes(this)) {
                    eats = true;
                } else {
                    previouslyClicked = "";
                }
            }
            
        }
        //defines if move is valid
        if (eats && previouslyClicked.className.includes("figure-")) {
            if (previouslyClicked.className.includes("white") && whiteTurn && kingNotChessed(previouslyClicked, this)) {
                //defines if rošada/castle is valid move based on previous moves
                if (whiteRosadaHasNotMovedYet) {
                    if (previouslyClicked.className.includes("king")) {
                        if (this == boardTable[7][2]) {
                            boardTable[7][3].className = boardTable[7][0].className;
                            boardTable[7][0].className = "figure";
                        }
                        whiteRosadaHasNotMovedYet = false;
                    }
                }
                eat(previouslyClicked, this);
                whiteTurn = false;
            } else if (previouslyClicked.className.includes("black") && !whiteTurn && kingNotChessed(previouslyClicked, this)) {
                //defines if rošada/castle is valid move based on previous moves
                if (blackRosadaHasNotMovedYet) {
                    if (previouslyClicked.className.includes("king")) {
                        if (this == boardTable[0][2]) {
                            boardTable[0][3].className = board.Table[0][0].className;
                            board.Table[0][0].className = "figure";
                        }
                        blackRosadaHasNotMovedYet = false;
                    } 
                }
                eat(previouslyClicked, this);
                whiteTurn = true;
            }
            previouslyClicked = "";
            eats = false;
        }else if(previouslyClicked=="" || !previouslyClicked){
            previouslyClicked = document.activeElement.querySelector(".figure");
        } else if (this.className.includes("figure-") && previouslyClicked.className == "figure") {
            previouslyClicked = this;
        }
    })
}
//creating 2d array of all positions so character moves could be applied
let boardTable = []
let row=[]
for (let element of boardArray) {
    row.push(element);
    if (row.length%8 === 0) {
        boardTable.push(row);
        row = [];
    }
}

//changing characters position/eating enemy characters
function eat(theOneWhoEats, theOneWhoIsEaten) {
    if (theOneWhoEats.className.includes("pawn-black") && boardTable[7].includes(theOneWhoIsEaten)) {
        theOneWhoIsEaten.className = "figure figure-queen-black";
    } else if (theOneWhoEats.className.includes("pawn-white") && boardTable[0].includes(theOneWhoIsEaten)) {
        theOneWhoIsEaten.className = "figure figure-queen-white";
    } else {
        theOneWhoIsEaten.className = theOneWhoEats.className;
    }
    theOneWhoEats.className = "figure";
    if (isChecked(whiteTurn)&&! checkMate(whiteTurn)) {
        console.log("gg");
        won();
    }
}
//arrays of rules for characters movement
function getDirectionAndRange(character) {
    if (character.className.includes("rook")) {
        return [[[1, 0], [0, 1], [-1, 0], [0, -1]], false];
    }
    else if (character.className.includes("hunter")) {
        return [[[1, 1], [-1, 1], [-1, -1], [1, -1]], false];
    }
    else if (character.className.includes("queen")) {
        return [[[1, 1], [-1, 1], [-1, -1], [1, -1],[1, 0], [0, 1], [-1, 0], [0, -1]], false];
    }
    else if (character.className.includes("king")) {
        return [[[1, 1], [-1, 1], [-1, -1], [1, -1],[1, 0], [0, 1], [-1, 0], [0, -1]], true];
    }
    else if (character.className.includes("horse")) {
        return [[[2, 1], [2, -1], [1, -2], [-1, -2],[-2,-1], [-2, 1], [-1, 2], [1, 2]], true];
    }
    else if (character.className.includes("pawn-white")) {
        return [[[-1, -1], [0, -1], [1,-1]], true];
    }
    else if (character.className.includes("pawn-black")) {
        return [[[-1, 1], [0, 1], [1,1]], true];
    }

}

//function that returns all posible moves that marked character can make
function canMoveTo(character) {
    //search for characters cordinates x/y
    let x;
    let y;
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (boardTable[i][j] == character) {
                y = i;
                x = j;
                break;
            }
        }
        if (x) { break; }
    }
    ///////////////////////////////////////
    let movementInfo = getDirectionAndRange(character);
    let movePosibility = [];
    if (!movementInfo[1]) {
        //generating array of possible moves for characters that can move more than 1 area at the time
        for (let direction of movementInfo[0]) {
            let i = y;
            let j = x;
            while (true) {
                i += direction[0];
                j += direction[1];
                if (0 <= i && i <= 7 && 0 <= j && j <= 7) {

                    if (boardTable[i][j].className.includes("figure-")) {
                        if (isEnemy(character, boardTable[i][j])) {
                            movePosibility.push(boardTable[i][j]);
                        }
                        break;
                    } else {
                        movePosibility.push(boardTable[i][j]);
                    }
                }
                else {
                    break
                }
           }
            
        
        }
        
    } else {
        //generating array of possible moves for characters that can move 1 area at the time
        for (let direction of movementInfo[0]) {
            let i = y;
            let j = x;
            i += direction[1];
            j += direction[0];
            if (0 <= i && i <= 7 && 0 <= j && j <= 7) {
                if (character.className.includes("pawn")) {
                    if (j == x) {
                        if (!boardTable[i][j].className.includes("figure-")) {
                            movePosibility.push(boardTable[i][j]);
                            if (character.className.includes("white") && y == 6) {
                                if (!boardTable[i-1][j].className.includes("figure-")) {
                                    movePosibility.push(boardTable[i-1][j]);
                                }
                            }else if(character.className.includes("black") && y == 1) {
                                if (!boardTable[i+1][j].className.includes("figure-")) {
                                    movePosibility.push(boardTable[i+1][j]);
                                }
                            }
                        } 
                    } else {
                        if (boardTable[i][j].className.includes("figure-")) {
                            if (isEnemy(character, boardTable[i][j])) {
                                movePosibility.push(boardTable[i][j]);
                            }
                        }
                    }
                } else {
                    if (boardTable[i][j].className.includes("figure-")) {
                        if (isEnemy(character, boardTable[i][j])) {
                            movePosibility.push(boardTable[i][j]);
                        }
                    } else {
                        movePosibility.push(boardTable[i][j]);
                    }
                }
            }
            if (character.className.includes("king")) {
                if (character.className.includes("white")) {
                    if (whiteRosadaHasNotMovedYet) {
                        if (![boardTable[7][1].className.includes("figure-"), boardTable[7][2].className.includes("figure-"), boardTable[7][3].className.includes("figure-")].includes(true)) {
                            movePosibility.push(boardTable[7][2])
                        }
                    }
                } else {
                    if (blackRosadaHasNotMovedYet) {
                        if (![boardTable[0][1].className.includes("figure-"), boardTable[0][2].className.includes("figure-"), boardTable[0][3].className.includes("figure-")].includes(true)) {
                            movePosibility.push(boardTable[0][2])
                        }
                    }
                }
            }
        }
    }
    return movePosibility;
}

function isEnemy(character, enemy) {
    if (character.className.includes("white")) {
        if (enemy.className.includes("black")) { return true; } else { return false; }
    } else {
        if (enemy.className.includes("white")) { return true; } else { return false; }
    }
}
//determines whether or not friendly king will be chessed after certian move
function kingNotChessed(character,target){
    if (character.className.includes("white")) {
        if (!isMoveValid(character, target, "white")) {
            return false;
        }
    } else {
        if (!isMoveValid(character, target, "black")) {
            return false;
        }
    }
    return true;
}
//checks if friendly king would be in enemies move area after your move
function isMoveValid(character, target,color) {
    let transitionChar = character.className;
    let transitionTar = target.className;
    character.className = "figure";
    target.className = transitionChar;
    let king = document.querySelector(".figure-king-"+color)
    for (let position of boardArray) {
        if (position.className.includes(noColor(color))) {
            if (canMoveTo(position).includes(king)) {
                character.className = transitionChar;
                target.className=transitionTar
                return false;
            }
        }
    }
    character.className = transitionChar;
    target.className = transitionTar;
    return true;
}



function checkMate(whiteTurn) {
    if (isChecked(whiteTurn)) {
        if (!whiteTurn) {
            if (isTherePossibleMoves("white")) {
                return true;
            }
        }
        else {
            if (isTherePossibleMoves("black")) {
                return true;
            }
        }
    }
    return false;
}
function isTherePossibleMoves(color) {
    for (let pos of boardArray) {
        if (pos.className.includes(color)) {
            for (attempt of  canMoveTo(pos)) {
                let posOrigin = pos.className;
                let attemptOrigin = attempt.className;
                attempt.className = pos.className;
                pos.className = "figure";
                if (!(isChecked(whiteTurn))) {
                     attempt.className = attemptOrigin;
                     pos.className = posOrigin;
                    return true;
                } else {
                    attempt.className = attemptOrigin;
                    pos.className = posOrigin;
                }
                
                
            }
            
        }
    } return false;
}



function isChecked(whiteTurn) {
    if (!whiteTurn) {
        if (isKingInAttackArea("white")) {
            return true;
        }
    }else{
        if (isKingInAttackArea("black")) {
            return true;
        }
    }
    return false;
}

function isKingInAttackArea(color) {
    let king = document.querySelector(".figure-king-"+color);
        for (let position of boardArray) {
            if (position.className.includes(noColor(color))) {
                if (canMoveTo(position).includes(king)) {
                    return true;
                }
            }
        }
}

function noColor(color) {
    if (color == "white") return "black"; 
    if (color == "black") return "white";
}

//after check mate pops up winning message window
function won() {
    if (whiteTurn) {
        document.getElementById("winner").innerText = "white";
    } else {
        document.getElementById("winner").innerText = "black";
    }
    document.querySelector(".win").style.display = "block";
    let id = null;
    let scale = 0;
    
    clearInterval(id);
    id=setInterval(scaleFrame, 1);
    function scaleFrame() {
        if (scale == 100) {
            clearInterval(id)
        } else {
            scale+=2;
        }
        document.querySelector(".win").style.transform = "scale("+scale/100+")";
    }
    blackTime = -1;
    whiteTime = -1;
    
}


document.querySelector("#playAgain").addEventListener("click", startNewGame);
function startNewGame(){
    for (i = 0; i < 64; i++){
        boardArray[i].className = starterBoardClasses[i];
    }
    whiteRosadaHasNotMovedYet = true;
    blackRosadaHasNotMovedYet = true;
    whiteTurn = true;
    whiteTime = gameLength;
    blackTime = gameLength
    document.querySelector(".win").style.display = "none";
    document.querySelector(".win").style.transform = "scale(0)";
    document.querySelector("#white-time").innerText = "10:00";
    document.querySelector("#black-time").innerText = "10:00";
}

function time() {
    if (whiteTurn) {
        if (whiteTime == 0) {
            whiteTurn = !whiteTurn;
            won();
        } else if(whiteTime>0) {
            whiteTime--;
            document.querySelector("#white-time").innerText = Math.floor(whiteTime / 60) + ":" + whiteTime % 60;
        }
    } else {
        if (blackTime == 0) {
            whiteTurn = !whiteTurn;
            won();
        } else if(blackTime>0){
            blackTime--;
            document.querySelector("#black-time").innerText = Math.floor(blackTime / 60) + ":" + blackTime % 60;
        }
    }
}