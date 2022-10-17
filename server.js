const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8080
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
}, 10000);

wss.on('close', function close() {
    clearInterval(interval);
});