require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
global.logger = require("./util/logger");
global.dynamoose = require('./init_dynamoose').dynamoose;

const router = require('./router');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: process.env.FRONTEND_ENDPOINT ?
    process.env.FRONTEND_ENDPOINT.split(',') : '',
  optionsSuccessStatus: 200,
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly: true,
    secure: true,
    maxage: 1000 * 60 * 30,
  },
}));

// do not create x-powered-by: Express
app.disable('x-powered-by');

// add header for all request
app.use(function(req, res, next) {
  res.setHeader('charset', 'utf-8');
  res.setHeader('x-xss-protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // eslint-disable-next-line max-len
  res.setHeader('Strict-Transport-Security', '"max-age=31536000; includeSubdomains" always');
  // eslint-disable-next-line max-len
  res.setHeader('Content-Security-Policy', 'default-src * data:; script-src https: "unsafe-inline" "unsafe-eval"; style-src https: "unsafe-inline"');

  next();
});
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({
    message: 'Service Unavailable',
  });
});

// last process
app.use('/v1', router);

module.exports = app;
