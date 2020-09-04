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
        delete queue[payload.orderId];
        logEvent('received', payload);

    });
    socket.on('pickup', payload => {

        //queue up pickup messages
        queue[payload.orderId] = payload;
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
    socket.on('getall', () => {
        for(const orderId in queue){
            const payload = queue[orderId];
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
