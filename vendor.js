'use strict';

const AWS = require('aws-sdk');
const faker = require('faker');

const storeName=process.env.STORE || '401store';
AWS.config.update({region:'us-east-1'});
const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-east-1:610185728176:401sns';

setInterval(() => {
  const message = {
    storeName:storeName,
    orderId:faker.datatype.uuid(),
    customerName:faker.name.findName(),
    address:faker.address.cityName(),
    vendorId: 'arn:aws:sqs:us-east-1:610185728176:vendor',
  };

  const payload = {
    Message: JSON.stringify(message),
    TopicArn: topic,
  };

  sns.publish(payload).promise()
    .then(data => {
      console.log(data);
    })
    .catch(console.error);
}, 5000);


const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/610185728176/vendor',
  handleMessage: handler,
});

function handler(message) {
  console.log(message.Body);
}

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();