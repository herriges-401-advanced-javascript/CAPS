'use strict';

const express = require('express');
const cors = require('cors');
const faker = require('faker');

const Queue = require('./lib/queue');
const queue = new Queue('api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const PORT = 3001;

app.post('/delivery/:store/:code', (req, res) => {
    if(!(req.params.store && req.params.code)) { throw 'Invalid Delivery Params'};
    const message = {
        store: req.params.store,
        code: req.params.code,
    };

    queue.trigger('delivered', message);
    res.status(200).send('scheduled');
});

app.post('/pickup', (req, res) => {
    let delivery = (Object.keys(req.body).length && req.body) || {
        store: '1-206-flowers',
        orderId: faker.random.uuid(),
        customer: faker.name.findName(),
        address: faker.address.streetAddress(),
    }

    queue.trigger('pickup', delivery);
    res.status(200).send('scheduled');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));