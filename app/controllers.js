var ctrl = {};

ctrl.auth = function *(next){
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
        // Auth with email
        // TODO: Query EmailAuth table with email and password
        // TODO: Signin user, generate tokens and return ok if verified
        // TODO: Return error if not verified
    } else if (typeof rtoken !== 'undefined') {
        // Auth with refresh token
        // TODO: Find refresh token in Token table
        // TODO: Signin user, generate tokens and return ok if verified
        // TODO: Return error if not verified
    } else if ((typeof provider !== 'undefined') && (typeof id_token !== 'undefined')) {
        // Auth with SNS provider
    } else {
        console.log('----------');
        this.body = { 'error': 'Params error!' }
        return
    }
}

ctrl.hellp = function *(next) {
    this.body = "Hello What?"
}

module.exports = ctrl;

// vim: expandtab:ts=2:sw=2

