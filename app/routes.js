var ctrl = require('./controllers');
var Router = require('koa-router');

var router = new Router({
    prefix: '/api/auth'
});


router.post('/auth', ctrl.auth);

module.exports = router;

