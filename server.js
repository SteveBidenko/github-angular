// Load required modules
var http    = require('http'),         // http server core module
    port    = process.env.PORT || 8080,
    colors = require("cli-color"),
    express = require('express'),       // web framework external module
    fs = require('fs'),
    httpApp = express(),
    mapping = {
        log: colors.yellow,
        info: colors.green,
        error: colors.red
    };

// Change calls of the object console
['log', 'info', 'error'].forEach(function(method) {
    var oldMethod = console[method].bind(console);
    console[method] = function() {
        var timeNow = new Date().toLocaleString('en-US', {hour12: false, timeZone: 'Europe/Kiev'}),
            extArgs = arguments,
            arguments = Object.keys(extArgs).map(function(key) { return extArgs[key]; });
        oldMethod.apply(console, [mapping[method](timeNow + ':')].concat(arguments));
    };
});

// Setup and configure Express http server. Expect a subfolder called 'site' to be the web root.
httpApp.use(express.static(__dirname + '/site/'));

httpApp.get(['/following*', '/following/*', '/profile*', '/profile/*', '/repo*', 'repo/*'], function(req, res) {
    console.log(req.url);
    res.sendFile(__dirname + '/site/index.html');
});

// Start Express http server on the port
console.info('Starting http server on the port ' + port);
console.info('Ctrl-C to abort');
http.createServer(httpApp).listen(port);
