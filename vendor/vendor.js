'use strict';

const net = require('net');
const client = new net.Socket();
const faker = require('faker');
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
require('dotenv').config();

client.connect(port, host, () => {});
client.on('data', function (data) {
    let status = JSON.parse(data.toString().trim());
    if(status.event === 'delivered'){
        console.log(`Thank you for delivering ${status.payload.orderId}`)
    }
});
setInterval(sendPackage, 5000);

function sendPackage(){
    let newPackage = JSON.stringify(generateOrderData());
    client.write(newPackage);
}

function generateOrderData(){
    return {
        event: 'pickup',
        time: new Date(),
        payload: {
            store: process.env.STORE,
            orderId: faker.random.uuid(),
            customer: faker.name.findName(),
            address: faker.address.streetAddress(),
        }
    }
}