'use strict';

var config = require('../../config/app');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SnsAuthSchema = new Schema({
  member_id: {
    type: Schema.ObjectId,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  id_token: {
    type: String,
    required: true
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

SnsAuthSchema.methods.member = function* () {
  return yield Member.findById(this.member_id);
}

SnsAuthSchema.methods.createMember = function* () {
  var member = yield Member.create({});
  this.member_id = member.id;
  yield this.save();
  return member;
}

SnsAuthSchema.statics.matchRecord = function* (provider, id_token) {
  if (config.allowed_providers.indexOf(provider) == -1) {
    throw new Error('Unknown Provider')
  }

  var rcd = yield this.findOne({
    provider: provider,
    id_token: id_token
  });

  if (rcd) {
    return rcd;
  }
}


// vim: expandtab:ts=2:sw=2
