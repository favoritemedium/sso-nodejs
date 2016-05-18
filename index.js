'use strict';

var koa = require('koa');
var router = require('./app/routes');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');

var app = koa();

app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

require('koa-validate')(app);

app.on('error', function(err,ctx){
    if (process.env.NODE_ENV != 'test') {
        console.log(err.message);
        console.log(err);
    }
});

app.listen(3000);

// vim: expandtab:ts=2:sw=2

