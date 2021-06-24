/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 */


//Send set up request to the server (send the ship placement information to the server)
function setUp() {
    AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = loadSetUp;
    AJAXObj.onerror = function() {
        alert("AJAX response error");
    };
    AJAXObj.open("POST", "http://localhost:8080/?request=setUp" + IDs);
    AJAXObj.setRequestHeader("Content-Type", "application/json");
    AJAXObj.send(JSON.stringify(boardObj));
}

function loadSetUp() {
    if(this.status == 200) {
        sendPollRequest();      //Send poll request, waiting for the other player to place their ships
    }
    else {
        alert("Error with set up");
    }
}