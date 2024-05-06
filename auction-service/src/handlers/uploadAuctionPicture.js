 async function uploadAuctionPicture(event) {
    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  }
  
  exports.handler = uploadAuctionPicture;