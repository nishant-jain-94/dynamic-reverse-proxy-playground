const http = require('http');
const express = require('express');
const axios = require('axios');
const httpProxy = require('http-proxy');

const app = express();

var proxy = httpProxy.createProxyServer({});

app.use('/register', async (req, res, next) => {
  // http://127.0.0.1:8500/v1/catalog/service/{serviceName}
  const response = await axios.get('http://127.0.0.1:8500/v1/catalog/service/NotificationService');
  var services = response.data;
  services.map((service) => {
    console.log(service.ServiceName);
    console.log(service.ServiceAddress);
    console.log(service.ServicePort);
    app.use(`/${service.ServiceName}`, (req, res) => {
      proxy.web(req, res, {
        target: `http://${service.ServiceAddress}:${service.ServicePort}`
      });
    });
  });
  res.send("Done");
});

const httpServer = http.createServer(app);
httpServer.listen(8000);