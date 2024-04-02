const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

app.use(logger);

app.use(
  '/:api',
  (req, res, next) => {
    // Extracting the :api parameter from the request URL
    const api = req.params.api;
    // Constructing the dynamic target URL
    const target = `${api}.${api}.svc.cluster.local`;
    // Logging the constructed target URL
    console.log(`[${new Date().toISOString()}] Target URL: ${target}`);
    // Updating the target option in the proxy middleware
    req.proxyTarget = target;
    next();
  },
  createProxyMiddleware({
    target: function(req) { 
      // Accessing the dynamically constructed target URL from the request object
      return req.proxyTarget;
    },
    ws: true,
    logLevel: 'debug',
  }),
);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
