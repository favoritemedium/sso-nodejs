var LocalStrategy = require('passport-local').Strategy;
var EmailAuth = require('mongoose').model('EmailAuth');
var Member = require('mongoose').model('Member');
var co = require('co');

function AuthLocalUser(email, password, done) {
  co(function *() {
    try {
      var email_owner = yield EmailAuth.matchRecord(email, password);
      done(null, email_owner);
    } catch (ex) {
      console.log(ex);
      return null;
    }
  });
}

var serialize = function (email_auth, done) {
  done(null, email_auth._id);
}

var deserialize = function (id, done) {
  EmailAuth.findById(id, done);
}

module.exports = function (passport, config) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new LocalStrategy({
    usernameField: 'email',
    session: false
  }, AuthLocalUser));
}

// vim: expandtab:ts=2:sw=2

