const WebSocket = require('ws');
var reconn = null;
const username = "ID001";
const URL = 'ws://localhost:8080';

const heartbeat = (ws) => {
  console.log("ping to server");
  clearTimeout(ws.pingTimeout);
};

function startWebsocket() {

  var ws = new WebSocket(URL, {
    perMessageDeflate: false,
    headers: {
        Authorization: Buffer.from(username).toString('base64'),
    },
  });

  var ping = () => { heartbeat(ws) };

  ws.on('ping', ping);

  ws.on('open', function() {
    clearInterval(reconn);
    ws.send("Hello from client");
  });

  ws.on('message', function(msg) {
    var data = JSON.parse(msg);
    console.log(data);
  });

  ws.on('error', (err)=>{
    console.log(err.message);
  });

  ws.on('close', () => {
    clearTimeout(ws.pingTimeout)
  });

  ws.on('close', function() {
    ws = null;
    reconn = setTimeout(startWebsocket, 5000);
  });

};

startWebsocket();