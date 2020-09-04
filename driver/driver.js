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
        queue.trigger('in-transit', payload);
        handleDelivered(payload);
    }, 1500)
}

function handleDelivered(payload){
    setTimeout(() => {
        queue.trigger('delivered', payload);
    }, 3000)
}
