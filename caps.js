'use strict';

const events = require('./events');
require('./modules/driver');
require('./modules/vendor');


events.on('pickup', payload => log('pickup', payload));
events.on('in-transit', payload => log('in-transit', payload));
events.on('delivered', payload => log('delivered', payload));

// TODO: why does this method return [object Object]?

// function log(event, payload) {
//     console.log(`EVENT ${{
//         event: event,
//         time: new Date(),
//         payload: payload,
//     }}`)
// }

function log(event, payload) {
    console.log('EVENT', {
        event: event,
        time: new Date(),
        payload,
    })
}