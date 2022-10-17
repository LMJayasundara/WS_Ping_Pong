const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

const heartbeat = (ws) => {
  console.log("ping to server");
  clearTimeout(ws.pingTimeout);

  ws.pingTimeout = setTimeout(() => {
    ws.terminate()
  }, 15000);
};

const ping = () => { heartbeat(ws) };

ws.on('ping', ping);
ws.on('open', ping);
ws.on('error', (err)=>{console.log(err.message);});
ws.on('close', () => {
  clearTimeout(ws.pingTimeout)
});