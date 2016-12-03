// Load required modules
var http    = require('http'),         // http server core module
    port    = process.env.PORT || 8080,
    timeNow = new Date().toLocaleString('en-US', {hour12: false, timeZone: 'Europe/Kiev'}),
    express = require('express'),       // web framework external module
    fs = require('fs'),
    httpApp = express();

// Setup and configure Express http server. Expect a subfolder called 'site' to be the web root.
httpApp.use(express.static(__dirname + '/site/'));

httpApp.get(['/following*', '/following/*', '/profile*', '/profile/*', '/repo*', 'repo/*'], function(req, res) {
    res.sendFile(__dirname + '/site/index.html');
});

// Start Express http server on the port
console.info(timeNow + ': Starting http server on the port ' + port);
console.info(timeNow + ': Ctrl-C to abort');
http.createServer(httpApp).listen(port);
