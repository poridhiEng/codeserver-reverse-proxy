const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

app.use(logger);

app.use('/:api',
  createProxyMiddleware({
    target:"http://localhost:6060",
    ws: true,
    // for built  in logging of HPM it will show up on our console
    logger:console,
    on:{
      proxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy Req] ${req.method} ${req.url} => ${proxyReq._headers.host}`);
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy Res] ${req.method} ${req.url} => ${proxyRes.socket._host}`);
      },
      // for web socket Requests
      proxyReqWs:(proxyReq,req,socket,options, head)=>{
        console.log(`[Proxy WS] ${req.method} ${req.url} => ${proxyReq._headers.host}`);
      },
      // for errors
      error:(err,req,res,target)=>{
        console.log(`[Proxy Err] ${err}`);
      }
    }
  })
)

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});