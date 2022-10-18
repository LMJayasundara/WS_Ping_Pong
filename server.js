const WebSocket = require('ws');
var http = require('http');
var express = require('express');
var app = express();
const PORT = 8080;
// const onlineclients = new Set();
const connected_clients = new Map();

var server = new http.createServer({
}, app);

const wss = new WebSocket.Server({
    server,
    verifyClient: function (info, cb) {
        var authentication = Buffer.from(info.req.headers.authorization,'base64').toString('utf-8');
        var loginInfo = authentication.trim().split(':');
        info.req.identity = loginInfo[0];
        cb(true, 200, 'Authorized');
    }
});

const heartbeat = (ws) => {
    console.log("Pong from client: "+ ws.id);
    ws.isAlive = true;
};

const ping = (client) => {
    // do some stuff
    console.log("Ping to client: " + client.id);
};

wss.on("connection", (ws, request) => {
    ws.isAlive = true;
    ws.id = request.identity;
    // onlineclients.add(request.identity);
    connected_clients.set(ws.id, ws);

    // wss.clients.forEach(function (client) {
    //     if(client.id == ws.id){
    //     };
    // });

    console.log("Connected Charger ID: "  + ws.id);
    ws.on('pong', () => { heartbeat(ws) });

    ws.on('close', function close() {
        console.log("Disconnected Charger ID: " + ws.id);
        // onlineclients.delete(ws.id);
        connected_clients.delete(ws.id);
        // console.log(connected_clients);
    });
});

const interval = setInterval(() => {
    console.log("Try to ping...");
    
    // wss.clients.forEach((client) => {
    Array.from(connected_clients.values()).forEach((client) => {
        if (client.isAlive === false) {
            console.log("Terminate Client...");
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