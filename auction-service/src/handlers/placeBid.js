
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient(); //allows interaction with dynamodb table

 
const createError = require('http-errors');
const commonMiddleware = require("../lib/commonMiddleware");
const getAuctionById = require('./getAuction');

async function placeBid(event,context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const { email } = event.requestContext.authorizer;
    const auction = await getAuctionById(id);

    // Bid identity validation
  if (email === auction.seller) {
    throw new createError.Forbidden(`You cannot bid on your own auctions!`);
  }

  // Avoid double bidding
  if (email === auction.highestBid.bidder) {
    throw new createError.Forbidden(`You are already the highest bidder`);
  }
       
    if (auction.status !== 'OPEN') {
      throw new createError.Forbidden(`You cannot bid on closed auctions!`);
    }
  
    if (amount <= auction.highestBid.amount) {
      throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
    }
  
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
      ExpressionAttributeValues: {
        ':amount': amount,
        ':bidder': email,
      },
      ReturnValues: 'ALL_NEW',
    };
  
    let updatedAuction;
    try {
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
      } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
      }
 
    
  const response = {
      statusCode: 200,
    //   headers: {
    //       'Content-Type': 'text/plain',
    //   },
      body: JSON.stringify({updatedAuction}),
  };
  return response;
};

exports.handler = commonMiddleware(placeBid);