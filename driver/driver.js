'use strict';

const net = require('net');
const client = new net.Socket();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

client.connect(port, host, () => {});
client.on('data', function (data) {
    let status = JSON.parse(data.toString().trim());
    if(status.event === 'pickup'){
        handlePickup(status);
        handleDelivered(status);
    }
});

function handlePickup(payload){
    setTimeout(() => {
        console.log(`picking up ${payload.payload.orderId}`);
        let message = {
            event: 'in-transit',
            time: new Date(),
            payload: payload.payload,
        }
        message = JSON.stringify(message);
        client.write(message);
    }, 1000)
}

function handleDelivered(payload){
    setTimeout(() => {
        console.log(`Delivered order ${payload.payload.orderId}`)
        let message = {
            event: 'delivered',
            time: new Date(),
            payload: payload.payload,
        }
        message = JSON.stringify(message);
        client.write(message);
    }, 3000)
}


