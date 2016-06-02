'use strict';

var bcrypt = require('co-bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../config/app')

// Token used for this SSO site
var TokenSchema = new Schema({
  member_id: {
    type: Schema.ObjectId,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false
  },
  access_token: {
    type: String,
    required: true
  },
  access_token_expire_at: {
    type: Number,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  refresh_token_expire_at: {
    type: Number,
    required: true
  },
});

TokenSchema.methods.reloadTokens = function* (candidate_pwd) {
  var current_epoch_seconds = new Date().getTime() / 1000;

  if (this.access_token_expire_at < current_epoch_seconds) {
    this.access_token_expire_at = current_epoch_seconds + config.access_token_expire_second;
    this.access_token = generateToken();
    yield this.save();
  }

  if (this.refresh_token_expire_at < current_epoch_seconds) {
    this.refresh_token_expire_at = current_epoch_seconds + config.refresh_token_expire_second;
    this.refresh_token = generateToken();
    yield this.save();
  }

  return {
    access_token: this.access_token,
    access_token_expire_at: this.access_token_expire_at,
    refresh_token: this.refresh_token,
    refresh_token_expire_at: this.refresh_token_expire_at
  }
}

TokenSchema.methods.member = function* () {
  return yield Member.findById(this.member_id);
}

TokenSchema.methods.createMember = function* () {
  var member = yield Member.create({});
  this.member_id = member.id;
  yield this.save();
  return member;
}

var rand = function () {
  // Generate base 36 (0-9a-z) random number, and use substr to remove `0.`
  return Math.random().toString(36).substr(2);
}

var generateToken = function () {
  return rand() + rand();
}

module.exports = mongoose.model('Token', TokenSchema);

// vim: expandtab:ts=2:sw=2
