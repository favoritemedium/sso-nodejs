'use strict';

var koa = require('koa');
var Router = require('koa-router');
var logger = require('koa-logger');
var mongoose = require('mongoose');
var session = require('koa-session');
var passport = require('koa-passport');
var bodyParser = require('koa-bodyparser');


var app = module.exports = koa();
var config = require('./config/app');
var ctrl = require('./app/controllers')

app.keys = [config.session_key]

app.use(logger());
app.use(session(app));
app.use(bodyParser());

require('koa-validate')(app);
require('./config/passport')(passport, config);

var router = require('./app/routes')(app, Router, passport)

// Connect to DB
mongoose.connect(config.mongo_connect_str);
mongoose.connection.on('error', function (err) {
  console.log(err);
});

app.on('error', function (err, ctx) {
  if (process.env.NODE_ENV != 'test') {
    console.log(err.message);
    console.log(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(router.routes());
app.use(router.middleware());
app.use(router.allowedMethods());


app.listen(3000);

// vim: expandtab:ts=2:sw=2
