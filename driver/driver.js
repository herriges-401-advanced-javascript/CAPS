'use strict';

const Queue = require('./lib/queue');
const queue = new Queue('driver');

queue.subscribe('pickup', payload => {
    console.log('Picking Up', payload);
    handlePickup(payload);
});

queue.trigger('getall', 'pickup');

function handlePickup(payload){
    setTimeout(() => {
        queue.trigger('in-transit', payload.payload);
        handleDelivered(payload);
    }, 1500)
}

function handleDelivered(payload){
    setTimeout(() => {
        console.log(`Delivered` ,payload);
        queue.trigger('delivered', payload.payload);
    }, 3000)
}
