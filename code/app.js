const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));

// Register API router
//const api = require('./routes/index');
//app.use('/api', api);

app.get('/api', (req, res) => {
  res.json({status: "SUCCESSFUL"})
});

// Mongoose Setup
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds163825.mlab.com:63825/${process.env.MONGO_DB}`);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to mongodb');
});

module.exports = app;
