// Do not expose your credentials in the code for Production Environment.
let URI = require('./config').ATLASDB;

// Database setup
let mongoose = require('mongoose');

module.exports = function(){

    mongoose.connect(URI);
    let mongoDb = mongoose.connection;

    mongoDb.on('error', console.error.bind(console, 'Connection Error:'));
    mongoDb.once('open', ()=>{
        console.log('Connected to MongoDB...');
    });

    return mongoDb;
}