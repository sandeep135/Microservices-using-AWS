
const getEndedAuctions = require('../lib/getEndedAuctions');
const closeAuction = require('../lib/closeAuctions');
const createError = require('http-errors');

async function processAuctions(event,context){
    try {
        const auctionsToClose = await getEndedAuctions();
        const closePromises = auctionsToClose.map(auction => closeAuction(auction));
        await Promise.all(closePromises);
        return { closed: closePromises.length };
      } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
      }
}

exports.handler = processAuctions;