var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User schema, contains user detail info, and link to multi auth records
var MemberSchema = new Schema({
  auth_records: [Schema.ObjectId],
  email: { type: String, required: true, unique: true, lowercase: true },
  full_name: { type: String },
});

module.exports = mongoose.model('Token', TokenSchema);

// vim: expandtab:ts=2:sw=2

