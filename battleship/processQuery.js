/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 */


//Require utils module
utils = require("./utils.js");

//Initialize ID counters to 0
var gameIDCounter = 0;
var clientIDCounter = 0;

//Initialize data structures to empty arrays
var messages = [];
var boards = [];
var totalHitsLeft = [];

//Depending on the query, call the appropriate function
exports.processQuery = function(query, res, info) {
    switch(query.request) {
        case "init":
            initRequest(res);
            break;
        case "poll":
            pollRequest(query, res);
            break;
        case "setUp":
            setUpRequest(query, res, info);
            break;
        case "moves":
            moveRequest(query, res, info);
            break;
        default:
            utils.sendJSONObj(res, 400);
    }
}

//Process request for initialization
function initRequest(res){
    //Assign client a gameID and clientID
    var clientID = clientIDCounter;
    var gameID = gameIDCounter;
    
    //Edit data structures to add a new game if necessary
    if(clientID == 0) {
        messages[gameID] = [[],[]];
        boards[gameID] = [[],[]];
        totalHitsLeft[gameID] = [17,17];
    }
    else {  //Else, tell the other player an opponent has arrived
        messages[gameID][0].push({message: "enemy arrived"});
    }

    //Update ID counters
    clientIDCounter = (clientIDCounter + 1) % 2;
    if((clientIDCounter % 2) == 0) {
        gameIDCounter++;
    }

    //Send gameID and clientID to the client
    var resObj = {"gameID": gameID, "clientID": clientID};
    utils.sendJSONObj(res, 200, resObj);
}

//Process poll request
function pollRequest(query, res) {
    var gameID = query.gameID;
    var clientID = query.clientID;
    
    //If there's a message for this client, send it to them
    if(messages[gameID][clientID].length) {
        utils.sendJSONObj(res, 200, messages[gameID][clientID].shift());
    }
    else{   //Else, send the default message "nothing"
        var defaultRes = {message: "nothing"};
        utils.sendJSONObj(res, 200, defaultRes);
    }
}

//Process set up request
function setUpRequest(query, res, info) {
    var gameID = query.gameID;
    var clientID = query.clientID;
    var board = JSON.parse(info).message;   //Get the board information send by the client

    //Update boards array to include this client's board information
    for(cell of board) {
        boards[gameID][clientID].push(cell);
    }

    //Tell the other player that the enemy's ships are all placed
    var enemyID = (parseInt(clientID) + 1) % 2;
    messages[gameID][enemyID].push({message: "enemy engaged"});

    //Send message to the client confirming set up request complete
    var resObj = {message: ""};
    utils.sendJSONObj(res, 200, resObj);
}

//Process move request
function moveRequest(query, res, info) {
    var gameID = query.gameID;
    var clientID = query.clientID;
    var cellID = JSON.parse(info).message;  //Get cellID information send by the client

    var enemyID = (parseInt(clientID) + 1) % 2;
    var resObj = {ship: ""};
    
    for(i in boards[gameID][enemyID]) {     //Find the cell in the enemy's board array
        if(boards[gameID][enemyID][i].id == cellID) {
            //Get the information needed to tell the other player about this move
            var messageObj = {message: "enemy attacked", cell: cellID, ship: boards[gameID][enemyID][i].ship};
            boards[gameID][enemyID][i].hit = "yes";
            //Get the information about the ship and add it to resObj
            resObj.ship = boards[gameID][enemyID][i].ship;
            if(resObj.ship != "none") {     //If a ship was hit...
                totalHitsLeft[gameID][enemyID]--;   //...reduce the total hits left
                if(totalHitsLeft[gameID][enemyID] == 0) {   //If this move caused the player to win...
                    //Update objects being send to both players
                    resObj.game = "win";
                    messageObj.message = "enemy won";
                }
            }
            //Tell the other player about this move
            messages[gameID][enemyID].push(messageObj);
        }
    }
    //Send response to the client
    utils.sendJSONObj(res, 200, resObj);
}