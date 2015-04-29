var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/livechat');
exports.mongoose=mongoose;