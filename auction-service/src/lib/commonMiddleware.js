
const middy = require('@middy/core');
// Import some middlewares
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');
const getAuctionsSchema = require('./schemas/getAuctionsSchema');



function middlewares(handler){
    return middy(handler)
    .use([
      httpJsonBodyParser(),
      httpEventNormalizer(),
      httpErrorHandler(),
    ]);
  }  

module.exports = middlewares;