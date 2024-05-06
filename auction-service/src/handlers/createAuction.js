
const { v4: uuid } = require('uuid');
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient(); //allows interaction with dynamodb table

const createError = require('http-errors');
const commonMiddleware = require('../lib/commonMiddleware');

async function createAuction(event, context) {

  const title = event.body;
  const { email } = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title, //same like title:'title'
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };

  try{
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }


  const response = {
      statusCode: 201,
      headers: {
          'Content-Type': 'text/plain',
      },
      body: JSON.stringify({auction}),
  };
  return response;
};

 
 

exports.handler = commonMiddleware(createAuction);