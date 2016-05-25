var bcrypt = require('co-bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../config/app')

// Token used for this SSO site
var TokenSchema = new Schema({
  member_id: { type: Schema.ObjectId, required: true },
  access_token: { type: String, required: true },
  access_token_expire_at: { type: Number, required: true },
  refresh_token: { type: String, required: true },
  refresh_token_expire_at: { type: Number, required: true },
});

TokenSchema.methods.reload_tokens = function *(candidate_pwd) {
  var current_epoch_seconds = new Date().getTime() / 1000;

  if (this.access_token_expire_at < current_epoch_seconds) {
    this.access_token_expire_at = current_epoch_seconds + config.access_token_expire_second;
    this.access_token = generate_token();
    yield this.save();
  }

  if (this.refresh_token_expire_at < current_epoch_seconds) {
    this.refresh_token_expire_at = current_epoch_seconds + config.refresh_token_expire_second;
    this.refresh_token = generate_token();
    yield this.save();
  }

  return {
    access_token: this.access_token,
    access_token_expire_at: this.access_token_expire_at,
    refresh_token: this.refresh_token,
    refresh_token_expire_at: this.refresh_token_expire_at
  }
}

var rand = function() {
  // Generate base 36 (0-9a-z) random number, and use substr to remove `0.`
  return Math.random().toString(36).substr(2);
}

var generate_token = function() {
  return rand() + rand();
}

module.exports = mongoose.model('Token', TokenSchema);

// vim: expandtab:ts=2:sw=2

