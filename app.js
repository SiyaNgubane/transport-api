/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

/* configure .env as early as possible on the app */
const dotENV = require('dotenv');
dotENV.config();

const cors = require('cors');
const express = require('express');
const body_parser = require('body-parser');
const swagger_js_doc = require('swagger-jsdoc');
const swagger_ui = require('swagger-ui-express');

const user_routes = require('./src/api/routes/user');

const app = express();
const API_PORT = process.env.PORT || 5000;

// Extended: https://swagger.io/specification/#infoObject
const swagger_options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: '',
      version: '1.0.0',
      description: '',
      license: {
        name: 'LIC',
        url: 'https://swagger.io'
      },
      contact: {
        name: 'Developer',
        url: 'https://swagger.io',
        email: "Info@SmartBear.com"
      }
    },
    servers: [
      {
        description: 'The local API server',
        url:'http://localhost:5000'
      }
    ]
  },
  apis: ['./src/api/routes/*.js']
};

app.use(cors());
app.use(body_parser.json());
const swagger_docs = swagger_js_doc(swagger_options);

user_routes(app);

app.use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_docs));

app.listen(API_PORT, () => console.log('Server is listening on', API_PORT));

module.exports = app;