'use strict';

const faker = require('faker');
const host = process.env.HOST || 'localhost'; // TODO: currently not in use
const port = process.env.PORT || 3000; // TODO: currently not in use
require('dotenv').config();
const io = require('socket.io-client');
const store = '1-206-flowers';//process.env.STORE;

const capsChannel = io.connect('http://localhost:3000/caps');
capsChannel.emit('join', store);
capsChannel.on('delivered', logDelivered);
setInterval(sendPackage, 5000);

function sendPackage(){
    let newPackage = generateOrderData();
    capsChannel.emit('pickup', newPackage);
}

function generateOrderData(){
    return {
        store: store,
        orderId: faker.random.uuid(),
        customer: faker.name.findName(),
        address: faker.address.streetAddress(),
    }
}

function logDelivered(payload){
    console.log(`thank you for delivering ${payload.orderId}`);
}
