
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient(); //allows interaction with dynamodb table

 
const createError = require('http-errors');
const commonMiddleware = require("../lib/commonMiddleware");

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  try {
    const result = await dynamodb.query(params).promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }   
     

  const response = {
      statusCode: 200,
    //   headers: {
    //       'Content-Type': 'text/plain',
    //   },
      body: JSON.stringify(auctions),
  };
  return response;
};

exports.handler = commonMiddleware(getAuctions);