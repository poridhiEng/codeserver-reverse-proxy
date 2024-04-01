var http = require('http'),
    httpProxy = require('http-proxy'),
    express = require('express');

// Logger function
function logger(message) {
  console.log(new Date().toISOString() + ' - ' + message);
}

// create a server
var app = express();
var proxy = httpProxy.createProxyServer({ target: 'http://localhost:8080', ws: true });
var server = require('http').createServer(app);

// proxy HTTP GET / POST
app.get('/*', function(req, res) {
  logger("Proxying GET request: " + req.url);
  proxy.web(req, res, {});
});
app.post('/chat/*', function(req, res) {
  logger("Proxying POST request: " + req.url);
  proxy.web(req, res, {});
});

// Proxy websockets
server.on('upgrade', function (req, socket, head) {
  logger("Proxying WebSocket upgrade request: " + req.url);
  proxy.ws(req, socket, head);
});

// serve static content
app.use('/', express.static(__dirname + "/public"));

server.listen(9000, function() {
  logger('Server is running on port 9000');
});
