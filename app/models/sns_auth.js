var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SnsAuthSchema = new Schema({
  provider: { type: String, required: true },
  id_token: { type: String, required: true },
  access_token: { type: String, required: true },
  access_token_expire_at: { type: Integer, required: true },
  refresh_token: { type: String, required: true },
  refresh_token_expire_at: { type: Integer, required: true },
});


// vim: expandtab:ts=2:sw=2

