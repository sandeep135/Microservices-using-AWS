
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient(); //allows interaction with dynamodb table

 
const createError = require('http-errors');
const commonMiddleware = require("../lib/commonMiddleware");

async function getAuctionById(id) {
    let auction;
  
    try {
      const result = await dynamodb.get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      }).promise();
  
      auction = result.Item;
    } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  
    if (!auction) {
      throw new createError.NotFound(`Auction with ID "${id}" not found!`);
    }
  
    return auction;
}
 

async function getAuction(event,context) {
    const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
 
    
  const response = {
      statusCode: 200,
    //   headers: {
    //       'Content-Type': 'text/plain',
    //   },
      body: JSON.stringify(auction),
  };
  return response;
};

exports.handler = commonMiddleware(getAuction);
module.exports = getAuctionById;
