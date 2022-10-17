const WebSocket = require('ws');
var http = require('http');
var express = require('express');
var app = express();
const PORT = 8080;

var server = new http.createServer({
}, app);

const wss = new WebSocket.Server({
    server
});

const heartbeat = (ws) => {
    ws.isAlive = true;
};

const ping = (client) => {
    // do some stuff
    console.log("ping to client");
};

wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => { heartbeat(ws) });
});

const interval = setInterval(() => {
    wss.clients.forEach((client) => {

        if (client.isAlive === false) {
            console.log("Terminate");
            return client.terminate();
        };

        client.isAlive = false;
        client.ping(() => { ping(client) });
    });
}, 5000);

wss.on('close', function close() {
    clearInterval(interval);
});

server.listen(PORT, ()=>{
    console.log( (new Date()) + " Server is listening on port " + PORT);
});