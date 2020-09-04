'use strict';

const io = require('socket.io-client');

class Queue {
    constructor(id){
        this.id = id;
        this.socket = io.connect('http://localhost:3000/caps');
    }

    trigger(event, payload){
        this.socket.emit(event, {clientId:this.id, payload});
    }

    subscribe(event, fn){
        this.socket.emit('subscribe', {event, clientId:this.id});
        this.socket.on(event, data => {
            console.log(data);
            let {orderId} = data;
            this.socket.emit('received', {orderId, event, clientId: this.id});
            fn(data);
        });
    
    }

}

module.exports = Queue;