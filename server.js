// Load required modules
var http    = require('http'),         // http server core module
    request = require('request'),
    port    = process.env.PORT || 8080,
    colors = require("cli-color"),
    express = require('express'),       // web framework external module
    fs = require('fs'),
    httpApp = express(),
    bodyParser = require('body-parser'),
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
// to support JSON-encoded bodies
httpApp.use(bodyParser.json());
// to support URL-encoded bodies
httpApp.use(bodyParser.urlencoded({
    extended: true
}));

httpApp.get(['/following*', '/following/*', '/profile*', '/profile/*', '/repo*', 'repo/*'], function(req, res) {
    console.log(req.url);
    res.sendFile(__dirname + '/site/index.html');
});

httpApp.post('/activity', function(req, res) {
    var options = {
        method: 'GET',
        baseUrl: 'https://github.com',
        uri: '/users/' + req.body.user + '/contributions',
        headers: {
            accept: 'text/html',
            'accept-encoding': '*',
            'accept-language': 'en-US',
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36'
        }
    };
    console.log(req.url, req.body);
    request(options, function (error, response, body) {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            res.setHeader('content-type', 'text/html; charset=utf-8');
            res.status(200).send(body);
        }
    });
});

// Start Express http server on the port
console.info('Starting http server on the port ' + port);
console.info('Ctrl-C to abort');
http.createServer(httpApp).listen(port);
