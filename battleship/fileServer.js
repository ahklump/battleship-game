/**
 * CSC 220 Final Project
 * Battleship
 * Allie Klump, Tasaday Green, Denise Nava
 * Note: recycled from homework assignment
 */


//Required modules
fs = require('fs');
path = require('path');
utils = require("./utils.js");

//Function that serves the requested file to the client
exports.readServeFile = function(res, filePath) {
    fs.readFile(filePath, 'binary', function(err, data) {
        if(err) {   //If there is an error in locating the file...
            //...call function in utils display the appropriate error message
            utils.sendJSONObj(res, 404);
        }
        else {
            //Get the file extension based on the file path
            var ext = path.extname(filePath);
            //Call the function determineType to get the corresponding content type
            var type = determineType(ext);
            //If type is undefined (meaning determineType doesn't include this extension)...
            if(!type) {
                //...call function in utils display the appropriate error message
                utils.sendJSONObj(res, 415);
            }
            //If type is defined (meaning determineType recognizes this extension)...
            else {
                //...send the content to the client (with the header including the correct content type)
                res.writeHead(200, {'Content-Type': type});
                res.write(data,'binary');
                res.end();
            }
        }
    });
}

//Function that determines and returns the content type based on the file extension
//Basic file extensions are included: .html, .js, .css, .txt, and common image file extensions
var determineType = ext => {
    switch(ext) {
        case '.html' || '.htm':     //If the extension is .html or .htm...
            return 'text/html';     //...the content type is text/html
        case '.js':                 //etc.
            return 'text/javascript';
        case '.css':
            return 'text/css';
        case '.txt':
            return 'text/plain';
        case '.gif':
            return 'image/gif';
        case '.ico':
            return 'image/vnd.microsoft.icon';
        case '.jpg' || 'jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
    }
    //No value is returned if extension is not an option above
}