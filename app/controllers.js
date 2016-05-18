var ctrl = {};

ctrl.auth = function *(next) {
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
    if (auth_by_email_password(email, password)) {
      signin(email, password);
    } else {
      // TODO: Return error
    }
  } else if (typeof rtoken !== 'undefined') {
    if (auth_by_refresh_token(rtoken)) {
    } else {
    }
    // TODO: Signin user, generate tokens and return ok if verified
    // TODO: Return error if not verified
  } else if ((typeof provider !== 'undefined') && (typeof id_token !== 'undefined')) {
    if (auth_by_provider_token(rtoken)) {
    } else {
    }
  } else {
    console.log('----------');
    this.body = { 'error': 'Params error!' }
    return
  }
}

ctrl.hello = function *(next) {
  console.log(this.pg);
  var result = yield this.pg.db.client.query_('SELECT now()');
  console.log('result:', result);

  this.body = result.rows[0].now.toISOString()
}

/////////////////////////////
// Help functions
/////////////////////////////

// Auth by email and password
auth_by_email_password = function(email, password) {
  // TODO: Query EmailAuth table with email and password
  return true;
}

// Auth by refresh token
auth_by_refresh_token = function(refresh_token) {
  // TODO: Find refresh token in Token table
  return true;
}

// Auth by provider and id_token
auth_by_provider_token = function(provider, id_token) {
  // TODO: Find refresh token in SnsAuth table
  return true;
}

signin = function(email, password) {
  // TODO: Signin user, generate tokens
}

module.exports = ctrl;

// vim: expandtab:ts=2:sw=2

