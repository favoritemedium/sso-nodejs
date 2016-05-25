const co = require('co');
const mongoose = require('mongoose');
const config = require('../config/app');

mongoose.connect(config.mongo_connect_str);
mongoose.connection.on('error', function (err) {
    console.log(err);
});

const EmailAuth = require('../app/models/email_auth.js')

var rawDocuments = [
    {email: 'foo@bar.com', password: 'passw0rd'},
    {email: 'foo1@bar.com', password: 'passw1rd'},
    {email: 'foo2@bar.com', password: 'passw2rd'},
    {email: 'foo3@bar.com', password: 'passw3rd'}
];

for (var doc of rawDocuments) {
    new EmailAuth(doc).save();
}

