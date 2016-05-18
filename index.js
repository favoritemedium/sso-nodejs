'use strict';

var koa = require('koa');
var koaPg = require('koa-pg')
var Router = require('koa-router');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');

var app = module.exports = koa();
var config = require('./config');

app.use(logger());
app.use(bodyParser());
app.use(koaPg(config.pg_connect_str));

require('koa-validate')(app);

var ctrl = require('./app/controllers')
var router = require('./app/routes')

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', function(err,ctx){
  if (process.env.NODE_ENV != 'test') {
    console.log(err.message);
    console.log(err);
  }
});

app.listen(3000);

// vim: expandtab:ts=2:sw=2

