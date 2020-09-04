'use strict';


// queue up messages

const queue = {
    // waiting for messages to queue
}

const io = require('socket.io')(process.env.PORT || 3000);

io.on('connection', socket => {
    console.log('CONNECTED', socket.id);
});

const caps = io.of('/caps');
caps.on('connection', socket => {
    socket.on('join', room => {
        console.log('joined', room);
        socket.join(room);
    });

    socket.on('received', payload => {
        console.log('payload', payload);
        console.log('queue', queue);
        delete queue[payload.event][payload.clientId][payload.orderId];
        console.log('queue', queue);
        logEvent('received', payload);

    });
    socket.on('pickup', payload => {
        console.log('payload', payload);
        //queue up pickup messages
        queue['pickup']['driver'][payload.payload.orderId] = payload;
        logEvent('pickup', payload);
        caps.emit('pickup', payload);
    });
    socket.on('in-transit', payload => {
        logEvent('in-transit', payload);
        caps.to(payload.store).emit('in-transit', payload);
    });
    socket.on('delivered', payload => {
        logEvent('delivered', payload);
        caps.to(payload.store).emit('delivered', payload);
    });
    socket.on('getall', payload => {
        console.log(payload);
        let event = payload.payload;
        let clientId = payload.clientId;
        for(const orderId in queue[event][clientId]){
            console.log('this is the queue', queue);
            const payload = queue[event][clientId][orderId];
            caps.emit('pickup', payload);
        };
    });
    socket.on('subscribe', payload => {
        let { event, clientId } = payload;
        if(!queue[event]) {
            queue[event] = {}; 
        }
        if(!queue[event][clientId]) {
            queue[event][clientId] ={};
        }
        socket.join(clientId);
    });
});

function logEvent(event, payload){
    console.log('EVENT', {
        event,
        time: new Date(),
        payload,
    })
}
