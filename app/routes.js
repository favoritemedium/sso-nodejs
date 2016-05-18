var ctrl = require('./controllers');
var Router = require('koa-router');

var router = new Router({
  prefix: '/api/auth'
});

router.post('/auth', ctrl.auth);
router.get('/foobar', ctrl.hello);

module.exports = router;

// vim: expandtab:ts=2:sw=2
//
