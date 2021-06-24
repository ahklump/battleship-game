/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 */


//Required modules:
url = require('url');
http = require('http');
fileServer = require('./fileServer.js');
processQuery = require('./processQuery.js');

var serveStatic = function(req, res) {
    //Parse the url
    var urlParse = url.parse(req.url, "true");
    var query = urlParse.query;
    if(req.method == "GET") {
        var path = urlParse.pathname;
        if(path && (path.length > 1)) {
            //Call readServeFile function if client requested a file
            fileServer.readServeFile(res, "public_html" + path);
        }
        if(query.request) {
            //Process query request if there is one
            processQuery.processQuery(query, res);
        }
    }
    else {  //req.method == "POST"
        //Read in data sent by the client
        var info = "";
        req.on("data", data => {info += data;});
        req.on("end", () => {
            //Once the data stream ends, call process query
            processQuery.processQuery(query, res, info);
        })
    }
}

//Create the server
myserver = http.createServer(serveStatic);
myserver.listen(8080); 