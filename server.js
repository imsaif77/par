const express = require('express')
const server = express()
const body_parser = require('body-parser')

const { port } = require('./config');

const app = require('./app');

// app.enable('trust proxy')

server.use(body_parser.json())


// app.use(function(request, response, next) {

//   if (process.env.NODE_ENV != 'development' && !request.secure) {
//      return response.redirect("https://" + request.headers.host + request.url);
//   }

//   next();
// })

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
