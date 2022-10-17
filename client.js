const WebSocket = require('ws');
var reconn = null;

const heartbeat = (ws) => {
  console.log("ping to server");
  clearTimeout(ws.pingTimeout);

  // ws.pingTimeout = setTimeout(() => {
  //   ws.terminate()
  // }, 5000);
};

function startWebsocket() {

  var ws = new WebSocket('ws://localhost:8080');
  var ping = () => { heartbeat(ws) };

  ws.on('ping', ping);

  ws.on('open', function() {
    // ping();
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