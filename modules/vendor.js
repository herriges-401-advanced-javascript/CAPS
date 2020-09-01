'use strict';

const events = require('../events');
require('dotenv').config();
let faker = require('faker');
const storeName = process.env.STORE;


setInterval(start, 5000);

function start(){
    let customerName = faker.name.findName();
    let address = faker.address.streetAddress();
    let orderId = faker.random.uuid();
    events.emit('pickup', {
        store: storeName,
        orderId,
        customer: customerName,
        address,       
    })
}

events.on('delivered', payload => {
    console.log(`VENDOR: Thank you for delivering ${payload.orderId}`); 
})

module.exports = {start};

