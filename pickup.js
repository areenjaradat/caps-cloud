'use strict';

require('dotenv').config();
const AWS = require('aws-sdk');

const faker = require('faker');


AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-east-1:610185728176:401sns';


let STORENAME = process.env.STORENAME || '401-d8 store';

function fakeorder() {
  let newOrder = {
    storeName:STORENAME,
    body:{
        orderId:faker.datatype.uuid(),
        customerName:faker.name.findName(),
        address:faker.address.cityName(),
    }
   
  }
  return newOrder;
}

async function setPickup(newOrder) {
 
    let params = {
      TopicArn: topic,
      Message: JSON.stringify(newOrder),
    };
    sns.publish(params).promise()
    .then(data => {
      console.log(data);
    })
    .catch(console.error);
}


setInterval(async () => {
  try {
    let newOrder = fakeorder();

    newOrder.body = JSON.stringify(newOrder.body);
    setPickup(newOrder);

    console.log('******************New Order!******************');
    console.log('Pickup Added:', newOrder);

  } catch (e) {
    console.error(e);
  }
}, 5000);