/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 */


//Initialize button variables
var dotForm = "border:1px solid black; width:20px; height:20px; border-radius:50%; margin:auto;";
var whiteDot = "<div id='dot' style='background-color:white;" + dotForm + "'></div>";
var redDot = "<div id='dot' style='background-color:red;" + dotForm + "'></div>";

//Send move request to the server
function move() {
    var cellID = this.id;   //Get the ID of the cell that was clicked
    this.style.backgroundColor = "cadetblue";
    noClickBoard();     //Dissable click in the hits board

    AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function() {
        loadMove(cellID);   //Pass cellID to loadMove for the onload function
    };
    AJAXObj.onerror = function() {
        alert("AJAX response error");
    };

    var cellIDObj = {message: cellID.slice(1)}; //Get the board ID referencing the cell, and put it in an object
    AJAXObj.open("POST", "http://localhost:8080/?request=moves" + IDs);
    AJAXObj.setRequestHeader("Content-Type", "application/json");
    AJAXObj.send(JSON.stringify(cellIDObj));
}

function loadMove(cellID) {
    if(AJAXObj.status == 200) {
        //Get the ship and game information from the server response text
        var ship = JSON.parse(AJAXObj.responseText).ship;
        var game = JSON.parse(AJAXObj.responseText).game;
        if(ship == "none") {    //If no ship was hit...
            //...display a white dot in the cell that was clicked
            document.getElementById(cellID).innerHTML = whiteDot;
            dashStatus.innerHTML = "Miss! No ship hit :(";
        }
        else{   //If a ship was hit...
            //...display a red dot in the cell that was clicked
            document.getElementById(cellID).innerHTML = redDot;
            dashStatus.innerHTML = "You hit the enemy's " + ship + "!";
        }
        if(game == "win") {     //Check to see if this was the winning move
            dashStatus.innerHTML += " You sunk the last ship! You won!";
            setTimeout(endGame, 5000);
        }
        else {      //If the game didn't end, send poll requests waiting for the other player to move
            sendPollRequest();
        }
    }
    else {
        alert("Error moving");
    }
}