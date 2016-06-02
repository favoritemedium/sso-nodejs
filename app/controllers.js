var config = require('../config/app');

const EmailAuth = require('./models/email_auth')
const Token = require('./models/token')
const SnsAuth = require('./models/sns_auth')
const Member = require('./models/member')

module.exports = function (app, passport) {
  var ctrl = {};

  ctrl.authParams = function* (next) {
    // Pass email
    this.checkBody('email').optional().isEmail('Please enter correct email');
    this.checkBody('password').optional().notEmpty();

    // Pass refresh token
    this.checkBody('rtoken').optional().notEmpty();

    // Pass provider
    this.checkBody('provider').optional().notEmpty();
    this.checkBody('id_token').optional().notEmpty();

    if (this.errors) {
      this.body = this.errors;
      return
    }

    var email = this.checkBody('email').value;
    var password = this.checkBody('password').value;
    var rtoken = this.checkBody('rtoken').value;
    var provider = this.checkBody('provider').value;
    var id_token = this.checkBody('id_token').value;

    if ((typeof email !== 'undefined') && (typeof password !== 'undefined')) {
      // Find by email and password
      var email_owner = yield EmailAuth.matchRecord(email, password);
      if (!email_owner) {
        return this.status = 401;
      }

      this.user = email_owner;
      this.signin_method = 'email';
      yield next;
    } else if (typeof rtoken !== 'undefined') {
      // Find by refresh token
      var token_owner = yield Tokens.findOne({
        refresh_token: rtoken,
        disabled: false
      });

      if (!token_owner) {
        // TODO: Log the error
        return this.status = 401;
      }

      this.user = token_owner;
      this.signin_method = 'refresh_token';
      yield next;
    } else if ((typeof provider !== 'undefined') && (typeof id_token !== 'undefined')) {
      // Find by provider and id_token
      var sns_owner = yield SnsAuth.matchRecord(provider, id_token);
      if (!sns_owner) {
        // TODO: Log the error
        return this.status = 401;
      }

      this.user = sns_owner;
      this.signin_method = 'sns';
      yield next;
    } else {
      this.body = {
        'error': 'Params error!'
      }
      return
    }
  }

  ctrl.updateSession = function* (next) {
    console.log('Update session');
    yield next;
  }

  ctrl.returnMemberInfo = function* (next) {
    var member = yield this.user.member();
    if (!member) {
      if (this.signin_method !== 'refresh_token') {
        this.body = {
          email: this.user.email,
          name: this.user.name,
          new_member: true
        }
      } else {
        member = yield this.user.createMember();
        var tokens = yield this.user.refreshTokens();
        this.body = Object.assign({}, member.toJSON(), tokens);
      }
    }
  }

  ctrl.signOut = function *() {
    this.checkBody('access_token').optional();
    // TODO: Find session and clear it
    var access_token = this.checkBody('access_token').value;
    if (typeof access_token !== 'undefined') {
      yield Token.update({access_token: access_token}, {disabled: true});
      this.body = 'ok'
    }
  }

  ctrl.verify = function* (next) {
    var access_token = this.request.body.access_token;
    var member = yield Member.findByToken(access_token);

    // TODO: Handle member not found correctly
    if (member) {
      this.body = member.toJSON();
    } else {
      this.body = 'aaaa';
    }
  }

  ctrl.hello = function* (next) {
    this.body = 'Hello'
  }


  return ctrl;
}

// vim: expandtab:ts=2:sw=2
