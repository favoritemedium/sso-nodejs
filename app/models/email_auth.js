var co = require('co');
var bcrypt = require('co-bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Member = require('./member.js')

var EmailAuthSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  toJSON : {
    transform: function (doc, ret, options) {
      delete ret.password;
    }
  }
});

EmailAuthSchema.pre('save', function (done) {
  if (!this.isModified('password')) {
    return done();
  }

  co.wrap( function *() {
    try {
      var salt = yield bcrypt.genSalt();
      var hash = yield bcrypt.hash(this.password, salt);
      this.password = hash;
      done();
    } catch (err) {
      done(err);
    }
  }).call(this, done);
});

EmailAuthSchema.methods.comparePassword = function *(candidate_pwd) {
  return yield bcrypt.compare(candidate_pwd, this.password);
}

EmailAuthSchema.methods.refreshTokens = function *() {
  // 1. Find or create Member record
  var member = yield Member.findOne({email: this.email});
  console.log(member);
  // 2. Find or create associated Token record
  // 3. Refresh token
}

EmailAuthSchema.statics.matchRecord = function *(email, password) {
  var rcd = yield this.findOne({'email': email}).exec();
  if (rcd && (yield rcd.comparePassword(password))) {
    return rcd;
  }

  throw new Error ('Auth error, please check input')
}

module.exports = mongoose.model('EmailAuth', EmailAuthSchema);

// vim: expandtab:ts=2:sw=2

