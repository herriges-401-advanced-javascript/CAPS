'use strict';

const io = require('socket.io')(process.env.PORT || 3000);

io.on('connection', socket => {
    console.log('CONNECTED', socket.id);
})

const caps = io.of('/caps');
caps.on('connection', socket => {
    socket.on('join', room => {
        console.log('joined', room);
        socket.join(room);
    });
    socket.on('pickup', payload => {
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
});

function logEvent(event, payload){
    console.log('EVENT', {
        event,
        time: new Date(),
        payload,
    })
}
