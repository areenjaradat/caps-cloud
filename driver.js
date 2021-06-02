'use strict';

require('dotenv').config();

const faker=require('faker');


const { Consumer } = require('sqs-consumer');



const { Producer } = require('sqs-producer');

const producer = Producer.create({
  queueUrl: `https://sqs.us-east-1.amazonaws.com/610185728176/vendor`,
  region: `us-east-1`,
});


 
const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/610185728176/401sqs',
  handleMessage: async (msg) => {
    let parsedBody = JSON.parse(msg.Body);
    let order = JSON.parse(parsedBody.Message);
    console.log(order);

    await info();
  },
});
 

app.on('error', (err) => {
  console.error(err.message);
});
 
app.on('processing_error', (err) => {
  console.error(err.message);
});
 
app.start();

function info() {
  setTimeout(async () => {
  
    try {
      const message = {
        id:faker.datatype.uuid(),
        body:'hello from the driver side',
       
      };
  
      const response = await producer.send(message);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  },  5000);
}