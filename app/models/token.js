var bcrypt = require('co-bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Token used for this SSO site
var TokenSchema = new Schema({
  member_id: { type: Schema.ObjectId, required: true },
  access_token: { type: String, required: true },
  access_token_expire_at: { type: Integer, required: true },
  refresh_token: { type: String, required: true },
  refresh_token_expire_at: { type: Integer, required: true },
});

module.exports = mongoose.model('Token', TokenSchema);

// vim: expandtab:ts=2:sw=2

