const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

const heartbeat = (ws) => {
    console.log("ping to server");
    clearTimeout(ws.pingTimeout);
};

const ping = () => { heartbeat(ws) };

ws.on('ping', ping)
//.on('open', ping)
  ws.on('error', (err)=>{console.log(err.message);})
  .on('close', () => {
    clearTimeout(ws.pingTimeout)
});