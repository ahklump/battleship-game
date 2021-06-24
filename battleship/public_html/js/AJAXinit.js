/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 */


//Initialize IDs
var gameID;
var clientID;
var IDs;

//Send initialization request to server
function init() {
    AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = initLoad;
    AJAXObj.onerror = function() {
        alert("AJAX response error");
    };
    AJAXObj.open("GET", "http://localhost:8080/?request=init");
    AJAXObj.send();
}

function initLoad() {
    if(this.status == 200) {
        //Get the gameID and clientID assigned by the server
        gameID = JSON.parse(this.responseText).gameID;
        clientID = JSON.parse(this.responseText).clientID;
        IDs = "&gameID=" + gameID + "&clientID=" + clientID;
        
        if(clientID == 0) {     //If you're the first person in the game...
            document.getElementById("waiting").innerHTML = "Waiting for opponent...";
            sendPollRequest();  //..send poll requests and wait for the second player
        }
        else {  //clientID == 1
            enemyHere();    //There is already a second player, so call enemyHere()
        }
    }
    else {
        alert("Error initializing");
    }
}