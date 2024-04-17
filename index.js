var net = require('net');
var url = require('url');

var server = net.createServer(function(socket) {
    socket.once('data', function(data) {
        var requestUrl = data.toString().split('\r\n')[0].split(' ')[1];
        var parsedUrl = url.parse(requestUrl);
        
        var namespace = parsedUrl.pathname.split('/')[1]; // Extract the namespace from the request URL
        
        if (namespace) {
            var targetUrl = namespace + '.' + namespace + '.svc.cluster.local';
            console.log('Target URL:', targetUrl);
            
            // Connect to the target server
            var targetSocket = net.connect(80, targetUrl, function() {
                console.log('TCP connection established with target URL:', targetUrl);
                
                // Once connected, relay data between the client and target
                socket.pipe(targetSocket);
                targetSocket.pipe(socket);
            });

            targetSocket.on('error', function(err) {
                console.error('Error connecting to target:', err);
                socket.end();
            });
        } else {
            console.error('Invalid request URL:', requestUrl);
            socket.end();
        }
    });
});

server.listen(3000, function() {
    console.log('TCP proxy server listening on port 3000');
});
