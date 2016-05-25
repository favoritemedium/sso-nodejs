'use strict';

var koa = require('koa');
var Router = require('koa-router');
var logger = require('koa-logger');
var mongoose = require('mongoose');
var passport = require('koa-passport');
var bodyParser = require('koa-bodyparser');


var app = module.exports = koa();
var config = require('./config/app');
var ctrl = require('./app/controllers')

app.use(logger());
app.use(bodyParser());

require('koa-validate')(app);
require('./config/passport')(passport, config);

// Connect to DB
mongoose.connect(config.mongo_connect_str);
mongoose.connection.on('error', function (err) {
    console.log(err);
});

const EmailAuth = require('./app/models/email_auth.js')


// Routes
var router = new Router({
  prefix: '/api/auth'
});

router.post('/auth', passport.authenticate('local', {
  failureRedirect: '/api/auth/auth',
  session:false
}), function*(next) {
  var member = yield this.req.user.member();
  var tokens = yield this.req.user.refreshTokens();
  var response_json = Object.assign({}, member.toJSON(), tokens)
  this.body = response_json;
});


app.on('error', function(err,ctx){
  if (process.env.NODE_ENV != 'test') {
    console.log(err.message);
    console.log(err);
  }
});

app.use(passport.initialize());
app.use(router.routes());
//app.use(router.middleware());
app.use(router.allowedMethods());


app.listen(3000);

// vim: expandtab:ts=2:sw=2

