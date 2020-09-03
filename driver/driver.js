'use strict';

const io = require('socket.io-client');
const capsChannel = io.connect('http://localhost:3000/caps');
capsChannel.emit('join', 'driver');

capsChannel.on('pickup', payload => {
    handlePickup(payload);
    handleDelivered(payload);
});


function handlePickup(payload){
    setTimeout(() => {
        console.log(`picking up ${payload.orderId}`);
        let message = {
            event: 'in-transit',
            time: new Date(),
            payload: payload.payload,
        }
        capsChannel.emit('in-transit', payload);
    }, 1500)
}

function handleDelivered(payload){
    setTimeout(() => {
        console.log(`Delivered order ${payload.orderId}`)
        let message = {
            event: 'delivered',
            time: new Date(),
            payload: payload.payload,
        }
        capsChannel.emit('delivered', payload);
    }, 3000)
}
