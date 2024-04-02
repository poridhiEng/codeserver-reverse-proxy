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
  createProxyMiddleware({
    target: 'http://localhost:6060',
    ws: true,
    logLevel: 'debug', 
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] ${req.method} ${req.url} => ${proxyReq._headers.host}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[Proxy] ${req.method} ${req.url} => ${proxyRes.socket._host}`);
    },
  }),
);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
