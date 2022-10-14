const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8080
});

const heartbeat = (ws) => {
    ws.isAlive = true
};

const ping = (ws) => {
    // do some stuff
    console.log("ping to client");
};

wss.on("connection", (socket) => {
    socket.isAlive = true;
    socket.on('pong', () => { heartbeat(socket) });
});

const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            return ws.terminate()
        };

        ws.isAlive = false;
        ws.ping(() => { ping(ws) });
    });
}, 1000);

wss.on('close', function close() {
    clearInterval(interval);
});