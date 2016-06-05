module.exports = function (app, Router, passport) {

  var ctrl = require('./controllers')(app, passport);

  var router = new Router({
    prefix: '/api/auth'
  });

  router.get('/sso', ctrl.sso)

  // Sign in user
  // Params (select one from three):
  //  - email / password
  //  - refresh token
  //  - provider / id_token
  // Response:
  // - Success
  //  * refresh token / new refresh token (received refresh token)
  //  * refresh token expiry / new refresh token expiry (received refresh token)
  //  * member info
  // - Failure
  //  Different type of errors
  router.post('/signin',
    ctrl.authParams,
    ctrl.updateSession,
    ctrl.processSuccessfulSignin);

  // Sign out user, clear session and invalid auth token if provided
  // Params:
  //  - auth token (opt)
  // Response: None
  router.post('/signout', ctrl.signOut);

  router.post('/connect', function* () {});
  router.post('/email/check', function* () {});
  router.post('/email/verify', function* () {});
  router.post('/new', function* () {});
  router.post('/password', function* () {});

  router.get('/list', function* () {});
  router.post('/add', function* () {});
  router.post('/clear', function* () {});
  router.post('/delete', function* () {});
  router.get('/accounts', function* () {});
  router.post('/primary', function* () {});
  router.post('/remove', function* () {});

  // router.post('/auth', passport.authenticate('local', {
  //   failureRedirect: '/api/auth/auth',
  //   session: false
  // }), ctrl.return_user_info);

  router.post('/verify', ctrl.verify);

  return router;
}

// vim: expandtab:ts=2:sw=2
