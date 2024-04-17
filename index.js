const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/:api',
  (req, res, next) => {
    const api = req.params.api;

    const target = `${api}.${api}.svc.cluster.local`;

    console.log(`[${new Date().toISOString()}] Target URL: ${target}`);

    req.proxyTarget = target;
    next();
  },
  createProxyMiddleware({
    target: function(req) { 

      return req.proxyTarget;
    },
    ws: true,
    on:{
        proxyReq: (proxyReq, req, res) => {
            // this request are being sent to the target server
            console.log(`[proxy request to target server] ${proxyReq.socket.connecting === true ? "Proxy Connection Trying to Established With Target Server" : "Establishing Proxy Connection Failed"}`);
            console.log(`[proxy request to target server] Protocol : ${proxyReq.protocol.split(':')} Host : ${proxyReq.host}`);
            },


        proxyRes: (proxyRes, req, res) => {
            console.log(`[target server respond to proxy server] Target Server Connected To Proxy Server`);
            },

        proxyReqWs: (proxyReq, req, socket, options, head) => {
            let isConnected = proxyReq.agent.sockets[`${target}:`][0].connecting;
            console.log(`[WebSocket requests to the target server] ${isConnected === true ? "Socket Connection Established" : "Establishing Socket Connection Failed"}`);
    
            },
        open: (proxySocket) => {
                console.log(`[connection] Proxy connection established`);
              },

        close: (res, socket, head) => {
            console.log('[connection closed] Proxy connection closed');
            },

      // for errors
      error:(err,req,res,target)=>{
        console.log(`[Proxy Err] ${err}`);
      }
    }
  }),
);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
