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
const http = require('http');
const https = require('https');
const { URL } = require('url');

const k8sFQDN = 'codeserver-python-service.code-server.svc.cluster.local'; // Replace with your Kubernetes service FQDN
const k8sPort = 443; // Adjust port as necessary
const proxyPort = 8080; // Port for the proxy server to listen on

const proxyServer = http.createServer((clientReq, clientRes) => {
  const options = {
    hostname: k8sFQDN,
    port: k8sPort,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers
  };

  const proxyReq = https.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, {
      end: true
    });
  });

  clientReq.pipe(proxyReq, {
    end: true
  });

  proxyReq.on('error', (err) => {
    console.error('Error occurred while making request to Kubernetes service:', err);
    clientRes.statusCode = 500;
    clientRes.end('Proxy Error');
  });
});

proxyServer.listen(proxyPort, () => {
  console.log(`Proxy server listening on port ${proxyPort}`);
});
