const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require("body-parser");
// const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const getApi = require('./services/ApiService') ;
const clientApiKeyValidation = require('./common/authUtils');
const securityutil = require('./routes/securityRoutes');


// const db = require('./db');
// const VerifyToken = require('./auth/VerifyToken')

// Calling the Routes 
const generateRoutes = require('./routes/generateRoutes');
const bitcoinRoutes = require('./routes/bitcoinRoutes');
const ethereumRoutes = require('./routes/ethereumRoutes');
const tronRoutes = require('./routes/tronRoutes');
const altcoinsRoutes = require('./routes/altcoinsRoutes');
const authRoutes = require('./routes/authRoutes');
const stellarRoutes = require('./routes/stellarRoutes');
const dogecoinRoutes = require('./routes/dogeRoutes');
const bscRoutes = require('./routes/bscRoutes');





// Calling the Error Handlers
const globalErrHandler = require('./controllers/errorController.js');
const AppError = require('./utils/appError');
const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// API Key Service Call
const apiService = require('./routes/ApiServiceRoutes');
// app.use(clientApiKeyValidation.clientApiKeyValidation);
const apikeyvalidator = clientApiKeyValidation.clientApiKeyValidation;

// Limit request from the same API 
// const limiter = rateLimit({
//     max: 150,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too Many Request from this IP, please try again in an hour'
// });
// app.use('/api/v1', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '100kb'
}));

// Data sanitization against Nosql query injection
// app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Setting Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.json({ type: 'application/*+json' }));
app.use(upload.array()); 
app.use(express.static('public'));


// Setting Up API Key Handler for All System APIs
// app.use(getApi.getApi(process.env.apikey,process.env.uuid));

app.get('/', (req, res) => {
    res.send(`You hit home page!\n`)
})

// Routes
app.use('/api/v1/generate',apikeyvalidator,generateRoutes);
app.use('/api/v1/bitcoin',apikeyvalidator, bitcoinRoutes);
app.use('/api/v1/ethereum',apikeyvalidator, ethereumRoutes);
app.use('/api/v1/tron',apikeyvalidator, tronRoutes);
app.use('/api/v1/utxocoins',apikeyvalidator, altcoinsRoutes);
app.use('/api/v1/auth',apikeyvalidator, authRoutes);
app.use('/api/v1/stellar',apikeyvalidator,stellarRoutes);
app.use('/api/v1/dogecoin',apikeyvalidator, dogecoinRoutes);
app.use('/api/v1/bsc',apikeyvalidator, bscRoutes);

// API service creation Route
app.use('/admin/v1/service',apiService);
app.use('/admin/v1/security',securityutil);


// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
  });


app.use(globalErrHandler);

module.exports = app;