const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const session = require('express-session');

const TWO_HOURS = 1000*60*60*2;


// Parse JSON request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// .env variables
const {
  PORT = 3000,
  NODE_ENV = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!quiet,it\'asecret!',
  SESS_LIFETIME = TWO_HOURS,
} = process.env;

const IN_PROD = NODE_ENV === 'production';

// session config
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD,
  }
}))

// add routers
const api = require('./routers.js')
app.use('/', api)



app.listen(PORT, console.log(
  `http://test:${PORT}`
))


