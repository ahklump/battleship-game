/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 */


//Initializing variables:
var board = [];
var hits = [];
var boardObj = {message: []};
var shipType;
var shipLength;
var shipArray = [];
var finalShipArray = [];

//Initialize shipKey
var shipKey = {"carrier": 5, "battleship": 4, "destroyer": 3, "submarine": 3, "patrol boat": 2}

//Getting HTML elements and adding event listeners
var startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", startGame);

var logo = document.getElementById("logo");

var divTables = document.getElementById("divTables");

var menu = document.getElementById("options");

var instructions = document.getElementById("instructions");

var confirmShip = document.getElementById("confirmShip");
confirmShip.addEventListener("click", posShip);

var divPosBtns = document.getElementById("divPosBtns");

var dashboard = document.getElementById("dashboard");
var dashStatus = document.getElementById("dashStatus");

var restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", resetPage);

document.getElementById("flip").addEventListener("click", moveFlip);
document.getElementById("up").addEventListener("click", moveUp);
document.getElementById("down").addEventListener("click", moveDown);
document.getElementById("right").addEventListener("click", moveRight);
document.getElementById("left").addEventListener("click", moveLeft);
document.getElementById("confirmPos").addEventListener("click", confirmPos);


//Functions:

function startGame() {
    startBtn.style.display = "none";
    init();
    getBoardReady();
}

//Adds cell elements to board array and hits array; creates and adds cell objects to boardObj
function getBoardReady() {
    boardCells = document.getElementById("board").getElementsByTagName("td");
    for(cell of boardCells) {
        board.push(cell);
    }
    hitsCells = document.getElementById("hits").getElementsByTagName("td");
    for(cell of hitsCells) {
        hits.push(cell);
    }
    for(cell of board) {
        boardObj.message.push({"id": cell.id.slice(1), "ship": "none", "hit": "no"});
    }
}

//An opponent has arrived in the game (two players have been paired)
function enemyHere() {
    document.getElementById("waiting").innerHTML = "";
    divTables.style.display = "block";
    logo.style.maxHeight = "75px";
}

//Arranges the HTML page so that the client can place a ship on the board
function posShip() {
    this.style.display = "none";
    menu.style.display = "none";
    shipType = menu.value;
    shipLength = shipKey[shipType];
    instructions.innerHTML = "Use the buttons below to position your " + shipType + ":";
    divPosBtns.style.display = "inline";

    for(i=0; i<shipLength; i++) {   
        shipArray.push(i);  //Keep track of cells the ship is positioned in
    }
    finalShipArray = shipArray.slice();     //Copy shipArray to finalShipArray
    while(checkPlacement() == false) {      //If you can't place the ship there...
        for(i in shipArray) {
            shipArray[i] = shipArray[i] + 10;       //...shift the ship down one row
        }
        if(shipArray[0] > 99) {     //If this causes it to go off the end of the board...
            for(i in shipArray) {
                shipArray[i] = (shipArray[i] + 1) % 10;     //...move it to the top of the next column
            }
        }
        finalShipArray = shipArray.slice();     //Copy shipArray to finalShipArray
    }
    for(index of shipArray) {
        board[index].style.backgroundColor = "gray";    //Color the cells gray where the ship is placed
    }
}

//If possible, flips the position of the ship
function moveFlip() {
    var pivot = shipArray[0];
    if(pivot == shipArray[1] - 1) { //If the ship is horizontal...
        if((pivot + ((shipLength-1)*10)) < 100) {
            for(i in shipArray) {
                if(i != 0) {
                    shipArray[i] = pivot + (i*10);
                }
            }
        } 
    }
    else {  //If the ship is vertical...
        if((9 - (pivot) % 10) >= shipLength - 1) {
            for(i in shipArray) {
                if(i != 0) {
                    shipArray[i] = pivot + parseInt(i);
                }
            }
        }
    }
    //If it is possible to move the ship here, then do so
    if(checkPlacement() == true) {
        updatePosColor();
    }
}

//If possible, move the ship up by one cell
function moveUp() {
    var min = 99;
    for(index of shipArray) {
        if(min > index) {
            min = index;
        }
    }
    if(min > 9) {
        for(i in shipArray) {
            shipArray[i] = shipArray[i] - 10;
        }
    }
    //If it is possible to move the ship here, then do so
    if(checkPlacement() == true) {
        updatePosColor();
    }
}

//If possible, move the ship down by one cell
function moveDown() {
    var max = 0;
    for(index of shipArray) {
        if(max < index) {
            max = index;
        }
    }
    if(max < 90) {
        for(i in shipArray) {
            shipArray[i] = shipArray[i] + 10;
        }
    }
    //If it is possible to move the ship here, then do so
    if(checkPlacement() == true) {
        updatePosColor();
    }
}

//If possible, move the ship to the right by one cell
function moveRight() {
    var max = 0;
    for(index of shipArray) {
        if(max < index) {
            max = index;
        }
    }
    if((max % 10) != 9) {
        for(i in shipArray) {
            shipArray[i]++;
        }
    }
    //If it is possible to move the ship here, then do so
    if(checkPlacement() == true) {
        updatePosColor();
    }
}

//If possible, move the ship to the left by one cell
function moveLeft() {
    var min = 99;
    for(index of shipArray) {
        if(min > index) {
            min = index;
        }
    }
    if((min % 10) != 0) {
        for(i in shipArray) {
            shipArray[i]--;
        }
    }
    //If it is possible to move the ship here, then do so
    if(checkPlacement() == true) {
        updatePosColor();
    }
}

//Verify if the ship can be moved to the indices of shipArray
function checkPlacement() {
    for(index of shipArray) {
        if(boardObj.message[index].ship != "none") {       //If there is already a ship here...
            shipArray = finalShipArray.slice();
            return false;       //...don't move the ship here!
        }
    }
    return true;    //If all cells at the indices of shipArray are empty, then return true
}

function updatePosColor() {
    for(index of finalShipArray) {
        board[index].style.backgroundColor = "cadetblue";     //Color in the old cells cadedblue
    }
    finalShipArray = shipArray.slice();
    for(index of finalShipArray) {
        board[index].style.backgroundColor = "gray";       //Color in the new cells gray
    }
}

function confirmPos() {
    //Remove ship that was just placed from the drop down menu options
    for(i=0; i<menu.length; i++) {
        if(menu.options[i].value == shipType) {
            menu.remove(i);
        }
    }
    //Call placeShip() to store the information on where the ship was placed
    placeShip();
    //Reset shipArray and finalShipArray to empty
    shipArray = [];
    finalShipArray = [];
    //Edit HTML elements as needed
    instructions.innerHTML = "Position your next ship:";
    divPosBtns.style.display = "none";
    if(menu.length == 0) {
        instructions.innerHTML = "Waiting for opponent to place ships...";
        setUp();
    }
    else {
        confirmShip.style.display = "inline";
        menu.style.display = "inline";
    }
}

//Edits boardObj to keep track of newly placed ship
function placeShip() {
    for(index of finalShipArray) {
        boardObj.message[index].ship = shipType;
    }
}

//Display both boards and the dashboard now that the game has started
function displayAll() {
    instructions.style.display = "none";
    document.getElementById("hits").style.display = "table";
    dashboard.style.display = "block";
}

//Adds event listeners to cell objects in hits board (it's your turn!)
function clickBoard() {
    for(cell of hits) {
        if(cell.innerHTML == "") {      //Don't include cells where you've already guessed there
            cell.addEventListener("click", move);
            cell.addEventListener("mouseover", highlight);
            cell.addEventListener("mouseout", unhighlight);
        }
    }
}

//Remove event listeners to cell objects in hits board (it's not your turn)
function noClickBoard() {
    for(cell of hits) {
        cell.removeEventListener("click", move);
        cell.removeEventListener("mouseover", highlight);
        cell.removeEventListener("mouseout", unhighlight);
    }
}

function highlight() {
    this.style.backgroundColor = "#295253";
}

function unhighlight() {
    this.style.backgroundColor = "cadetblue";
}

//Edit HTML elements to show end of game display
function endGame() {
    divTables.style.display = "none";
    dashStatus.innerHTML = "Game Over";
    restartBtn.style.display = "block";
    logo.style.maxHeight = "125px";
}

//Go back to the original page arrangement
function resetPage() {
    location.reload();
}