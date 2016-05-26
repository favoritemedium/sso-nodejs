var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Token = require('./token.js')

// User schema, contains user detail info, and link to multi auth records
var MemberSchema = new Schema({
  auth_records: [Schema.ObjectId],
  email: { type: String, required: true, unique: true, lowercase: true },
  full_name: { type: String },
}, {
  toJSON : {
    transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

MemberSchema.methods.sign_in = function *(candidate_pwd) {
  var token_rcd = yield Token.findOne({member_id: this.id});
  if (!token_rcd) {
    var token_rcd = yield Token.create({
      member_id: this.id,
      refresh_token_expire_at: 0,
      refresh_token: 'refresh_token', // required field needs string length greater than 0
      access_token_expire_at: 0,
      access_token: 'access_token'
    });
  }

  return yield token_rcd.reload_tokens();
}

MemberSchema.statics.find_by_token = function *(access_token) {
  var token_rcd = yield Token.findOne({access_token: access_token});
  if (!token_rcd) {
    return null
  }
  return this.findById(token_rcd.member_id);
}

module.exports = mongoose.model('Member', MemberSchema);

// vim: expandtab:ts=2:sw=2

