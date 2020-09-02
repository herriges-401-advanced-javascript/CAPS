'use strict';

const net = require('net');

const port = process.env.PORT || 3000;
const server = net.createServer();

server.listen(port, () => {
    console.log(`Server up on ${port}`);
});

let socketPool = {};

server.on('connection', (socket) => {
    const id = `Socket-${Math.random()}`;
    socketPool[id] = socket;

    socket.on('data', (buffer) => dispatchEvent(buffer));
    socket.on('error', (e) => { console.log('SOCKET ERROR', e); });
    socket.on('end', (e) => { delete socketPool[id]; });

})

server.on('error', (e) => {
    console.error('SERVER ERROR', e.message);
});

function dispatchEvent(buffer) {
    let message = JSON.parse(buffer.toString().trim());
    if(message.event && message.payload){
        console.log('EVENT', message);
        broadcast(message);
    } else {
        console.log('incoming data requires an "event" property and a "payload" property'); // TODO: figure out something better here/send a message back to client saying that there needs to be an event and a payload
    }
}

function broadcast(message){
    let payload = JSON.stringify(message);
    for(let socket in socketPool){
        socketPool[socket].write(payload);
    }
}