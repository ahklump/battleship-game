/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 */


//Send poll request to the server
function sendPollRequest() {
    AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = loadPoll;
    AJAXObj.onerror = function() {
        alert("AJAX response error");
    };
    AJAXObj.open("GET", "http://localhost:8080/?request=poll" + IDs);
    AJAXObj.send();
}

function loadPoll() {
    if(this.status == 200) {
        var message = JSON.parse(this.responseText).message;
        switch(message) {
            case "nothing":
                setTimeout(sendPollRequest, 1000);  //If no new message, keep polling
                break;
            case "enemy arrived":
                enemyHere();    //If a second player has arrived, call enemyHere()
                break;
            case "enemy engaged":   //If the other player has also placed their ships, start the game
                displayAll();
                if(clientID == 0) {
                    dashStatus.innerHTML = "Your turn first!";
                    clickBoard();
                }
                else {  //clientID == 1
                    dashStatus.innerHTML = "Opponent's turn first";
                    sendPollRequest();
                }
                break;
            case "enemy attacked":      //If the enemy has made a move...
                //Get the move information
                var cellID = JSON.parse(this.responseText).cell;
                var ship = JSON.parse(this.responseText).ship;
                //Display that move on your board and update dashStatus accordingly
                if(ship == "none") {
                    document.getElementById("b" + cellID).innerHTML = whiteDot;
                    dashStatus.innerHTML = "The enemy missed! Now it's your turn";
                }
                else {
                    document.getElementById("b" + cellID).innerHTML = redDot;
                    dashStatus.innerHTML = "The enemy hit your " + ship + "! Now it's your turn";
                }
                clickBoard();   //Now it's your turn!
                break;
            case "enemy won":       //If the enemy won the game...
                //Get and record their move
                var cellID = JSON.parse(this.responseText).cell;
                var ship = JSON.parse(this.responseText).ship;
                document.getElementById("b" + cellID).innerHTML = redDot;
                //Display end of game messages
                dashStatus.innerHTML = "The enemy hit your " + ship + "! Your fleet has been destroyed! Game over :(";
                setTimeout(endGame, 5000);
        }
    }
    else {
        alert("Error polling");
    }
}