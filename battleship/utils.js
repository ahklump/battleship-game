/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 * Note: recycled from old homework assignment
 */

 
//Export the function sendJSONObj
exports.sendJSONObj = function(res, code, obj) {
    if(code == 200) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(obj));
        res.end();
    }
    else {
        switch(code) {
            case 404:
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.write("Error 404: resource not found");
                res.end();
                break;
            case 400:
                res.writeHead(400, {"Content-Type": "text/plain"});
                res.write("Error 400: server cannot process query request");
                res.end();
                break;
            case 415:
                res.writeHead(415, {"Content-Type": "text/plain"});
                res.write("Error 415: media type not supported");
                res.end();
                break;
            default: 
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write("Error 500: server error");
                res.end();
        }
    }
}