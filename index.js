// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const app = express();

// function logger(req, res, next) {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// }

// app.use(logger);

// app.use(
//   '/:api',
//   (req, res, next) => {
//     // Extracting the :api parameter from the request URL
//     const api = req.params.api;
//     // Constructing the dynamic target URL
//     const target = `${api}.${api}.svc.cluster.local`;
//     // Logging the constructed target URL
//     console.log(`[${new Date().toISOString()}] Target URL: ${target}`);
//     // Updating the target option in the proxy middleware
//     req.proxyTarget = target;
//     next();
//   },
//   createProxyMiddleware({
//     target: function(req) { 
//       // Accessing the dynamically constructed target URL from the request object
//       return req.proxyTarget;
//     },
//     ws: true,
//     logLevel: 'debug',
//   }),
// );

// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });
const express = require('express');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const app = express();

const k8sFQDN = 'codeserver-python-service.code-server.svc.cluster.local'; // Replace with your Kubernetes service FQDN
const k8sPort = 443; // Adjust port as necessary
const proxyPort = 8080; // Port for the proxy server to listen on

// Route for simple ping
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Route for connecting to the Kubernetes service via FQDN
app.get('/connect', (req, res) => {
  const options = {
    hostname: k8sFQDN,
    port: k8sPort,
    path: req.url,
    method: 'GET', // Assuming it's always a GET request for simplicity
    headers: req.headers
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, {
      end: true
    });
  });

  proxyReq.on('error', (err) => {
    console.error('Error occurred while making request to Kubernetes service:', err);
    res.status(500).send('Proxy Error');
  });

  req.pipe(proxyReq, {
    end: true
  });
});

// Start the proxy server
app.listen(proxyPort, () => {
  console.log(`Proxy server listening on port ${proxyPort}`);
});
