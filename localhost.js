'use strict'
import fs from 'fs';
import http from 'http';
import https from 'https';

const sslkey = fs.readFileSync('../ssl-key.pem');
const sslcert = fs.readFileSync('../ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert,
  };

  export default (app, httpPort, httpsPort) => {
    https.createServer(options, app).listen(httpsPort, () => {
      console.log(`App running on port: ${httpsPort}`);
    });
  
    http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://localhost:${httpsPort}` + req.url,
      });
      res.end();
    })
    .listen(httpPort);
};

  