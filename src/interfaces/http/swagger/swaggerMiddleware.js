const SwaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

module.exports = [SwaggerUi.serve, SwaggerUi.setup(swaggerDocument)];
